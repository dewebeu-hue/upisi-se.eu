import { v } from "convex/values";
import { query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { ACTIVE_STATUS, DELETED_STATUS } from "./shared";
import {
  QUIZ_MIN_ELIGIBLE_ENTRIES,
  buildQuizRounds,
  countEligibleQuizEntries,
  getEligibleQuizCandidates,
  type QuizEntryInput,
} from "../lib/quiz";
import { isValidSlug } from "../lib/slug";

type PublicQuizLexicon = {
  slug: string;
  ownerName: string;
  title: string;
  theme: string;
  coverStyle: string;
  entryCount: number;
  quizUnlockEntryCount: number;
  quizUnlocked: boolean;
};

function toPublicQuizLexicon(lexicon: Doc<"lexicons">): PublicQuizLexicon {
  return {
    slug: lexicon.slug,
    ownerName: lexicon.ownerName,
    title: lexicon.title,
    theme: lexicon.theme,
    coverStyle: lexicon.coverStyle,
    entryCount: lexicon.entryCount,
    quizUnlockEntryCount: lexicon.quizUnlockEntryCount,
    quizUnlocked: lexicon.quizUnlocked,
  };
}

function toQuizEntryInput(entry: Doc<"entries">): QuizEntryInput {
  return {
    entryId: entry._id,
    displayName: entry.displayName,
    consentQuizUse: entry.consentQuizUse,
    createdAt: entry.createdAt,
    answers: entry.answers,
  };
}

export const getQuizBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = args.slug.trim();

    if (!isValidSlug(slug)) {
      return { status: "not_found" as const };
    }

    const lexicon = await ctx.db
      .query("lexicons")
      .withIndex("by_slug", (queryBuilder) => queryBuilder.eq("slug", slug))
      .unique();

    if (!lexicon || lexicon.status === DELETED_STATUS) {
      return { status: "not_found" as const };
    }

    const activeEntries = await ctx.db
      .query("entries")
      .withIndex("by_lexiconId_status_createdAt", (queryBuilder) =>
        queryBuilder.eq("lexiconId", lexicon._id).eq("status", ACTIVE_STATUS),
      )
      .order("asc")
      .collect();
    const publicLexicon = toPublicQuizLexicon(lexicon);
    const candidates = getEligibleQuizCandidates(
      activeEntries.map(toQuizEntryInput),
    );
    const eligibleEntryCount = countEligibleQuizEntries(candidates);
    const requiredEligibleEntryCount = QUIZ_MIN_ELIGIBLE_ENTRIES;

    if (!lexicon.quizUnlocked || lexicon.entryCount < lexicon.quizUnlockEntryCount) {
      return {
        status: "locked" as const,
        lexicon: publicLexicon,
        eligibleEntryCount,
        requiredEligibleEntryCount,
        rounds: [],
      };
    }

    const rounds = buildQuizRounds(candidates, lexicon.slug);

    if (rounds.length === 0) {
      return {
        status: "not_enough_answers" as const,
        lexicon: publicLexicon,
        eligibleEntryCount,
        requiredEligibleEntryCount,
        rounds,
      };
    }

    return {
      status: "ready" as const,
      lexicon: publicLexicon,
      eligibleEntryCount,
      requiredEligibleEntryCount,
      rounds,
    };
  },
});
