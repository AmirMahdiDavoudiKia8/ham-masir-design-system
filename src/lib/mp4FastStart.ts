/**
 * Relocates an MP4/M4A file's `moov` box to before `mdat` ("faststart"),
 * the same fix `ffmpeg -movflags faststart` / the `qtfaststart` CLI does.
 * Voice memos recorded on a phone are often written with `moov` at the end
 * of the file — the browser's <audio> element needs the metadata in `moov`
 * before it can start playing, so a trailing `moov` means "downloads the
 * whole file (or fails) before it makes a sound" instead of "plays".
 *
 * Deliberately conservative: any box layout this doesn't recognize (missing
 * ftyp/moov/mdat, a box that runs to EOF, a 64-bit size too large to
 * represent as a JS number) makes it bail out and return the original
 * buffer untouched. Silently not fixing a file is fine; corrupting an
 * upload is not.
 */
export function fastStartMp4(input: Buffer): Buffer {
  try {
    const boxes = readTopLevelBoxes(input);
    if (!boxes) return input;

    const moovIndex = boxes.findIndex((b) => b.type === "moov");
    const mdatIndex = boxes.findIndex((b) => b.type === "mdat");
    if (moovIndex === -1 || mdatIndex === -1) return input;
    if (moovIndex < mdatIndex) return input; // already faststart

    const moovBox = boxes[moovIndex];
    const moovBytes = input.subarray(moovBox.start, moovBox.end);
    const shift = moovBytes.length;

    const patchedMoov = patchChunkOffsets(moovBytes, shift);
    if (!patchedMoov) return input;

    // Every other box, in its original relative order, with moov spliced
    // back in right after ftyp (or at the very front if there's no ftyp)
    // instead of back where it originally was — that's the actual "move
    // moov before mdat" this function exists to do.
    const otherBoxes = boxes.filter((_, i) => i !== moovIndex);
    const ftypIndex = otherBoxes.findIndex((b) => b.type === "ftyp");
    const insertAt = ftypIndex === -1 ? 0 : ftypIndex + 1;

    const parts = otherBoxes.map((b) => input.subarray(b.start, b.end));
    parts.splice(insertAt, 0, patchedMoov);

    return Buffer.concat(parts);
  } catch {
    return input;
  }
}

interface TopLevelBox {
  type: string;
  start: number;
  end: number;
}

/**
 * Reads top-level boxes (ftyp/moov/mdat/free/...). Handles the 64-bit
 * "largesize" form (32-bit size field == 1, real size in the next 8 bytes)
 * — `mdat` commonly uses it even for files well under 4GB, and it's exactly
 * the box most likely to hold the whole file, so skipping it here would
 * defeat the point. Rejects only a to-EOF box (size 0) or one whose 64-bit
 * size doesn't fit a JS-safe integer, neither of which occurs at the sizes
 * this app ever accepts (a few MB, capped well below Number.MAX_SAFE_INTEGER).
 */
function readTopLevelBoxes(data: Buffer): TopLevelBox[] | null {
  const boxes: TopLevelBox[] = [];
  let offset = 0;

  while (offset < data.length) {
    if (offset + 8 > data.length) return null;
    let size = data.readUInt32BE(offset);
    const type = data.toString("ascii", offset + 4, offset + 8);

    if (size === 0) return null; // extends to EOF — bail out
    if (size === 1) {
      if (offset + 16 > data.length) return null;
      const bigSize = data.readBigUInt64BE(offset + 8);
      if (bigSize > BigInt(Number.MAX_SAFE_INTEGER)) return null;
      size = Number(bigSize);
    }
    if (offset + size > data.length || size < 8) return null;

    boxes.push({ type, start: offset, end: offset + size });
    offset += size;
  }

  return boxes;
}

/**
 * Walks into a `moov` box's children to find every `stco` (32-bit chunk
 * offset table) and `co64` (64-bit) box and adds `shift` to each entry —
 * those are the only absolute file offsets moov holds, and every one of
 * them now points `shift` bytes further into the file since moov itself
 * moved from after mdat to before it.
 */
function patchChunkOffsets(moov: Buffer, shift: number): Buffer | null {
  const patched = Buffer.from(moov);
  if (!walkAndPatch(patched, 8, patched.length, shift)) return null;
  return patched;
}

function walkAndPatch(buf: Buffer, start: number, end: number, shift: number): boolean {
  let offset = start;

  while (offset < end) {
    if (offset + 8 > end) return false;
    const size = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    if (size === 0 || size === 1) return false;
    if (offset + size > end) return false;

    if (type === "stco") {
      if (!patchStco(buf, offset, offset + size, shift)) return false;
    } else if (type === "co64") {
      if (!patchCo64(buf, offset, offset + size, shift)) return false;
    } else if (CONTAINER_TYPES.has(type)) {
      if (!walkAndPatch(buf, offset + 8, offset + size, shift)) return false;
    }

    offset += size;
  }

  return true;
}

const CONTAINER_TYPES = new Set(["trak", "mdia", "minf", "stbl", "edts"]);

function patchStco(buf: Buffer, boxStart: number, boxEnd: number, shift: number): boolean {
  // full box header (version+flags, 4 bytes) + entry count (4 bytes)
  const entriesStart = boxStart + 8 + 8;
  if (entriesStart > boxEnd) return false;
  const count = buf.readUInt32BE(boxStart + 8 + 4);
  if (entriesStart + count * 4 > boxEnd) return false;

  for (let i = 0; i < count; i++) {
    const pos = entriesStart + i * 4;
    const value = buf.readUInt32BE(pos);
    const newValue = value + shift;
    if (newValue > 0xffffffff) return false; // would need co64 — bail out, don't corrupt
    buf.writeUInt32BE(newValue, pos);
  }
  return true;
}

function patchCo64(buf: Buffer, boxStart: number, boxEnd: number, shift: number): boolean {
  const entriesStart = boxStart + 8 + 8;
  if (entriesStart > boxEnd) return false;
  const count = buf.readUInt32BE(boxStart + 8 + 4);
  if (entriesStart + count * 8 > boxEnd) return false;

  for (let i = 0; i < count; i++) {
    const pos = entriesStart + i * 8;
    const value = buf.readBigUInt64BE(pos);
    buf.writeBigUInt64BE(value + BigInt(shift), pos);
  }
  return true;
}
