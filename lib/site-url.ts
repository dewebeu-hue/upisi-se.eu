import { LOCAL_SITE_URL } from "./constants.ts";

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/g, "");

  if (!trimmed) {
    return LOCAL_SITE_URL;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    return LOCAL_SITE_URL;
  }
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? LOCAL_SITE_URL);
}

export function createAbsoluteUrl(
  path: string,
  origin: string = getSiteUrl(),
): string {
  const siteUrl = normalizeSiteUrl(origin);

  return new URL(path, `${siteUrl}/`).toString();
}
