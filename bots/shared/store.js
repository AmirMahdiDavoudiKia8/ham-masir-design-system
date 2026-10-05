// Tiny JSON-file-backed key/value store so a chat's in-progress payment code
// survives a PM2 restart between "/start CODE" and the student sending their
// receipt photo. One file per platform (telegram/bale) since chat ids aren't
// comparable across the two.
const fs = require("node:fs");
const path = require("node:path");

const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function fileFor(platform) {
  return path.join(DATA_DIR, `${platform}-state.json`);
}

function load(platform) {
  try {
    return JSON.parse(fs.readFileSync(fileFor(platform), "utf-8"));
  } catch {
    return { pendingByChat: {}, chatByCode: {} };
  }
}

function save(platform, state) {
  fs.writeFileSync(fileFor(platform), `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

/** Called right after a student opens the bot via the site's deep-link. */
function setPendingCode(platform, chatId, code) {
  const state = load(platform);
  state.pendingByChat[chatId] = code;
  save(platform, state);
}

function getPendingCode(platform, chatId) {
  return load(platform).pendingByChat[chatId] ?? null;
}

/** Called once the receipt photo is forwarded to the admin, so the approve/reject callback later knows which chat to notify. */
function rememberStudentChat(platform, code, chatId) {
  const state = load(platform);
  state.chatByCode[code] = chatId;
  save(platform, state);
}

function getStudentChat(platform, code) {
  return load(platform).chatByCode[code] ?? null;
}

module.exports = { setPendingCode, getPendingCode, rememberStudentChat, getStudentChat };
