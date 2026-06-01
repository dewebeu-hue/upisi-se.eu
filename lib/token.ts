const TOKEN_BYTES = 32;
const BASE64_URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

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

export function createSecretToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
