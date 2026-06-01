import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import {
  getActiveEntryForEdit,
  getActiveLexiconForAdmin,
  getTokenPepper,
  toActiveLexicon,
} from "./authLinks";
import { ACTIVE_STATUS, DELETED_STATUS, createDeletedTimestamp, now } from "./shared";
import { AppValidationError } from "../lib/errors";
import {
  MAX_ENTRIES_PER_LEXICON,
  SHORT_ANSWER_MAX_LENGTH,
} from "../lib/limits";
import { createRandomToken, hashToken } from "../lib/tokens";
import {
  validateAnswerList,
  validateBooleanConsent,
  validateDisplayName,
  validateOptionalText,
} from "../lib/validation";

const INVALID_ENTRY_LINK_MESSAGE =
  "Privatni link nije valjan ili upis nije dostupan.";
const LEXICON_UNAVAILABLE_MESSAGE = "Leksikon nije dostupan.";

const answerValidator = v.object({
  questionId: v.string(),
  question: v.string(),
  answer: v.string(),
  visibility: v.union(v.literal("ownerOnly"), v.literal("quizEligible")),
  isPrivate: v.boolean(),
});

function createEditPath(entryId: string, editToken: string): string {
  const params = new URLSearchParams({ token: editToken });
  return `/e/${encodeURIComponent(entryId)}?${params.toString()}`;
}

function validateStickerId(value: string | undefined): string | undefined {
  return validateOptionalText(value, "Naljepnica", SHORT_ANSWER_MAX_LENGTH);
}

function validateMood(value: string | undefined): string | undefined {
  return validateOptionalText(value, "Mood", SHORT_ANSWER_MAX_LENGTH);
}

function validateEntryPayload(args: {
  displayName: string;
  answers: unknown;
  stickerId?: string;
  mood?: string;
  consentOwnerView: boolean;
  consentQuizUse: boolean;
}) {
  return {
    displayName: validateDisplayName(args.displayName),
    answers: validateAnswerList(args.answers),
    stickerId: validateStickerId(args.stickerId),
    mood: validateMood(args.mood),
    consentOwnerView: validateBooleanConsent(
      args.consentOwnerView,
      "Pristanak za prikaz vlasnici",
    ),
    consentQuizUse: args.consentQuizUse,
  };
}

function toEntryView(entry: Doc<"entries">) {
  return {
    _id: entry._id,
    displayName: entry.displayName,
    answers: entry.answers,
    stickerId: entry.stickerId,
    mood: entry.mood,
    consentQuizUse: entry.consentQuizUse,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

function toEditableEntryView(entry: Doc<"entries">, lexicon: Doc<"lexicons">) {
  return {
    _id: entry._id,
    lexiconId: entry.lexiconId,
    lexiconSlug: lexicon.slug,
    lexiconTitle: lexicon.title,
    displayName: entry.displayName,
    answers: entry.answers,
    stickerId: entry.stickerId,
    mood: entry.mood,
    consentOwnerView: entry.consentOwnerView,
    consentQuizUse: entry.consentQuizUse,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

function createLexiconEntryPatch(
  lexicon: Doc<"lexicons">,
  nextEntryCount: number,
  timestamp: number,
) {
  return {
    entryCount: nextEntryCount,
    quizUnlocked: nextEntryCount >= lexicon.quizUnlockEntryCount,
    updatedAt: timestamp,
  };
}

export const createEntry = mutation({
  args: {
    lexiconId: v.id("lexicons"),
    displayName: v.string(),
    answers: v.array(answerValidator),
    stickerId: v.optional(v.string()),
    mood: v.optional(v.string()),
    consentOwnerView: v.boolean(),
    consentQuizUse: v.boolean(),
  },
  handler: async (ctx, args) => {
    const lexicon = toActiveLexicon(await ctx.db.get(args.lexiconId));

    if (!lexicon) {
      throw new AppValidationError(
        "lexicon_unavailable",
        LEXICON_UNAVAILABLE_MESSAGE,
      );
    }

    if (lexicon.entryCount >= MAX_ENTRIES_PER_LEXICON) {
      throw new AppValidationError(
        "lexicon_entry_limit_reached",
        "Ovaj leksikon je dosegnuo maksimalan broj upisa.",
      );
    }

    const payload = validateEntryPayload(args);
    const editToken = createRandomToken();
    const deleteTokenHash = await hashToken(editToken, getTokenPepper());
    const timestamp = now();
    const nextEntryCount = lexicon.entryCount + 1;
    const nextQuizUnlocked =
      lexicon.quizUnlocked || nextEntryCount >= lexicon.quizUnlockEntryCount;

    const entryId = await ctx.db.insert("entries", {
      lexiconId: lexicon._id,
      displayName: payload.displayName,
      answers: payload.answers,
      stickerId: payload.stickerId,
      mood: payload.mood,
      deleteTokenHash,
      consentOwnerView: payload.consentOwnerView,
      consentQuizUse: payload.consentQuizUse,
      status: ACTIVE_STATUS,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await ctx.db.patch(lexicon._id, {
      entryCount: nextEntryCount,
      quizUnlocked: nextQuizUnlocked,
      updatedAt: timestamp,
    });

    return {
      entryId,
      editToken,
      editPath: createEditPath(entryId, editToken),
      lexiconId: lexicon._id,
      lexiconSlug: lexicon.slug,
      quizUnlocked: nextQuizUnlocked,
      entryCount: nextEntryCount,
      quizUnlockEntryCount: lexicon.quizUnlockEntryCount,
    };
  },
});

export const listEntriesForAdmin = query({
  args: {
    lexiconId: v.id("lexicons"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const lexicon = await getActiveLexiconForAdmin(
      ctx.db,
      args.lexiconId,
      args.token,
    );

    if (!lexicon) {
      return null;
    }

    const entries = await ctx.db
      .query("entries")
      .withIndex("by_lexiconId_status_createdAt", (queryBuilder) =>
        queryBuilder.eq("lexiconId", lexicon._id).eq("status", ACTIVE_STATUS),
      )
      .order("desc")
      .collect();

    return {
      lexicon: {
        _id: lexicon._id,
        slug: lexicon.slug,
        ownerName: lexicon.ownerName,
        title: lexicon.title,
        theme: lexicon.theme,
        coverStyle: lexicon.coverStyle,
        entryCount: lexicon.entryCount,
        quizUnlockEntryCount: lexicon.quizUnlockEntryCount,
        quizUnlocked: lexicon.quizUnlocked,
      },
      entries: entries.map(toEntryView),
    };
  },
});

export const getEntryForEdit = query({
  args: {
    entryId: v.id("entries"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const entry = await getActiveEntryForEdit(ctx.db, args.entryId, args.token);

    if (!entry) {
      return null;
    }

    const lexicon = toActiveLexicon(await ctx.db.get(entry.lexiconId));

    if (!lexicon) {
      return null;
    }

    return toEditableEntryView(entry, lexicon);
  },
});

export const updateEntry = mutation({
  args: {
    entryId: v.id("entries"),
    token: v.string(),
    displayName: v.string(),
    answers: v.array(answerValidator),
    stickerId: v.optional(v.string()),
    mood: v.optional(v.string()),
    consentOwnerView: v.boolean(),
    consentQuizUse: v.boolean(),
  },
  handler: async (ctx, args) => {
    const entry = await getActiveEntryForEdit(ctx.db, args.entryId, args.token);

    if (!entry) {
      return {
        ok: false,
        message: INVALID_ENTRY_LINK_MESSAGE,
      };
    }

    const lexicon = toActiveLexicon(await ctx.db.get(entry.lexiconId));

    if (!lexicon) {
      return {
        ok: false,
        message: INVALID_ENTRY_LINK_MESSAGE,
      };
    }

    const payload = validateEntryPayload(args);

    await ctx.db.patch(entry._id, {
      displayName: payload.displayName,
      answers: payload.answers,
      stickerId: payload.stickerId,
      mood: payload.mood,
      consentOwnerView: payload.consentOwnerView,
      consentQuizUse: payload.consentQuizUse,
      updatedAt: now(),
    });

    return { ok: true };
  },
});

export const softDeleteEntry = mutation({
  args: {
    entryId: v.id("entries"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const entry = await getActiveEntryForEdit(ctx.db, args.entryId, args.token);

    if (!entry) {
      return {
        ok: false,
        message: INVALID_ENTRY_LINK_MESSAGE,
      };
    }

    const lexicon = toActiveLexicon(await ctx.db.get(entry.lexiconId));

    if (!lexicon) {
      return {
        ok: false,
        message: INVALID_ENTRY_LINK_MESSAGE,
      };
    }

    const deletedAt = createDeletedTimestamp();
    const nextEntryCount = Math.max(0, lexicon.entryCount - 1);

    await ctx.db.patch(entry._id, {
      status: DELETED_STATUS,
      deletedAt,
      updatedAt: deletedAt,
    });

    await ctx.db.patch(
      lexicon._id,
      createLexiconEntryPatch(lexicon, nextEntryCount, deletedAt),
    );

    return { ok: true };
  },
});

export const deleteEntry = softDeleteEntry;
