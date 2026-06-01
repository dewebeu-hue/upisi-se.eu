import { makeFunctionReference } from "convex/server";
import type { Id } from "@/convex/_generated/dataModel";
import type { EntryAnswerValue } from "@/lib/entry-utils";

export type CreateLexiconArgs = {
  title: string;
  ownerName: string;
};

export type CreateLexiconResult = {
  lexiconId: Id<"lexicons">;
  slug: string;
  adminToken: string;
};

export type PublicInviteResult = {
  _id: Id<"lexicons">;
  title: string;
  slug: string;
  ownerName: string;
  entryCount: number;
  quizUnlocked: boolean;
} | null;

export type EntryAnswerInput = {
  questionKey: string;
  value: string;
};

export type CreateEntryArgs = {
  slug: string;
  displayName: string;
  answers: EntryAnswerInput[];
  consentToOwnerView: boolean;
  consentToQuizUse: boolean;
};

export type CreateEntryResult = {
  entryId: Id<"entries">;
  editToken: string;
  slug: string;
};

export type EntryForEditResult = {
  entry: {
    _id: Id<"entries">;
    displayName: string;
    answers: EntryAnswerValue[];
    consentToOwnerView: boolean;
    consentToQuizUse: boolean;
  };
  lexicon: {
    title: string;
    slug: string;
    ownerName: string;
  };
} | null;

export const createLexiconMutation = makeFunctionReference<
  "mutation",
  CreateLexiconArgs,
  CreateLexiconResult
>("lexicons:createLexicon");

export const getPublicInviteQuery = makeFunctionReference<
  "query",
  { slug: string },
  PublicInviteResult
>("lexicons:getPublicInvite");

export const createEntryMutation = makeFunctionReference<
  "mutation",
  CreateEntryArgs,
  CreateEntryResult
>("entries:createEntry");

export const getEntryForEditQuery = makeFunctionReference<
  "query",
  { entryId: Id<"entries">; token: string },
  EntryForEditResult
>("entries:getEntryForEdit");

export const updateEntryMutation = makeFunctionReference<
  "mutation",
  {
    entryId: Id<"entries">;
    token: string;
    displayName: string;
    answers: EntryAnswerInput[];
    consentToOwnerView: boolean;
    consentToQuizUse: boolean;
  },
  { ok: true }
>("entries:updateEntry");

export const deleteEntryMutation = makeFunctionReference<
  "mutation",
  { entryId: Id<"entries">; token: string },
  { ok: true }
>("entries:deleteEntry");
