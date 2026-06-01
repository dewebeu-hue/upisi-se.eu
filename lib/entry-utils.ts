import {
  DISPLAY_NAME_MAX_LENGTH,
  LONG_ANSWER_MAX_LENGTH,
  SHORT_ANSWER_MAX_LENGTH,
} from "./limits.ts";

export type EntryAnswerVisibility = "ownerOnly" | "quizAllowed";

export type EntryQuestion = {
  key: "favoriteSong" | "bestMemory" | "nickname" | "message";
  label: string;
  helperText: string;
  maxLength: number;
  required: boolean;
  privateHint: boolean;
  quizEligible: boolean;
  visibility: EntryAnswerVisibility;
};

export type EntryAnswerValue = {
  questionKey: string;
  questionText: string;
  value: string;
  visibility: EntryAnswerVisibility;
};

type EntryInput = {
  displayName: string;
  answers: Record<string, string>;
  consentToOwnerView: boolean;
  consentToQuizUse: boolean;
};

type EntryValue = {
  displayName: string;
  answers: EntryAnswerValue[];
  consentToOwnerView: boolean;
  consentToQuizUse: boolean;
};

export type EntryValidationErrors = {
  displayName?: string;
  consentToOwnerView?: string;
} & Partial<Record<EntryQuestion["key"], string>>;

type EntryValidationResult =
  | {
      ok: true;
      value: EntryValue;
    }
  | {
      ok: false;
      errors: EntryValidationErrors;
    };

export const DEFAULT_ENTRY_QUESTIONS: EntryQuestion[] = [
  {
    key: "favoriteSong",
    label: "Koja pjesma te odmah vrati u te dane?",
    helperText: "Može hit iz školskog busa, izlaska ili MSN statusa.",
    maxLength: SHORT_ANSWER_MAX_LENGTH,
    required: true,
    privateHint: false,
    quizEligible: true,
    visibility: "quizAllowed",
  },
  {
    key: "bestMemory",
    label: "Najdraža uspomena s tom ekipom?",
    helperText: "Kratko, toplo, smiješno ili malo neugodno.",
    maxLength: LONG_ANSWER_MAX_LENGTH,
    required: true,
    privateHint: true,
    quizEligible: true,
    visibility: "quizAllowed",
  },
  {
    key: "nickname",
    label: "Nadimak iz tog vremena?",
    helperText: "Ako ga želiš priznati.",
    maxLength: SHORT_ANSWER_MAX_LENGTH,
    required: false,
    privateHint: false,
    quizEligible: true,
    visibility: "quizAllowed",
  },
  {
    key: "message",
    label: "Poruka vlasnici leksikona",
    helperText: "Ne mora biti za kviz. Samo mala poruka.",
    maxLength: LONG_ANSWER_MAX_LENGTH,
    required: false,
    privateHint: true,
    quizEligible: false,
    visibility: "ownerOnly",
  },
];

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function validateEntryInput(input: EntryInput): EntryValidationResult {
  const displayName = normalizeText(input.displayName);
  const errors: EntryValidationErrors = {};
  const answers: EntryAnswerValue[] = [];

  if (!displayName) {
    errors.displayName = "Ime je obavezno.";
  } else if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    errors.displayName = `Ime može imati najviše ${DISPLAY_NAME_MAX_LENGTH} znakova.`;
  }

  if (!input.consentToOwnerView) {
    errors.consentToOwnerView =
      "Za upis moraš dopustiti vlasnici da vidi tvoje odgovore.";
  }

  for (const question of DEFAULT_ENTRY_QUESTIONS) {
    const value = normalizeText(input.answers[question.key] ?? "");

    if (question.required && !value) {
      errors[question.key] = "Ovo pitanje je obavezno.";
      continue;
    }

    if (value.length > question.maxLength) {
      errors[question.key] = `Odgovor može imati najviše ${question.maxLength} znakova.`;
      continue;
    }

    if (value) {
      answers.push({
        questionKey: question.key,
        questionText: question.label,
        value,
        visibility: question.visibility,
      });
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      displayName,
      answers,
      consentToOwnerView: input.consentToOwnerView,
      consentToQuizUse: input.consentToQuizUse,
    },
  };
}
