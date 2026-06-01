import { internalMutation } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { QUIZ_UNLOCK_ENTRY_COUNT } from "../lib/limits";
import { ACTIVE_STATUS, now } from "./shared";

const DEFAULT_LEXICON_COVER_STYLE = "grid-notebook";
const DEFAULT_LEXICON_THEME = "grid-notebook";
const DEFAULT_QUESTION_PACK_KEY = "osnovna-1998";

type LexiconBackfillField =
  | "coverStyle"
  | "theme"
  | "questionPackKey"
  | "quizUnlockEntryCount"
  | "status"
  | "entryCount"
  | "quizUnlocked"
  | "updatedAt";

type LegacyLexiconSnapshot = Partial<Record<LexiconBackfillField, unknown>>;

type LexiconBackfillPatch = Partial<{
  coverStyle: string;
  theme: string;
  questionPackKey: string;
  quizUnlockEntryCount: number;
  status: typeof ACTIVE_STATUS;
  entryCount: number;
  quizUnlocked: boolean;
  updatedAt: number;
}>;

function getLegacyField(
  lexicon: Doc<"lexicons">,
  field: LexiconBackfillField,
): unknown {
  return (lexicon as unknown as LegacyLexiconSnapshot)[field];
}

function isMissing(
  lexicon: Doc<"lexicons">,
  field: LexiconBackfillField,
): boolean {
  return getLegacyField(lexicon, field) === undefined;
}

export const backfillLexiconDefaults = internalMutation({
  args: {},
  handler: async (ctx) => {
    const lexicons = await ctx.db.query("lexicons").collect();
    let patched = 0;

    for (const lexicon of lexicons) {
      const timestamp = now();
      const patch: LexiconBackfillPatch = {};

      if (isMissing(lexicon, "coverStyle")) {
        patch.coverStyle = DEFAULT_LEXICON_COVER_STYLE;
      }

      if (isMissing(lexicon, "theme")) {
        patch.theme = DEFAULT_LEXICON_THEME;
      }

      if (isMissing(lexicon, "questionPackKey")) {
        patch.questionPackKey = DEFAULT_QUESTION_PACK_KEY;
      }

      if (isMissing(lexicon, "quizUnlockEntryCount")) {
        patch.quizUnlockEntryCount = QUIZ_UNLOCK_ENTRY_COUNT;
      }

      if (isMissing(lexicon, "status")) {
        patch.status = ACTIVE_STATUS;
      }

      if (isMissing(lexicon, "entryCount")) {
        patch.entryCount = 0;
      }

      if (isMissing(lexicon, "quizUnlocked")) {
        patch.quizUnlocked = false;
      }

      if (isMissing(lexicon, "updatedAt")) {
        patch.updatedAt = timestamp;
      }

      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(lexicon._id, {
          ...patch,
          updatedAt: timestamp,
        });
        patched += 1;
      }
    }

    return {
      scanned: lexicons.length,
      patched,
    };
  },
});
