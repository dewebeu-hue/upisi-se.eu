import { SLUG_MAX_LENGTH } from "./limits.ts";

const FALLBACK_SLUG = "leksikon";
const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlugInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createBaseSlug(input: string): string {
  const normalized = normalizeSlugInput(input).slice(0, SLUG_MAX_LENGTH);
  const trimmed = normalized.replace(/^-+|-+$/g, "");

  return trimmed || FALLBACK_SLUG;
}

export function appendSlugSuffix(baseSlug: string, suffix: string): string {
  const safeSuffix = createBaseSlug(suffix);
  const suffixPart = `-${safeSuffix}`;
  const maxBaseLength = Math.max(1, SLUG_MAX_LENGTH - suffixPart.length);
  const safeBase = createBaseSlug(baseSlug)
    .slice(0, maxBaseLength)
    .replace(/-+$/g, "");

  return `${safeBase || FALLBACK_SLUG}${suffixPart}`.slice(0, SLUG_MAX_LENGTH);
}

export function isValidSlug(slug: string): boolean {
  return (
    slug.length > 0 &&
    slug.length <= SLUG_MAX_LENGTH &&
    VALID_SLUG_PATTERN.test(slug)
  );
}
