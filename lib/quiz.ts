export const QUIZ_MIN_ELIGIBLE_ENTRIES = 3;
export const QUIZ_MAX_ROUNDS = 8;

export type QuizAnswerVisibility = "ownerOnly" | "quizEligible";

export type QuizCandidateAnswer = {
  questionId: string;
  question: string;
  answer: string;
  visibility: QuizAnswerVisibility;
  isPrivate: boolean;
};

export type QuizEntryInput = {
  entryId: string;
  displayName: string;
  consentQuizUse: boolean;
  createdAt: number;
  answers: readonly QuizCandidateAnswer[];
};

export type QuizCandidate = {
  entryId: string;
  displayName: string;
  questionId: string;
  question: string;
  answer: string;
  createdAt: number;
};

export type QuizChoice = {
  id: string;
  displayName: string;
};

export type QuizRound = {
  id: string;
  question: string;
  answer: string;
  choices: QuizChoice[];
  correctChoiceId: string;
};

export type QuizResult = {
  key: "legend" | "solid" | "warmup";
  title: string;
  description: string;
  sticker: string;
  shareLine: string;
};

export function getQuizResult(score: number, totalRounds: number): QuizResult {
  const safeTotalRounds = Math.max(totalRounds, 1);
  const ratio = score / safeTotalRounds;

  if (ratio >= 0.8) {
    return {
      key: "legend",
      title: "Razredna legenda",
      description:
        "Ti očito pamtiš tko je pisao kojim rukopisom, čak i kad su gel olovke radile protiv svih.",
      sticker: "⭐",
      shareLine: "Skoro sve sam pogodila. Ovo traži revanš.",
    };
  }

  if (ratio >= 0.45) {
    return {
      key: "solid",
      title: "Detektivka iz zadnje klupe",
      description:
        "Imaš osjećaj za ekipu, ali par odgovora te uhvatilo na nostalgiju i krivi trag.",
      sticker: "💿",
      shareLine: "Nije loše, ali ekipa me par puta prevarila.",
    };
  }

  return {
    key: "warmup",
    title: "Nostalgično zagrijavanje",
    description:
      "Rezultat kaže da je vrijeme za čitanje starih upisa, poruka iz spomenara i jedan brzi revanš.",
    sticker: "📼",
    shareLine: "Pogodila sam manje nego što sam očekivala. Revanš odmah.",
  };
}

function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  return hash;
}

function sortBySeed<T>(
  items: readonly T[],
  seed: string,
  getKey: (item: T) => string,
): T[] {
  return [...items].sort((first, second) => {
    const firstHash = hashSeed(`${seed}:${getKey(first)}`);
    const secondHash = hashSeed(`${seed}:${getKey(second)}`);

    if (firstHash !== secondHash) {
      return firstHash - secondHash;
    }

    return getKey(first).localeCompare(getKey(second));
  });
}

export function getEligibleQuizCandidates(
  entries: readonly QuizEntryInput[],
): QuizCandidate[] {
  return entries.flatMap((entry) => {
    if (!entry.consentQuizUse) {
      return [];
    }

    return entry.answers.flatMap((answer) => {
      const normalizedAnswer = answer.answer.trim();
      const normalizedQuestion = answer.question.trim();

      if (
        !normalizedAnswer ||
        !normalizedQuestion ||
        answer.visibility !== "quizEligible" ||
        answer.isPrivate
      ) {
        return [];
      }

      return [
        {
          entryId: entry.entryId,
          displayName: entry.displayName,
          questionId: answer.questionId,
          question: normalizedQuestion,
          answer: normalizedAnswer,
          createdAt: entry.createdAt,
        },
      ];
    });
  });
}

export function countEligibleQuizEntries(
  candidates: readonly QuizCandidate[],
): number {
  return new Set(candidates.map((candidate) => candidate.entryId)).size;
}

export function buildQuizRounds(
  candidates: readonly QuizCandidate[],
  seed: string,
  maxRounds = QUIZ_MAX_ROUNDS,
): QuizRound[] {
  const eligibleEntries = Array.from(
    new Map(
      candidates.map((candidate) => [
        candidate.entryId,
        {
          entryId: candidate.entryId,
          displayName: candidate.displayName,
          createdAt: candidate.createdAt,
        },
      ]),
    ).values(),
  );

  if (eligibleEntries.length < QUIZ_MIN_ELIGIBLE_ENTRIES) {
    return [];
  }

  const sortedCandidates = sortBySeed(
    candidates,
    `${seed}:rounds`,
    (candidate) =>
      `${candidate.entryId}:${candidate.questionId}:${candidate.answer}`,
  );
  const usedQuestionEntryPairs = new Set<string>();
  const rounds: QuizRound[] = [];

  for (const candidate of sortedCandidates) {
    if (rounds.length >= maxRounds) {
      break;
    }

    const pairKey = `${candidate.entryId}:${candidate.questionId}`;

    if (usedQuestionEntryPairs.has(pairKey)) {
      continue;
    }

    usedQuestionEntryPairs.add(pairKey);

    const distractors = sortBySeed(
      eligibleEntries.filter((entry) => entry.entryId !== candidate.entryId),
      `${seed}:${candidate.entryId}:${candidate.questionId}:choices`,
      (entry) => `${entry.entryId}:${entry.displayName}`,
    ).slice(0, 3);
    const rawChoices = [
      {
        entryId: candidate.entryId,
        displayName: candidate.displayName,
      },
      ...distractors,
    ];
    const shuffledChoices = sortBySeed(
      rawChoices,
      `${seed}:${candidate.entryId}:${candidate.questionId}:shuffle`,
      (entry) => `${entry.entryId}:${entry.displayName}`,
    );
    const choices = shuffledChoices.map((entry, choiceIndex) => ({
      id: `round-${rounds.length}-choice-${choiceIndex}`,
      displayName: entry.displayName,
    }));
    const correctIndex = shuffledChoices.findIndex(
      (entry) => entry.entryId === candidate.entryId,
    );

    const fallbackChoice = choices[0];

    if (!fallbackChoice) {
      continue;
    }

    rounds.push({
      id: `round-${rounds.length}`,
      question: candidate.question,
      answer: candidate.answer,
      choices,
      correctChoiceId: choices[correctIndex]?.id ?? fallbackChoice.id,
    });
  }

  return rounds;
}
