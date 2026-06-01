import { AppValidationError } from "./errors.ts";
import {
  getCanonicalCoverThemeKey,
  getCanonicalQuestionPackKey,
} from "./design.ts";
import {
  DISPLAY_NAME_MAX_LENGTH,
  LEXICON_TITLE_MAX_LENGTH,
  LONG_ANSWER_MAX_LENGTH,
  MAX_ANSWERS_PER_ENTRY,
  OWNER_NAME_MAX_LENGTH,
  SHORT_ANSWER_MAX_LENGTH,
  SLUG_MAX_LENGTH,
} from "./limits.ts";

export type ValidatedAnswer = {
  questionId: string;
  question: string;
  answer: string;
  visibility: "ownerOnly" | "quizEligible";
  isPrivate: boolean;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new AppValidationError(
      "invalid_text",
      `${fieldName} mora biti tekst.`,
    );
  }

  return value;
}

function assertBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new AppValidationError(
      "invalid_boolean",
      `${fieldName} mora biti potvrda.`,
    );
  }

  return value;
}

export function normalizeTextInput(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

export function validateRequiredText(
  value: string,
  fieldName: string,
  maxLength: number,
): string {
  const normalized = normalizeTextInput(value);

  if (!normalized) {
    throw new AppValidationError(
      "required_text_missing",
      `${fieldName} je obavezno.`,
    );
  }

  if (normalized.length > maxLength) {
    throw new AppValidationError(
      "text_too_long",
      `${fieldName} je predug.`,
    );
  }

  return normalized;
}

export function validateOptionalText(
  value: string | undefined,
  fieldName: string,
  maxLength: number,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = normalizeTextInput(value);

  if (!normalized) {
    return undefined;
  }

  if (normalized.length > maxLength) {
    throw new AppValidationError(
      "text_too_long",
      `${fieldName} je predug.`,
    );
  }

  return normalized;
}

export function validateBooleanConsent(value: boolean, fieldName: string): boolean {
  if (value !== true) {
    throw new AppValidationError(
      "consent_required",
      `${fieldName} je obavezno.`,
    );
  }

  return value;
}

export function validateAnswerList(answers: unknown): ValidatedAnswer[] {
  if (!Array.isArray(answers)) {
    throw new AppValidationError(
      "answers_not_array",
      "Odgovori moraju biti lista.",
    );
  }

  if (answers.length === 0) {
    throw new AppValidationError(
      "answers_empty",
      "Dodaj barem jedan odgovor.",
    );
  }

  if (answers.length > MAX_ANSWERS_PER_ENTRY) {
    throw new AppValidationError(
      "answers_too_many",
      "Previše odgovora u jednom upisu.",
    );
  }

  return answers.map((answer, index) => {
    if (!isRecord(answer)) {
      throw new AppValidationError(
        "answer_invalid",
        `Odgovor ${index + 1} nije valjan.`,
      );
    }

    const visibility = answer.visibility;

    if (visibility !== "ownerOnly" && visibility !== "quizEligible") {
      throw new AppValidationError(
        "answer_visibility_invalid",
        "Vidljivost odgovora nije valjana.",
      );
    }

    return {
      questionId: validateRequiredText(
        assertString(answer.questionId, "ID pitanja"),
        "ID pitanja",
        SHORT_ANSWER_MAX_LENGTH,
      ),
      question: validateRequiredText(
        assertString(answer.question, "Pitanje"),
        "Pitanje",
        LONG_ANSWER_MAX_LENGTH,
      ),
      answer: validateRequiredText(
        assertString(answer.answer, "Odgovor"),
        "Odgovor",
        LONG_ANSWER_MAX_LENGTH,
      ),
      visibility,
      isPrivate: assertBoolean(answer.isPrivate, "Privatnost odgovora"),
    };
  });
}

export function validateOwnerName(value: string): string {
  return validateRequiredText(value, "Ime", OWNER_NAME_MAX_LENGTH);
}

export function validateLexiconTitle(value: string): string {
  return validateRequiredText(value, "Naslov", LEXICON_TITLE_MAX_LENGTH);
}

export function validateDisplayName(value: string): string {
  return validateRequiredText(value, "Ime", DISPLAY_NAME_MAX_LENGTH);
}

export function validateQuestionPackKey(value: string): string {
  const key = validateRequiredText(value, "Ključ paketa pitanja", SLUG_MAX_LENGTH);
  const canonicalKey = getCanonicalQuestionPackKey(key);

  if (!canonicalKey) {
    throw new AppValidationError(
      "question_pack_key_invalid",
      "Ključ paketa pitanja nije valjan.",
    );
  }

  return canonicalKey;
}

export function validateThemeKey(value: string): string {
  const key = validateRequiredText(value, "Ključ teme", SLUG_MAX_LENGTH);
  const canonicalKey = getCanonicalCoverThemeKey(key);

  if (!canonicalKey) {
    throw new AppValidationError(
      "theme_key_invalid",
      "Ključ teme nije valjan.",
    );
  }

  return canonicalKey;
}
