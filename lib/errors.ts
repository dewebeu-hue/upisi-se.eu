export class AppValidationError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AppValidationError";
    this.code = code;
  }
}

const GENERIC_PUBLIC_ERROR_MESSAGE = "Nešto je pošlo po zlu. Pokušaj ponovno.";
const MAX_DEBUG_ERROR_LENGTH = 700;

export function getPublicErrorMessage(error: unknown): string {
  if (error instanceof AppValidationError) {
    return error.message;
  }

  return GENERIC_PUBLIC_ERROR_MESSAGE;
}

function redactDebugErrorText(value: string): string {
  return value
    .replace(/TOKEN_PEPPER/gi, "[skrivena-server-varijabla]")
    .replace(
      /\b(adminTokenHash|deleteTokenHash|adminToken|deleteToken)\s*[:=]\s*[^&,\s"')]+/gi,
      "[skriveno-polje]",
    )
    .replace(
      /\b(adminTokenHash|deleteTokenHash|adminToken|deleteToken)\b/gi,
      "[skriveno-polje]",
    )
    .replace(/\bpepper\b/gi, "[skriveno]")
    .replace(/\btoken\s*=\s*[^&\s"')]+/gi, "[skriveni-token-parametar]")
    .replace(/\btoken:\s*[^,\s"')]+/gi, "[skriveni-token-parametar]")
    .slice(0, MAX_DEBUG_ERROR_LENGTH);
}

export function getSafeDebugErrorMessage(error: unknown): string {
  if (error instanceof AppValidationError) {
    return redactDebugErrorText(error.message);
  }

  if (error instanceof Error) {
    const name = redactDebugErrorText(error.name || "Error");
    const message = redactDebugErrorText(error.message || "");
    const combined = message ? `${name}: ${message}` : name;

    return combined.trim() || GENERIC_PUBLIC_ERROR_MESSAGE;
  }

  if (typeof error === "string") {
    return redactDebugErrorText(error) || GENERIC_PUBLIC_ERROR_MESSAGE;
  }

  return GENERIC_PUBLIC_ERROR_MESSAGE;
}
