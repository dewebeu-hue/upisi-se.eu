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
import { SparkleBurst } from "@/components/ui/SparkleBurst";
import { copyTextToClipboard } from "@/lib/clipboard";
import { getCoverThemeByValues } from "@/lib/design";
import { lexiconInvitePath, newLexiconPath } from "@/lib/routes";
import {
  createAbsoluteUrl,
  createAfterEntryShareText,
  createWhatsAppShareUrl,
} from "@/lib/share";

type EntryThankYouProps = {
  slug: string;
};

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function ThankYouShell({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <NotebookPaper className="w-full" variant="grid">
        {children}
      </NotebookPaper>
    </section>
  );
}

function MissingConvexThankYouState() {
  return (
    <ThankYouShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Pokreni npx.cmd convex dev i dodaj NEXT_PUBLIC_CONVEX_URL u lokalne env varijable kako bi thank-you stranica mogla dohvatiti javne podatke leksikona."
        sticker="📼"
        title="Convex nije spojen za lokalni razvoj"
      />
    </ThankYouShell>
  );
}

export function EntryThankYou({ slug }: EntryThankYouProps) {
  if (!hasConvexClientConfig()) {
    return <MissingConvexThankYouState />;
  }

  return <EntryThankYouInner slug={slug} />;
}

function EntryThankYouInner({ slug }: EntryThankYouProps) {
  const lexicon = useQuery(api.lexicons.getPublicLexiconBySlug, { slug });
  const [copyMessage, setCopyMessage] = useState("");

  const fallbackInvitePath = lexiconInvitePath(slug);
  const origin =
    configuredSiteUrl ||
    (typeof window === "undefined" ? "" : window.location.origin);
  const publicInvitePath = lexicon?.slug
    ? lexiconInvitePath(lexicon.slug)
    : fallbackInvitePath;
  const publicInviteUrl = useMemo(
    () =>
      origin ? createAbsoluteUrl(publicInvitePath, origin) : publicInvitePath,
    [origin, publicInvitePath],
  );

  if (lexicon === undefined) {
    return (
      <ThankYouShell>
        <div className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-5 shadow-[var(--shadow-soft)]">
          <ProgressPill label="Spremam zadnju naljepnicu..." tone="yellow" />
          <h1 className="mt-4 text-3xl font-black text-[var(--color-ink)]">
            Još sekunda i leksikon je tu.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Dohvaćam javne podatke pozivnice bez privatnih tokena.
          </p>
        </div>
      </ThankYouShell>
    );
  }

  if (lexicon === null) {
    return (
      <ThankYouShell>
        <EmptyState
          action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
          description="Link je možda pogrešan, obrisan ili više nije aktivan."
          sticker="⭐"
          title="Leksikon nije pronađen"
        />
      </ThankYouShell>
    );
  }

  const coverTheme = getCoverThemeByValues(lexicon.coverStyle, lexicon.theme);
  const progressLabel = lexicon.quizUnlocked
    ? "Kviz je otključan"
    : `${lexicon.entryCount}/${lexicon.quizUnlockEntryCount} upisa do kviza`;
  const remainingEntries = Math.max(
    lexicon.quizUnlockEntryCount - lexicon.entryCount,
    0,
  );
  const shareText = createAfterEntryShareText(
    lexicon.ownerName,
    publicInviteUrl,
  );
  const whatsAppUrl = createWhatsAppShareUrl(shareText, publicInviteUrl);

  async function handleCopyInviteLink() {
    setCopyMessage("");

    try {
      const copied = await copyTextToClipboard(publicInviteUrl);

      if (!copied) {
        setCopyMessage(
          "Nisam uspjela automatski kopirati. Označi javni link i kopiraj ručno.",
        );
        return;
      }

      setCopyMessage("Javni link je kopiran!");
    } catch {
      setCopyMessage(
        "Nisam uspjela automatski kopirati. Označi javni link i kopiraj ručno.",
      );
    }
  }

  return (
    <ThankYouShell>
      <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <NotebookHeader
            description={`Tvoj upis u "${lexicon.title}" je spremljen. Ako želiš nastaviti krug nostalgije, napravi svoj leksikon ili pošalji javnu pozivnicu još nekome.`}
            eyebrow="Hvala na upisu"
            sticker={coverTheme.sticker}
            title="Upisano ✨"
          />

          <div className="flex flex-wrap gap-2">
            <ProgressPill label="Bez registracije" tone="blue" />
            <ProgressPill
              label={`Tema: ${coverTheme.label}`}
              tone={coverTheme.tone}
            />
            <ProgressPill
              className={lexicon.quizUnlocked ? "glitter-border" : undefined}
              label={progressLabel}
              tone={lexicon.quizUnlocked ? "success" : "yellow"}
            />
          </div>

          <section
            className={`relative space-y-5 overflow-hidden rounded-[1.25rem] border p-5 shadow-[var(--shadow-soft)] ${coverTheme.accentClassName}`}
          >
            <SparkleBurst />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-success)]">
                Sljedeći korak
              </p>
              <h1 className="mt-3 text-3xl font-black text-[var(--color-ink)]">
                Sad je tvoj red za leksikon.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                Napravi svoj digitalni leksikon, pošalji link u WhatsApp ili
                Viber grupu i čekaj odgovore zbog kojih se opet smijete istim
                forama.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={newLexiconPath()} size="lg">
                Napravi svoj leksikon
              </ButtonLink>
              <Button onClick={handleCopyInviteLink} type="button" variant="secondary">
                {copyMessage === "Javni link je kopiran!"
                  ? "Javni link je kopiran!"
                  : "Pošalji link još nekome"}
              </Button>
              <ButtonLink href={publicInvitePath} variant="ghost">
                Otvori pozivnicu
              </ButtonLink>
            </div>
            {copyMessage && copyMessage !== "Javni link je kopiran!" ? (
              <p className="state-message border-[rgba(190,38,78,0.28)] text-[var(--color-danger)]">
                {copyMessage}
              </p>
            ) : null}
          </section>

          <section className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/64 p-5 shadow-[var(--shadow-soft)]">
              <ProgressPill
                className={lexicon.quizUnlocked ? "glitter-border" : undefined}
                label={lexicon.quizUnlocked ? "Kviz je otključan" : "Još malo do kviza"}
                tone={lexicon.quizUnlocked ? "success" : "yellow"}
              />
              <h2 className="mt-4 text-2xl font-black text-[var(--color-ink)]">
                {lexicon.quizUnlocked ? "Kviz je otključan 🎉" : "Još malo do kviza"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                {lexicon.quizUnlocked
                  ? "Ekipa je skupila dovoljno upisa za budući kviz. Logika kviza dolazi u sljedećim koracima MVP-a."
                  : `Kad se skupi ${lexicon.quizUnlockEntryCount} upisa, ovdje će se moći otvoriti kviz "Pogodi čiji je odgovor?". Još ${remainingEntries} do tog trenutka.`}
              </p>
              <ProgressPill
                className={lexicon.quizUnlocked ? "mt-4 glitter-border" : "mt-4"}
                label={progressLabel}
                tone={lexicon.quizUnlocked ? "success" : "yellow"}
              />
            </div>

            <SharePreviewCard
              description={`Ja sam se upravo upisala u ${lexicon.ownerName} leksikon. Upiši se i ti kao nekad u osnovnoj.`}
              title={`Pozivnica: ${lexicon.title}`}
              urlLabel={publicInviteUrl}
            />
          </section>

          <section className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/58 p-5">
            <p className="text-sm font-black text-[var(--color-ink)]">
              Privatni link ostaje privatan
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Link za uređivanje ili brisanje upisa prikazan je odmah nakon
              slanja upisa. Ova stranica ga namjerno ne prikazuje zbog
              privatnosti.
            </p>
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6">
          <CoverPreview
            ownerName={lexicon.ownerName}
            sticker={coverTheme.sticker}
            theme={coverTheme.key}
            title={lexicon.title}
          />
          <div className="space-y-4 rounded-[1.1rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4">
            <div>
              <p className="text-sm font-black text-[var(--color-ink)]">
                Podijeli samo javni link
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Ovaj share vodi na pozivnicu i ne sadrži admin token ni
                privatni link za uređivanje ili brisanje.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonLink
                href={whatsAppUrl}
                rel="noopener noreferrer"
                target="_blank"
                variant="secondary"
              >
                Podijeli na WhatsApp
              </ButtonLink>
              <ButtonLink href={newLexiconPath()} variant="ghost">
                Napravi svoj leksikon
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </ThankYouShell>
  );
}
