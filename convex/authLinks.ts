import type { Doc, Id } from "./_generated/dataModel";
import type { DatabaseReader } from "./_generated/server";
import { assertTokenPepper, verifyToken } from "../lib/tokens";
import { ACTIVE_STATUS, DELETED_STATUS } from "./shared";

export type ActiveLexiconDoc = Omit<Doc<"lexicons">, "status"> & {
  status: typeof ACTIVE_STATUS;
};

export type ActiveEntryDoc = Omit<Doc<"entries">, "status"> & {
  status: typeof ACTIVE_STATUS;
};

export function getTokenPepper(): string {
  return assertTokenPepper(process.env.TOKEN_PEPPER);
}

export function toActiveLexicon(
  lexicon: Doc<"lexicons"> | null,
): ActiveLexiconDoc | null {
  if (!lexicon || lexicon.status === DELETED_STATUS) {
    return null;
  }

  return {
    ...lexicon,
    status: ACTIVE_STATUS,
  };
}

export function toActiveEntry(
  entry: Doc<"entries"> | null,
): ActiveEntryDoc | null {
  if (!entry || entry.status === DELETED_STATUS) {
    return null;
  }

  return {
    ...entry,
    status: ACTIVE_STATUS,
  };
}

export async function getActiveLexiconForAdmin(
  db: DatabaseReader,
  lexiconId: Id<"lexicons">,
  token: string,
): Promise<ActiveLexiconDoc | null> {
  if (!token.trim()) {
    return null;
  }

  const lexicon = toActiveLexicon(await db.get(lexiconId));

  if (!lexicon) {
    return null;
  }

  const isValidToken = await verifyToken(
    token,
    getTokenPepper(),
    lexicon.adminTokenHash,
  );

  return isValidToken ? lexicon : null;
}

export async function getActiveEntryForEdit(
  db: DatabaseReader,
  entryId: Id<"entries">,
  token: string,
): Promise<ActiveEntryDoc | null> {
  if (!token.trim()) {
    return null;
  }

  const entry = toActiveEntry(await db.get(entryId));

  if (!entry) {
    return null;
  }

  const isValidToken = await verifyToken(
    token,
    getTokenPepper(),
    entry.deleteTokenHash,
  );

  return isValidToken ? entry : null;
}
