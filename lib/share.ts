export { createAbsoluteUrl, getSiteUrl } from "./site-url.ts";

export function createWhatsAppShareUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

export function createInviteShareText(
  ownerName: string,
  inviteUrl: string,
): string {
  const firstName = ownerName.trim() || "ekipin";
  const inviteHint = inviteUrl.trim() ? "Link je odmah ispod." : "";

  return [
    `Upiši se u ${firstName} leksikon kao nekad u osnovnoj ✨`,
    "Fali još par upisa do kviza 'Pogodi čiji je odgovor?'",
    inviteHint,
  ]
    .filter(Boolean)
    .join("\n");
}

export function createAfterEntryShareText(
  ownerName: string,
  inviteUrl: string,
): string {
  const firstName = ownerName.trim() || "ovaj";
  const inviteHint = inviteUrl.trim() ? "Link je odmah ispod." : "";

  return [
    `Ja sam se upravo upisala u ${firstName} leksikon 😂`,
    "Upiši se i ti kao nekad u osnovnoj ✨",
    inviteHint,
  ]
    .filter(Boolean)
    .join("\n");
}

export function createQuizResultShareText({
  lexiconTitle,
  ownerName,
  resultTitle,
  score,
  totalRounds,
  shareLine,
}: {
  lexiconTitle: string;
  ownerName: string;
  resultTitle: string;
  score: number;
  totalRounds: number;
  shareLine: string;
}): string {
  const firstName = ownerName.trim() || "ekipinom";
  const title = lexiconTitle.trim() || "leksikonu";

  return [
    `Igrala sam "Pogodi čiji je odgovor?" u ${firstName} leksikonu ✨`,
    `Rezultat: ${score}/${totalRounds} - ${resultTitle}`,
    shareLine,
    `Probaj i ti: ${title}`,
  ].join("\n");
}
