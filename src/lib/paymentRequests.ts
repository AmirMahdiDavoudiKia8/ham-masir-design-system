import { randomBytes } from "node:crypto";
import { withFileLock } from "@/lib/fileLock";
import { readJson, writeJson } from "@/lib/storage";

export interface PaymentRequest {
  code: string;
  name: string;
  phone: string;
  mentorId: string;
  mentorName: string;
  planTitle: string;
  slot: string;
  price?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  resolvedAt?: string;
}

const FILE = "src/data/paymentRequests.json";
// Avoids visually-ambiguous characters (0/O, 1/I/l) since a student reads
// this code off their phone and it round-trips through a Telegram/Bale
// deep-link `/start` payload.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateCode(): string {
  const bytes = randomBytes(6);
  let code = "";
  for (const b of bytes) code += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return code;
}

async function getAll(): Promise<PaymentRequest[]> {
  return readJson<PaymentRequest[]>(FILE, []);
}

async function saveAll(requests: PaymentRequest[]): Promise<void> {
  await writeJson(FILE, requests);
}

/** Called from the booking/payment screen once identity is verified — creates the pending record the bot will look up by its short code. */
export async function createPaymentRequest(
  input: Omit<PaymentRequest, "code" | "status" | "createdAt">,
): Promise<PaymentRequest> {
  return withFileLock(FILE, async () => {
    const requests = await getAll();
    let code = generateCode();
    while (requests.some((r) => r.code === code)) code = generateCode();

    const request: PaymentRequest = {
      ...input,
      code,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    requests.push(request);
    await saveAll(requests);
    return request;
  });
}

export async function getPaymentRequest(code: string): Promise<PaymentRequest | null> {
  const requests = await getAll();
  return requests.find((r) => r.code === code) ?? null;
}

/** All payment requests, for cross-referencing against leads/bookings by phone (see lib/studentJourney.ts). */
export async function getAllPaymentRequests(): Promise<PaymentRequest[]> {
  return getAll();
}

export async function resolvePaymentRequest(
  code: string,
  status: "approved" | "rejected",
): Promise<PaymentRequest | null> {
  return withFileLock(FILE, async () => {
    const requests = await getAll();
    const request = requests.find((r) => r.code === code);
    if (!request) return null;
    request.status = status;
    request.resolvedAt = new Date().toISOString();
    await saveAll(requests);
    return request;
  });
}
