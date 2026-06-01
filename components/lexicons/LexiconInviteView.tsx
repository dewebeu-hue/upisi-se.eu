"use client";

import { useMemo, useState, type ReactNode } from "react";
import { UnlockProgress } from "@/components/gamification/UnlockProgress";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverPreview } from "@/components/ui/CoverPreview";
import { NotebookHeader } from "@/components/ui/NotebookHeader";
import { NotebookPaper } from "@/components/ui/NotebookPaper";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SharePreviewCard } from "@/components/ui/SharePreviewCard";
import { copyTextToClipboard } from "@/lib/clipboard";
import { getCoverThemeByValues } from "@/lib/design";
import {
  createAbsoluteUrl,
  createInviteShareText,
  createWhatsAppShareUrl,
} from "@/lib/share";
import {
  demoInvitePath,
  lexiconEntryPath,
  lexiconInvitePath,
  newLexiconPath,
} from "@/lib/routes";

export type InviteLexicon = {
  slug: string;
  ownerName: string;
  title: string;
  theme: string;
  coverStyle: string;
  entryCount: number;
  quizUnlockEntryCount: number;
  quizUnlocked: boolean;
};

type LexiconInviteViewProps = {
  lexicon: InviteLexicon;
  isDemo?: boolean;
};

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const whatsAppButtonClassName =
  "border-[#128c7e] bg-[#25d366] text-[#0b2d20] shadow-[4px_5px_0_#0b2d20] hover:border-[#075e54] hover:bg-[#1ebe5d] hover:text-[#06281e] focus-visible:outline-[#25d366]";

export function InviteShell({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-8 sm:px-8 sm:py-16">
      <NotebookPaper className="w-full max-w-full min-w-0" variant="grid">
        {children}
      </NotebookPaper>
    </section>
  );
}

export function LexiconInviteView({
  isDemo = false,
  lexicon,
}: LexiconInviteViewProps) {
  const [copyMessage, setCopyMessage] = useState("");
  const invitePath = isDemo ? demoInvitePath() : lexiconInvitePath(lexicon.slug);
  const origin =
    configuredSiteUrl ||
    (typeof window === "undefined" ? "" : window.location.origin);
  const inviteUrl = useMemo(
    () => (origin ? createAbsoluteUrl(invitePath, origin) : invitePath),
    [invitePath, origin],
  );
  const entryPath = lexiconEntryPath(lexicon.slug);
  const entryCountLabel = lexicon.quizUnlocked
    ? "Dovoljno upisa za kviz"
    : `${lexicon.entryCount}/${lexicon.quizUnlockEntryCount} upisa do kviza`;
  const coverTheme = getCoverThemeByValues(lexicon.coverStyle, lexicon.theme);
  const shareText = createInviteShareText(lexicon.ownerName, inviteUrl);
  const whatsAppUrl = createWhatsAppShareUrl(shareText, inviteUrl);

  async function handleCopyLink() {
    setCopyMessage("");

    try {
      const copied = await copyTextToClipboard(inviteUrl);

      if (!copied) {
        setCopyMessage(
          "Nisam uspio automatski kopirati. Označi link i kopiraj ručno.",
        );
        return;
      }

      setCopyMessage("Link je kopiran!");
    } catch {
      setCopyMessage(
        "Nisam uspio automatski kopirati. Označi link i kopiraj ručno.",
      );
    }
  }

  return (
    <InviteShell>
      <div className="grid min-w-0 gap-7 overflow-hidden lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="min-w-0 space-y-6">
          <NotebookHeader
            description={
              isDemo
                ? "Ovo je samo primjer pozivnice. U pravom leksikonu ovdje bi se upisala i ostavila svoju stranicu."
                : "Odgovori na par nostalgičnih pitanja i ostavi joj stranicu u digitalnom leksikonu."
            }
            eyebrow={isDemo ? "Demo pozivnica" : "Pozivnica za leksikon"}
            sticker={coverTheme.sticker}
            title={`${lexicon.ownerName} te zove da se upišeš ✨`}
          />

          <div className="flex min-w-0 flex-wrap gap-2">
            {isDemo ? (
              <ProgressPill label="Ovo je samo primjer pozivnice" tone="blue" />
            ) : null}
            <ProgressPill
              className={lexicon.quizUnlocked ? "glitter-border" : undefined}
              label={entryCountLabel}
              tone={lexicon.quizUnlocked ? "success" : "yellow"}
            />
            <ProgressPill
              label={`Tema: ${coverTheme.label}`}
              tone={coverTheme.tone}
            />
            <ProgressPill label="Nema registracije" tone="blue" />
          </div>

          <div
            className={`min-w-0 overflow-hidden rounded-[1.25rem] border p-4 shadow-[var(--shadow-soft)] sm:p-5 ${coverTheme.accentClassName}`}
          >
            <p className="break-words text-sm font-black uppercase tracking-[0.12em] text-[var(--color-gel-pink)] [overflow-wrap:anywhere] sm:tracking-[0.14em]">
              Tvoj sljedeći korak
            </p>
            <h2 className="mt-3 break-words text-2xl font-black text-[var(--color-ink)] [overflow-wrap:anywhere]">
              Upiši se u “{lexicon.title}”
            </h2>
            <p className="mt-3 break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere]">
              {isDemo
                ? "U pravom leksikonu ovaj gumb vodi na formu za upis. Ovdje je demo siguran i ne sprema podatke."
                : "Vlasnica će tvoje odgovore vidjeti preko privatnog linka. Nema registracije i nema javnog popisa odgovora."}
            </p>
            <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {isDemo ? (
                <Button className="w-full sm:w-auto" disabled size="lg" type="button">
                  Ovdje bi se upisala
                </Button>
              ) : (
                <ButtonLink className="w-full sm:w-auto" href={entryPath} size="lg">
                  Upiši se
                </ButtonLink>
              )}
              <ButtonLink
                className="w-full sm:w-auto"
                href={newLexiconPath()}
                variant="accent"
              >
                Napravi svoj leksikon
              </ButtonLink>
            </div>
          </div>

          <UnlockProgress
            compact
            entryCount={lexicon.entryCount}
            quizUnlocked={lexicon.quizUnlocked}
            quizUnlockEntryCount={lexicon.quizUnlockEntryCount}
          />

          <div className="min-w-0 space-y-4 overflow-hidden rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/58 p-4 sm:p-5">
            <div>
              <p className="break-words text-sm font-black text-[var(--color-ink)] [overflow-wrap:anywhere]">
                Pošalji link još nekome
              </p>
              <p className="mt-1 break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere]">
                {isDemo
                  ? "Ovaj demo link ne sadrži privatne tokene i ne sprema podatke."
                  : "Share je javan i ne sadrži privatni link za pregled ni privatni token."}
              </p>
            </div>
            <SharePreviewCard
              description="Upiši se kad uhvatiš minutu i dodaj malo nostalgije u ekipu."
              title={`Pozivnica: ${lexicon.title}`}
              urlLabel={inviteUrl}
            />
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                className="w-full sm:w-auto"
                onClick={handleCopyLink}
                type="button"
                variant="secondary"
              >
                {copyMessage === "Link je kopiran!"
                  ? "Link je kopiran!"
                  : "Kopiraj link"}
              </Button>
              <ButtonLink
                className={`w-full sm:w-auto ${whatsAppButtonClassName}`}
                href={whatsAppUrl}
                rel="noopener noreferrer"
                target="_blank"
                variant="secondary"
              >
                Podijeli na WhatsApp
              </ButtonLink>
            </div>
            {copyMessage && copyMessage !== "Link je kopiran!" ? (
              <p className="state-message border-[rgba(190,38,78,0.28)] text-[var(--color-danger)]">
                {copyMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 space-y-4 lg:sticky lg:top-6">
          <CoverPreview
            ownerName={lexicon.ownerName}
            sticker={coverTheme.sticker}
            theme={coverTheme.key}
            title={lexicon.title}
          />
          <div className="min-w-0 overflow-hidden rounded-[1.1rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4">
            <p className="break-words text-sm font-black text-[var(--color-ink)] [overflow-wrap:anywhere]">
              Malo povjerenja prije upisa
            </p>
            <p className="mt-2 break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere]">
              {isDemo
                ? "Demo pozivnica ne čita Convex i ne prikazuje stvarne upise."
                : "Odgovore će vidjeti vlasnica leksikona preko privatnog linka. Ova javna stranica ne prikazuje upise."}
            </p>
          </div>
        </div>
      </div>
    </InviteShell>
  );
}
