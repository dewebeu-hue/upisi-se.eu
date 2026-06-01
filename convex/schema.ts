import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const softDeleteStatus = v.union(v.literal("active"), v.literal("deleted"));

const answerVisibility = v.union(
  v.literal("ownerOnly"),
  v.literal("quizEligible"),
);

const questionType = v.union(
  v.literal("shortText"),
  v.literal("longText"),
  v.literal("select"),
  v.literal("optionalSecret"),
);

const quizRoundStatus = v.union(
  v.literal("active"),
  v.literal("archived"),
);

const eventType = v.union(
  v.literal("lexicon_created"),
  v.literal("invite_opened"),
  v.literal("entry_started"),
  v.literal("entry_submitted"),
  v.literal("admin_opened"),
  v.literal("share_clicked"),
  v.literal("quiz_unlocked"),
  v.literal("create_after_submit_clicked"),
);

export default defineSchema({
  lexicons: defineTable({
    slug: v.string(),
    ownerName: v.string(),
    title: v.string(),
    theme: v.string(),
    coverStyle: v.string(),
    questionPackKey: v.string(),
    adminTokenHash: v.string(),
    entryCount: v.number(),
    quizUnlockEntryCount: v.number(),
    quizUnlocked: v.boolean(),
    status: softDeleteStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_createdAt", ["createdAt"]),

  entries: defineTable({
    lexiconId: v.id("lexicons"),
    displayName: v.string(),
    answers: v.array(
      v.object({
        questionId: v.string(),
        question: v.string(),
        answer: v.string(),
        visibility: answerVisibility,
        isPrivate: v.boolean(),
      }),
    ),
    stickerId: v.optional(v.string()),
    mood: v.optional(v.string()),
    deleteTokenHash: v.string(),
    consentOwnerView: v.boolean(),
    consentQuizUse: v.boolean(),
    status: softDeleteStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_lexiconId", ["lexiconId"])
    .index("by_lexiconId_status_createdAt", [
      "lexiconId",
      "status",
      "createdAt",
    ])
    .index("by_status_createdAt", ["status", "createdAt"]),

  questionPacks: defineTable({
    key: v.string(),
    name: v.string(),
    description: v.string(),
    theme: v.string(),
    questions: v.array(
      v.object({
        id: v.string(),
        label: v.string(),
        helperText: v.optional(v.string()),
        type: questionType,
        required: v.boolean(),
        isPrivate: v.boolean(),
        quizEligible: v.boolean(),
        maxLength: v.number(),
        options: v.optional(v.array(v.string())),
      }),
    ),
    active: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_active_sortOrder", ["active", "sortOrder"]),

  quizRounds: defineTable({
    lexiconId: v.id("lexicons"),
    entryId: v.id("entries"),
    questionId: v.string(),
    answer: v.string(),
    status: quizRoundStatus,
    createdAt: v.number(),
  })
    .index("by_lexiconId", ["lexiconId"])
    .index("by_lexiconId_status_createdAt", [
      "lexiconId",
      "status",
      "createdAt",
    ])
    .index("by_entryId", ["entryId"]),

  events: defineTable({
    type: eventType,
    lexiconId: v.optional(v.id("lexicons")),
    entryId: v.optional(v.id("entries")),
    createdAt: v.number(),
    meta: v.optional(
      v.object({
        source: v.optional(v.string()),
        label: v.optional(v.string()),
      }),
    ),
  })
    .index("by_type_createdAt", ["type", "createdAt"])
    .index("by_lexiconId_createdAt", ["lexiconId", "createdAt"])
    .index("by_createdAt", ["createdAt"]),
});
