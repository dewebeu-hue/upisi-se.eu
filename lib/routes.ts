function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

function withToken(path: string, token?: string): string {
  if (!token) {
    return path;
  }

  const params = new URLSearchParams({ token });
  return `${path}?${params.toString()}`;
}

export function homePath(): string {
  return "/";
}

export function newLexiconPath(): string {
  return "/novi";
}

export function lexiconInvitePath(slug: string): string {
  return `/l/${encodePathSegment(slug)}`;
}

export function demoInvitePath(): string {
  return "/demo/pozivnica";
}

export function lexiconEntryPath(slug: string): string {
  return `/l/${encodePathSegment(slug)}/upis`;
}

export function lexiconThanksPath(slug: string): string {
  return `/l/${encodePathSegment(slug)}/hvala`;
}

export function lexiconQuizPath(slug: string): string {
  return `/l/${encodePathSegment(slug)}/kviz`;
}

export function adminPath(lexiconId: string, token?: string): string {
  return withToken(`/admin/${encodePathSegment(lexiconId)}`, token);
}

export function editEntryPath(entryId: string, token?: string): string {
  return withToken(`/e/${encodePathSegment(entryId)}`, token);
}

export function privacyPath(): string {
  return "/privacy";
}

export function termsPath(): string {
  return "/terms";
}
