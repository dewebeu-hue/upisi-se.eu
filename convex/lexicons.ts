import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { DatabaseReader } from "./_generated/server";
import { ACTIVE_STATUS, DELETED_STATUS, createDeletedTimestamp, now } from "./shared";
import {
  getActiveLexiconForAdmin,
  getTokenPepper,
  type ActiveLexiconDoc,
} from "./authLinks";
import { AppValidationError } from "../lib/errors";
import { appendSlugSuffix, createBaseSlug, isValidSlug } from "../lib/slug";
import { createRandomToken, hashToken } from "../lib/tokens";
import {
  QUIZ_UNLOCK_ENTRY_COUNT,
  SLUG_MAX_LENGTH,
} from "../lib/limits";
import { getCanonicalCoverThemeKey } from "../lib/design";
import {
  validateLexiconTitle,
  validateOwnerName,
  validateQuestionPackKey,
  validateRequiredText,
  validateThemeKey,
} from "../lib/validation";

const MAX_SLUG_ATTEMPTS = 8;
const INVALID_PRIVATE_LINK_MESSAGE =
  "Privatni link nije valjan ili leksikon nije dostupan.";

function validateCoverStyle(value: string): string {
  const coverStyle = validateRequiredText(value, "Stil korica", SLUG_MAX_LENGTH);
  const canonicalCoverStyle = getCanonicalCoverThemeKey(coverStyle);

  if (!canonicalCoverStyle) {
    throw new AppValidationError(
      "cover_style_invalid",
      "Stil korica nije valjan.",
    );
  }

  return canonicalCoverStyle;
}

function createInvitePath(slug: string): string {
  return `/l/${encodeURIComponent(slug)}`;
}

function createAdminPath(lexiconId: string, adminToken: string): string {
  const params = new URLSearchParams({ token: adminToken });
  return `/admin/${encodeURIComponent(lexiconId)}?${params.toString()}`;
}

async function slugExists(db: DatabaseReader, slug: string): Promise<boolean> {
  const existing = await db
    .query("lexicons")
    .withIndex("by_slug", (queryBuilder) => queryBuilder.eq("slug", slug))
    .unique();

  return existing !== null;
}

async function createUniqueSlug(
  db: DatabaseReader,
  baseSlug: string,
): Promise<string> {
  if (!(await slugExists(db, baseSlug))) {
    return baseSlug;
  }

  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt += 1) {
    const suffix = createRandomToken().slice(0, 8).toLowerCase();
    const candidate = appendSlugSuffix(baseSlug, suffix);

    if (!(await slugExists(db, candidate))) {
      return candidate;
    }
  }

  throw new AppValidationError(
    "slug_unavailable",
    "Nije moguće generirati jedinstveni link. Pokušaj ponovno.",
  );
}

function toPublicLexicon(lexicon: ActiveLexiconDoc) {
  return {
    _id: lexicon._id,
    slug: lexicon.slug,
    ownerName: lexicon.ownerName,
    title: lexicon.title,
    theme: lexicon.theme,
    coverStyle: lexicon.coverStyle,
    questionPackKey: lexicon.questionPackKey,
    entryCount: lexicon.entryCount,
    quizUnlockEntryCount: lexicon.quizUnlockEntryCount,
    quizUnlocked: lexicon.quizUnlocked,
    createdAt: lexicon.createdAt,
  };
}

function toAdminLexicon(lexicon: ActiveLexiconDoc) {
  return {
    _id: lexicon._id,
    slug: lexicon.slug,
    ownerName: lexicon.ownerName,
    title: lexicon.title,
    theme: lexicon.theme,
    coverStyle: lexicon.coverStyle,
    questionPackKey: lexicon.questionPackKey,
    entryCount: lexicon.entryCount,
    quizUnlockEntryCount: lexicon.quizUnlockEntryCount,
    quizUnlocked: lexicon.quizUnlocked,
    status: lexicon.status,
    createdAt: lexicon.createdAt,
    updatedAt: lexicon.updatedAt,
  };
}

export const createLexicon = mutation({
  args: {
    ownerName: v.string(),
    title: v.string(),
    theme: v.string(),
    coverStyle: v.string(),
    questionPackKey: v.string(),
  },
  handler: async (ctx, args) => {
    const ownerName = validateOwnerName(args.ownerName);
    const title = validateLexiconTitle(args.title);
    const theme = validateThemeKey(args.theme);
    const coverStyle = validateCoverStyle(args.coverStyle);
    const questionPackKey = validateQuestionPackKey(args.questionPackKey);
    const slugBase = createBaseSlug(title || `${ownerName} leksikon`);
    const slug = await createUniqueSlug(ctx.db, slugBase);
    const adminToken = createRandomToken();
    const adminTokenHash = await hashToken(adminToken, getTokenPepper());
    const timestamp = now();

    const lexiconId = await ctx.db.insert("lexicons", {
      slug,
      ownerName,
      title,
      theme,
      coverStyle,
      questionPackKey,
      adminTokenHash,
      entryCount: 0,
      quizUnlockEntryCount: QUIZ_UNLOCK_ENTRY_COUNT,
      quizUnlocked: false,
      status: ACTIVE_STATUS,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return {
      lexiconId,
      slug,
      adminToken,
      invitePath: createInvitePath(slug),
      adminPath: createAdminPath(lexiconId, adminToken),
    };
  },
});

export const getPublicLexiconBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = args.slug.trim();

    if (!isValidSlug(slug)) {
      return null;
    }

    const lexicon = await ctx.db
      .query("lexicons")
      .withIndex("by_slug", (queryBuilder) => queryBuilder.eq("slug", slug))
      .unique();

    if (!lexicon || lexicon.status === DELETED_STATUS) {
      return null;
    }

    return toPublicLexicon({ ...lexicon, status: ACTIVE_STATUS });
  },
});

export const getAdminLexicon = query({
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

    return toAdminLexicon(lexicon);
  },
});

export const softDeleteLexicon = mutation({
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
      return {
        ok: false,
        message: INVALID_PRIVATE_LINK_MESSAGE,
      };
    }

    const deletedAt = createDeletedTimestamp();

    await ctx.db.patch(args.lexiconId, {
      status: DELETED_STATUS,
      deletedAt,
      updatedAt: deletedAt,
    });

    return { ok: true };
  },
});

export const getPublicInvite = getPublicLexiconBySlug;

export const getAdminOverview = query({
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

    return {
      lexicon: toAdminLexicon(lexicon),
      entries: [],
    };
  },
});
