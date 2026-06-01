import {
  LEXICON_TITLE_MAX_LENGTH,
  OWNER_NAME_MAX_LENGTH,
} from "./limits.ts";
import { createBaseSlug } from "./slug.ts";

type CreateLexiconInput = {
  title: string;
  ownerName: string;
};

type CreateLexiconValue = {
  title: string;
  ownerName: string;
  slugBase: string;
};

type CreateLexiconErrors = {
  title?: string;
  ownerName?: string;
};

type ValidationResult =
  | {
      ok: true;
      value: CreateLexiconValue;
    }
  | {
      ok: false;
      errors: CreateLexiconErrors;
    };

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function createSlugCandidate(value: string): string {
  return createBaseSlug(value);
}

export function validateCreateLexiconInput(
  input: CreateLexiconInput,
): ValidationResult {
  const title = normalizeText(input.title);
  const ownerName = normalizeText(input.ownerName);
  const errors: CreateLexiconErrors = {};

  if (!title) {
    errors.title = "Naziv leksikona je obavezan.";
  } else if (title.length > LEXICON_TITLE_MAX_LENGTH) {
    errors.title = `Naziv može imati najviše ${LEXICON_TITLE_MAX_LENGTH} znakova.`;
  }

  if (!ownerName) {
    errors.ownerName = "Ime je obavezno.";
  } else if (ownerName.length > OWNER_NAME_MAX_LENGTH) {
    errors.ownerName = `Ime može imati najviše ${OWNER_NAME_MAX_LENGTH} znakova.`;
  }

  if (errors.title || errors.ownerName) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      title,
      ownerName,
      slugBase: createSlugCandidate(title),
    },
  };
}
