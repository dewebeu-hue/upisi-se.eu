"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { hasConvexClientConfig } from "@/components/providers/ConvexClientProvider";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverPreview } from "@/components/ui/CoverPreview";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotebookHeader } from "@/components/ui/NotebookHeader";
import { NotebookPaper } from "@/components/ui/NotebookPaper";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SharePreviewCard } from "@/components/ui/SharePreviewCard";
import { copyTextToClipboard } from "@/lib/clipboard";
import { coverThemeOptions } from "@/lib/design";
import { lexiconEntryPath, lexiconInvitePath, newLexiconPath } from "@/lib/routes";
import {
  createAbsoluteUrl,
  createInviteShareText,
  createWhatsAppShareUrl,
} from "@/lib/share";

type PublicLexiconInviteProps = {
  slug: string;
};

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function InviteShell({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <NotebookPaper className="w-full" variant="grid">
        {children}
      </NotebookPaper>
    </section>
  );
}

function getCoverThemeName(theme: string, coverStyle: string): string {
  const option =
    coverThemeOptions.find((item) => item.key === coverStyle) ??
    coverThemeOptions.find((item) => item.key === theme) ??
    coverThemeOptions.find((item) => item.name === coverStyle) ??
    coverThemeOptions[0];

  return option.name;
}

function getCoverSticker(theme: string, coverStyle: string): string {
  const option =
    coverThemeOptions.find((item) => item.key === coverStyle) ??
    coverThemeOptions.find((item) => item.key === theme) ??
    coverThemeOptions[0];

  return option.sticker;
}

function MissingConvexInviteState() {
  return (
    <InviteShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Pokreni npx.cmd convex dev i dodaj NEXT_PUBLIC_CONVEX_URL u lokalne env varijable kako bi javna pozivnica mogla dohvatiti podatke."
        sticker="📼"
        title="Convex nije spojen za lokalni razvoj"
      />
    </InviteShell>
  );
}

export function PublicLexiconInvite({ slug }: PublicLexiconInviteProps) {
  if (!hasConvexClientConfig()) {
    return <MissingConvexInviteState />;
  }

  return <PublicLexiconInviteInner slug={slug} />;
}

function PublicLexiconInviteInner({ slug }: PublicLexiconInviteProps) {
  const lexicon = useQuery(api.lexicons.getPublicLexiconBySlug, { slug });
  const [copyMessage, setCopyMessage] = useState("");

  const invitePath = lexiconInvitePath(slug);
  const origin =
    configuredSiteUrl ||
    (typeof window === "undefined" ? "" : window.location.origin);
  const inviteUrl = useMemo(
    () => (origin ? createAbsoluteUrl(invitePath, origin) : invitePath),
    [invitePath, origin],
  );

  if (lexicon === undefined) {
    return (
      <InviteShell>
        <div className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-5 shadow-[var(--shadow-soft)]">
          <ProgressPill label="Otvaram leksikon..." tone="yellow" />
          <h1 className="mt-4 text-3xl font-black text-[var(--color-ink)]">
            Listam stranice bilježnice.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Pozivnica se sprema za čitanje, naljepnice i prvi klik na upis.
          </p>
        </div>
      </InviteShell>
    );
  }

  if (lexicon === null) {
    return (
      <InviteShell>
        <EmptyState
          action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
          description="Link je možda pogrešan, obrisan ili više nije aktivan."
          sticker="⭐"
          title="Leksikon nije pronađen"
        />
      </InviteShell>
    );
  }

  const entryPath = lexiconEntryPath(lexicon.slug);
  const entryCountLabel = lexicon.quizUnlocked
    ? "Kviz je otključan"
    : `${lexicon.entryCount}/${lexicon.quizUnlockEntryCount} upisa do kviza`;
  const coverTheme = getCoverThemeName(lexicon.theme, lexicon.coverStyle);
  const coverSticker = getCoverSticker(lexicon.theme, lexicon.coverStyle);
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
      <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <NotebookHeader
            description="Odgovori na par nostalgičnih pitanja i ostavi joj stranicu u digitalnom leksikonu."
            eyebrow="Pozivnica za leksikon"
            sticker={coverSticker}
            title={`${lexicon.ownerName} te zove da se upišeš ✨`}
          />

          <div className="flex flex-wrap gap-2">
            <ProgressPill
              label={entryCountLabel}
              tone={lexicon.quizUnlocked ? "success" : "yellow"}
            />
            <ProgressPill label="Nema registracije" tone="blue" />
          </div>

          <div className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/64 p-5 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-gel-pink)]">
              Tvoj sljedeći korak
            </p>
            <h2 className="mt-3 text-2xl font-black text-[var(--color-ink)]">
              Upiši se u “{lexicon.title}”
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Vlasnica će tvoje odgovore vidjeti preko privatnog linka. Nema
              registracije i nema javnog popisa odgovora.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink href={entryPath} size="lg">
                Upiši se
              </ButtonLink>
              <ButtonLink href={newLexiconPath()} variant="ghost">
                Napravi svoj leksikon
              </ButtonLink>
            </div>
          </div>

          <div className="space-y-4 rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/58 p-5">
            <div>
              <p className="text-sm font-black text-[var(--color-ink)]">
                Pošalji link još nekome
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                Share je javan i ne sadrži privatni link za pregled ni privatni
                token.
              </p>
            </div>
            <SharePreviewCard
              description="Upiši se kad uhvatiš minutu i dodaj malo nostalgije u ekipu."
              title={`Pozivnica: ${lexicon.title}`}
              urlLabel={inviteUrl}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button onClick={handleCopyLink} type="button" variant="secondary">
                {copyMessage === "Link je kopiran!"
                  ? "Link je kopiran!"
                  : "Kopiraj link"}
              </Button>
              <ButtonLink
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

        <div className="space-y-4 lg:sticky lg:top-6">
          <CoverPreview
            ownerName={lexicon.ownerName}
            sticker={coverSticker}
            theme={coverTheme}
            title={lexicon.title}
          />
          <div className="rounded-[1.1rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4">
            <p className="text-sm font-black text-[var(--color-ink)]">
              Malo povjerenja prije upisa
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Odgovore će vidjeti vlasnica leksikona preko privatnog linka.
              Ova javna stranica ne prikazuje upise.
            </p>
          </div>
        </div>
      </div>
    </InviteShell>
  );
}
