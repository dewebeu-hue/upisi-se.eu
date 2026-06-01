export class AppValidationError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AppValidationError";
    this.code = code;
  }
}

export function getPublicErrorMessage(error: unknown): string {
  if (error instanceof AppValidationError) {
    return error.message;
  }

  return "Nešto je pošlo po zlu. Pokušaj ponovno.";
}
