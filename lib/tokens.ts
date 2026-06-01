import { AppValidationError } from "./errors.ts";

const TOKEN_BYTES = 32;
const BASE64_URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function getCrypto(): Crypto {
  if (!globalThis.crypto?.getRandomValues || !globalThis.crypto.subtle) {
    throw new AppValidationError(
      "crypto_unavailable",
      "Sigurno generiranje tokena nije dostupno u ovom runtimeu.",
    );
  }

  return globalThis.crypto;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let result = "";

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = bytes[index + 1];
    const third = bytes[index + 2];

    result += BASE64_URL_ALPHABET[first >> 2];
    result += BASE64_URL_ALPHABET[((first & 0x03) << 4) | ((second ?? 0) >> 4)];

    if (index + 1 < bytes.length) {
      result +=
        BASE64_URL_ALPHABET[((second & 0x0f) << 2) | ((third ?? 0) >> 6)];
    }

    if (index + 2 < bytes.length) {
      result += BASE64_URL_ALPHABET[third & 0x3f];
    }
  }

  return result;
}

function constantTimeEqual(first: string, second: string): boolean {
  const maxLength = Math.max(first.length, second.length);
  let difference = first.length ^ second.length;

  for (let index = 0; index < maxLength; index += 1) {
    difference |=
      (first.charCodeAt(index) || 0) ^ (second.charCodeAt(index) || 0);
  }

  return difference === 0;
}

export function createRandomToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  getCrypto().getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export async function hashToken(
  token: string,
  pepper: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${token}.${pepper}`);
  const digest = await getCrypto().subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyToken(
  token: string,
  pepper: string,
  expectedHash: string,
): Promise<boolean> {
  const tokenHash = await hashToken(token, pepper);
  return constantTimeEqual(tokenHash, expectedHash);
}

export function assertTokenPepper(pepper: string | undefined): string {
  if (!pepper || !pepper.trim()) {
    throw new AppValidationError(
      "token_pepper_missing",
      "TOKEN_PEPPER nije postavljen.",
    );
  }

  return pepper;
}
