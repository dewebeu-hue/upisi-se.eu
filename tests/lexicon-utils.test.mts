import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createSlugCandidate,
  validateCreateLexiconInput,
} from "../lib/lexicon-utils.ts";
import { validateEntryInput } from "../lib/entry-utils.ts";
import { adminPath, editEntryPath } from "../lib/routes.ts";
import { createSecretToken, hashToken } from "../lib/token.ts";
import {
  appendSlugSuffix,
  createBaseSlug,
  isValidSlug,
  normalizeSlugInput,
} from "../lib/slug.ts";
import {
  assertTokenPepper,
  createRandomToken,
  hashToken as hashPepperedToken,
  verifyToken,
} from "../lib/tokens.ts";
import { AppValidationError, getPublicErrorMessage } from "../lib/errors.ts";
import {
  normalizeTextInput,
  validateAnswerList,
  validateDisplayName,
  validateLexiconTitle,
  validateOptionalText,
  validateRequiredText,
} from "../lib/validation.ts";
import {
  ACTIVE_STATUS,
  DELETED_STATUS,
  createDeletedTimestamp,
  now,
} from "../convex/shared.ts";
import { MAX_ANSWERS_PER_ENTRY, SLUG_MAX_LENGTH } from "../lib/limits.ts";

test("createSlugCandidate normalizes Croatian text into a safe URL slug", () => {
  assert.equal(
    createSlugCandidate("  Školski Leksikon Đurđice 2001!  "),
    "skolski-leksikon-durdice-2001",
  );
});

test("validateCreateLexiconInput trims valid title and owner name", () => {
  const result = validateCreateLexiconInput({
    title: "  Moj prvi leksikon  ",
    ownerName: "  Ana  ",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.value, {
      title: "Moj prvi leksikon",
      ownerName: "Ana",
      slugBase: "moj-prvi-leksikon",
    });
  }
});

test("validateCreateLexiconInput rejects empty and too long values", () => {
  const result = validateCreateLexiconInput({
    title: "",
    ownerName: "A".repeat(41),
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.title, "Naziv leksikona je obavezan.");
    assert.equal(
      result.errors.ownerName,
      "Ime može imati najviše 40 znakova.",
    );
  }
});

test("createSecretToken creates URL-safe non-repeating tokens", () => {
  const first = createSecretToken();
  const second = createSecretToken();

  assert.match(first, /^[A-Za-z0-9_-]+$/);
  assert.notEqual(first, second);
  assert.ok(first.length >= 32);
});

test("hashToken returns a deterministic sha-256 hex digest", async () => {
  const first = await hashToken("tajni-token");
  const second = await hashToken("tajni-token");

  assert.equal(first, second);
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.equal(first.includes("tajni-token"), false);
});

test("validateEntryInput trims answers and keeps quiz consent separate", () => {
  const result = validateEntryInput({
    displayName: "  Maja  ",
    answers: {
      favoriteSong: "  Britney - Toxic  ",
      bestMemory: "  Maturalac i CD player.  ",
      nickname: "",
      message: "  Vidimo se na kavi.  ",
    },
    consentToOwnerView: true,
    consentToQuizUse: false,
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.displayName, "Maja");
    assert.equal(result.value.consentToQuizUse, false);
    assert.deepEqual(
      result.value.answers.map((answer) => [answer.questionKey, answer.value]),
      [
        ["favoriteSong", "Britney - Toxic"],
        ["bestMemory", "Maturalac i CD player."],
        ["message", "Vidimo se na kavi."],
      ],
    );
  }
});

test("validateEntryInput rejects missing name, missing owner consent, and long answers", () => {
  const result = validateEntryInput({
    displayName: "",
    answers: {
      favoriteSong: "A".repeat(161),
      bestMemory: "",
      nickname: "",
      message: "",
    },
    consentToOwnerView: false,
    consentToQuizUse: true,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.displayName, "Ime je obavezno.");
    assert.equal(
      result.errors.favoriteSong,
      "Odgovor može imati najviše 160 znakova.",
    );
    assert.equal(
      result.errors.consentToOwnerView,
      "Za upis moraš dopustiti vlasnici da vidi tvoje odgovore.",
    );
  }
});

test("private route helpers safely encode token query params", () => {
  assert.equal(
    adminPath("abc 123", "tajni token+?"),
    "/admin/abc%20123?token=tajni+token%2B%3F",
  );
  assert.equal(
    editEntryPath("entry/1", "edit token"),
    "/e/entry%2F1?token=edit+token",
  );
});

test("slug helpers normalize Croatian text into bounded URL-safe slugs", () => {
  assert.equal(normalizeSlugInput(" Željkin Leksikon ✨ "), "zeljkin-leksikon");
  assert.equal(createBaseSlug("Anin leksikon"), "anin-leksikon");
  assert.equal(createBaseSlug(" Moj Turbo 2002!!! "), "moj-turbo-2002");
  assert.equal(createBaseSlug(""), "leksikon");
  assert.equal(isValidSlug("zeljkin-leksikon"), true);
  assert.equal(isValidSlug("-zeljkin-leksikon"), false);
  assert.equal(isValidSlug("zeljkin-leksikon-"), false);
  assert.equal(isValidSlug("zeljkin_leksikon"), false);

  const longSlug = appendSlugSuffix("a".repeat(SLUG_MAX_LENGTH), "suffix");

  assert.equal(longSlug.length <= SLUG_MAX_LENGTH, true);
  assert.match(longSlug, /-suffix$/);
});

test("token helpers create random tokens and verify peppered hashes", async () => {
  const tokenA = createRandomToken();
  const tokenB = createRandomToken();
  const pepper = assertTokenPepper("local-test-pepper");
  const hash = await hashPepperedToken(tokenA, pepper);

  assert.notEqual(tokenA, tokenB);
  assert.match(tokenA, /^[A-Za-z0-9_-]+$/);
  assert.equal(hash.includes(tokenA), false);
  assert.equal(await verifyToken(tokenA, pepper, hash), true);
  assert.equal(await verifyToken(tokenB, pepper, hash), false);
  assert.throws(() => assertTokenPepper(undefined), AppValidationError);
});

test("validation helpers normalize text and reject unsafe input shapes", () => {
  assert.equal(normalizeTextInput("  Ana   iz   8.b  "), "Ana iz 8.b");
  assert.equal(validateRequiredText("  Ana  ", "Ime", 10), "Ana");
  assert.equal(validateOptionalText("   ", "Poruka", 10), undefined);
  assert.equal(validateLexiconTitle(" Leksikon ekipe "), "Leksikon ekipe");
  assert.equal(validateDisplayName(" Maja "), "Maja");

  assert.throws(
    () => validateRequiredText("", "Ime", 10),
    /Ime je obavezno/,
  );
  assert.throws(
    () => validateOptionalText("predug tekst", "Poruka", 5),
    /Poruka je predug/,
  );

  assert.deepEqual(
    validateAnswerList([
      {
        questionId: "favorite-song",
        question: "Koja pjesma te vraća u te dane?",
        answer: "All the Things She Said",
        visibility: "quizEligible",
        isPrivate: false,
      },
    ]),
    [
      {
        questionId: "favorite-song",
        question: "Koja pjesma te vraća u te dane?",
        answer: "All the Things She Said",
        visibility: "quizEligible",
        isPrivate: false,
      },
    ],
  );

  assert.throws(() => validateAnswerList({}), /Odgovori moraju biti lista/);
  assert.throws(
    () =>
      validateAnswerList([
        {
          questionId: "secret",
          question: "Tajna?",
          answer: "",
          visibility: "public",
          isPrivate: "no",
        },
      ]),
    AppValidationError,
  );
});

test("public error messages hide unknown internals but keep validation copy", () => {
  const validationError = new AppValidationError(
    "display_name_required",
    "Ime je obavezno.",
  );

  assert.equal(getPublicErrorMessage(validationError), "Ime je obavezno.");
  assert.equal(
    getPublicErrorMessage(new Error("token=secret pepper=hidden stack")),
    "Nešto je pošlo po zlu. Pokušaj ponovno.",
  );
});

test("convex shared helpers expose safe statuses and timestamps", () => {
  assert.equal(ACTIVE_STATUS, "active");
  assert.equal(DELETED_STATUS, "deleted");
  assert.equal(typeof now(), "number");
  assert.equal(typeof createDeletedTimestamp(), "number");
});

test("convex lexicon functions expose the MVP API surface without leaking token hashes", () => {
  const source = readFileSync("convex/lexicons.ts", "utf8");
  const authSource = readFileSync("convex/authLinks.ts", "utf8");

  assert.match(source, /export const createLexicon = mutation/);
  assert.match(source, /export const getPublicLexiconBySlug = query/);
  assert.match(source, /export const getAdminLexicon = query/);
  assert.match(source, /export const softDeleteLexicon = mutation/);
  assert.match(authSource, /TOKEN_PEPPER/);
  assert.match(source, /adminTokenHash/);
  assert.doesNotMatch(source, /adminTokenHash:\s*lexicon\.adminTokenHash/);
  assert.doesNotMatch(source, /console\.(log|warn|error)/);
});

test("answer validation rejects empty and oversized answer lists", () => {
  assert.throws(() => validateAnswerList([]), AppValidationError);
  assert.throws(
    () =>
      validateAnswerList(
        Array.from({ length: MAX_ANSWERS_PER_ENTRY + 1 }, (_, index) => ({
          questionId: `question-${index}`,
          question: "Pitanje?",
          answer: "Odgovor",
          visibility: "ownerOnly",
          isPrivate: true,
        })),
      ),
    AppValidationError,
  );
});

test("convex entry functions expose the MVP API surface without leaking token hashes", () => {
  const source = readFileSync("convex/entries.ts", "utf8");
  const authSource = readFileSync("convex/authLinks.ts", "utf8");

  assert.match(source, /export const createEntry = mutation/);
  assert.match(source, /export const listEntriesForAdmin = query/);
  assert.match(source, /export const getEntryForEdit = query/);
  assert.match(source, /export const updateEntry = mutation/);
  assert.match(source, /export const softDeleteEntry = mutation/);
  assert.match(authSource, /TOKEN_PEPPER/);
  assert.match(source, /deleteTokenHash/);
  assert.doesNotMatch(source, /deleteTokenHash:\s*entry\.deleteTokenHash/);
  assert.doesNotMatch(source, /console\.(log|warn|error)/);
});
