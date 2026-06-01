"use client";

import { Component, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { hasConvexClientConfig } from "@/components/providers/ConvexClientProvider";
import { RetroCard } from "@/components/RetroCard";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverPreview } from "@/components/ui/CoverPreview";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotebookHeader } from "@/components/ui/NotebookHeader";
import { NotebookPaper } from "@/components/ui/NotebookPaper";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SharePreviewCard } from "@/components/ui/SharePreviewCard";
import { Sticker } from "@/components/ui/Sticker";
import { copyTextToClipboard } from "@/lib/clipboard";
import { formatShortDateTime } from "@/lib/date";
import { coverThemeOptions } from "@/lib/design";
import { lexiconInvitePath, newLexiconPath } from "@/lib/routes";
import { createAbsoluteUrl } from "@/lib/share";

type AdminDashboardProps = {
  lexiconId: string;
  token?: string;
};

type AdminDashboardErrorBoundaryProps = {
  children: ReactNode;
};

type AdminDashboardErrorBoundaryState = {
  hasError: boolean;
};

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

class AdminDashboardErrorBoundary extends Component<
  AdminDashboardErrorBoundaryProps,
  AdminDashboardErrorBoundaryState
> {
  state: AdminDashboardErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AdminDashboardErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <AdminQueryErrorState />;
    }

    return this.props.children;
  }
}

function DashboardShell({ children }: { children: ReactNode }) {
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
    coverThemeOptions.find((item) => item.name === coverStyle) ??
    coverThemeOptions[0];

  return option.sticker;
}

function MissingConvexState() {
  return (
    <DashboardShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi novi leksikon</ButtonLink>}
        description="Pokreni npx.cmd convex dev i dodaj NEXT_PUBLIC_CONVEX_URL u lokalne env varijable kako bi privatni pregled mogao dohvatiti podatke."
        sticker="📼"
        title="Convex nije spojen za lokalni razvoj"
      />
    </DashboardShell>
  );
}

function InvalidPrivateLinkState() {
  return (
    <DashboardShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi novi leksikon</ButtonLink>}
        description="Ovaj pregled se može otvoriti samo putem privatnog linka koji je prikazan nakon kreiranja leksikona."
        sticker="🔒"
        title="Privatni link nije valjan"
      />
    </DashboardShell>
  );
}

function AdminQueryErrorState() {
  return (
    <DashboardShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi novi leksikon</ButtonLink>}
        description="Nešto je pošlo po zlu pri otvaranju privatnog pregleda. Pokušaj osvježiti stranicu."
        sticker="📼"
        title="Privatni pregled se nije otvorio"
      />
    </DashboardShell>
  );
}

function LoadingState() {
  return (
    <DashboardShell>
      <div className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-5 shadow-[var(--shadow-soft)]">
        <ProgressPill label="Otvaram privatni leksikon..." tone="yellow" />
        <h1 className="mt-4 text-3xl font-black text-[var(--color-ink)]">
          Listam privatne stranice.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Provjeravam privatni link i dohvaćam aktivne upise.
        </p>
      </div>
    </DashboardShell>
  );
}

function DeletedState() {
  return (
    <DashboardShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi novi leksikon</ButtonLink>}
        description="Pozivnica i privatni pregled više nisu aktivni. Ako želiš krenuti ispočetka, napravi novi leksikon."
        sticker="✨"
        title="Leksikon je obrisan."
      />
    </DashboardShell>
  );
}

export function AdminDashboard({ lexiconId, token }: AdminDashboardProps) {
  if (!hasConvexClientConfig()) {
    return <MissingConvexState />;
  }

  return (
    <AdminDashboardErrorBoundary key={`${lexiconId}:${token ?? ""}`}>
      <AdminDashboardWithConvex lexiconId={lexiconId} token={token} />
    </AdminDashboardErrorBoundary>
  );
}

function AdminDashboardWithConvex({ lexiconId, token }: AdminDashboardProps) {
  const normalizedToken = token?.trim();
  const shouldQuery = Boolean(normalizedToken && lexiconId.trim());
  const dashboard = useQuery(
    api.entries.listEntriesForAdmin,
    shouldQuery
      ? {
          lexiconId: lexiconId as Id<"lexicons">,
          token: normalizedToken as string,
        }
      : "skip",
  );
  const softDeleteLexicon = useMutation(api.lexicons.softDeleteLexicon);
  const [copyMessage, setCopyMessage] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const fallbackInvitePath = "/l/leksikon";
  const invitePath = dashboard?.lexicon.slug
    ? lexiconInvitePath(dashboard.lexicon.slug)
    : fallbackInvitePath;
  const origin =
    configuredSiteUrl ||
    (typeof window === "undefined" ? "" : window.location.origin);
  const inviteUrl = useMemo(
    () => (origin ? createAbsoluteUrl(invitePath, origin) : invitePath),
    [invitePath, origin],
  );

  if (isDeleted) {
    return <DeletedState />;
  }

  if (!normalizedToken || !lexiconId.trim()) {
    return <InvalidPrivateLinkState />;
  }

  if (dashboard === undefined) {
    return <LoadingState />;
  }

  if (dashboard === null) {
    return <InvalidPrivateLinkState />;
  }

  const { lexicon, entries } = dashboard;
  const adminToken = normalizedToken;
  const coverTheme = getCoverThemeName(lexicon.theme, lexicon.coverStyle);
  const coverSticker = getCoverSticker(lexicon.theme, lexicon.coverStyle);
  const progressLabel = lexicon.quizUnlocked
    ? "Kviz je otključan"
    : `${lexicon.entryCount}/${lexicon.quizUnlockEntryCount} upisa do kviza`;

  async function handleCopyInviteLink() {
    setCopyMessage("");

    try {
      const copied = await copyTextToClipboard(inviteUrl);

      if (!copied) {
        setCopyMessage(
          "Nisam uspio automatski kopirati. Označi link i kopiraj ručno.",
        );
        return;
      }

      setCopyMessage("Javni link je kopiran.");
    } catch {
      setCopyMessage(
        "Nisam uspio automatski kopirati. Označi link i kopiraj ručno.",
      );
    }
  }

  async function handleSoftDelete() {
    setDeleteError("");
    setIsDeleting(true);

    try {
      const result = await softDeleteLexicon({
        lexiconId: lexicon._id,
        token: adminToken,
      });

      if (!result.ok) {
        setDeleteError(
          "Nešto je pošlo po zlu pri brisanju. Pokušaj ponovno.",
        );
        return;
      }

      setIsDeleted(true);
    } catch {
      setDeleteError(
        "Nešto je pošlo po zlu pri brisanju. Pokušaj ponovno.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DashboardShell>
      <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <NotebookHeader
            description="Čuvaj ovaj privatni link — bez njega u MVP-u nema oporavka pregleda."
            eyebrow="Privatni pregled"
            sticker={coverSticker}
            title={lexicon.title}
          />

          <div className="flex flex-wrap gap-2">
            <ProgressPill label="Privatni link za pregled" tone="blue" />
            <ProgressPill
              className={lexicon.quizUnlocked ? "glitter-border" : undefined}
              label={progressLabel}
              tone={lexicon.quizUnlocked ? "success" : "yellow"}
            />
          </div>

          <section className="grid gap-4 sm:grid-cols-3">
            <RetroCard className="p-4" variant="sticker">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Vlasnica
              </p>
              <p className="mt-2 break-words text-2xl font-black text-[var(--color-ink)]">
                {lexicon.ownerName}
              </p>
            </RetroCard>
            <RetroCard className="p-4" variant="sticker">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Upisi
              </p>
              <p className="mt-2 text-4xl font-black text-[var(--color-ink)]">
                {lexicon.entryCount}
              </p>
            </RetroCard>
            <RetroCard className="p-4" variant="sticker">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Kviz
              </p>
              <p className="mt-2 text-lg font-black text-[var(--color-ink)]">
                {lexicon.quizUnlocked ? "Otključan" : "U pripremi"}
              </p>
            </RetroCard>
          </section>

          <section className="space-y-5 rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/64 p-5 shadow-[var(--shadow-soft)]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-gel-blue)]">
                Javni invite link
              </p>
              <h2 className="mt-3 text-2xl font-black text-[var(--color-ink)]">
                Link koji šalješ frendicama
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Javni link šalješ frendicama. Privatni link za pregled čuvaš
                za sebe.
              </p>
            </div>

            <label className="block">
              <span className="form-label">Javna pozivnica</span>
              <input
                className="form-control mt-2 font-mono text-sm"
                onFocus={(event) => event.currentTarget.select()}
                readOnly
                value={inviteUrl}
              />
            </label>

            <SharePreviewCard
              description="Ovaj link vodi na javnu pozivnicu za upis u leksikon."
              title={`Pozivnica: ${lexicon.title}`}
              urlLabel={invitePath}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button onClick={handleCopyInviteLink} type="button" variant="secondary">
                {copyMessage === "Javni link je kopiran."
                  ? "Javni link je kopiran"
                  : "Kopiraj javni link"}
              </Button>
              <ButtonLink href={invitePath} variant="ghost">
                Otvori pozivnicu
              </ButtonLink>
            </div>
            {copyMessage && copyMessage !== "Javni link je kopiran." ? (
              <p className="state-message border-[rgba(190,38,78,0.28)] text-[var(--color-danger)]">
                {copyMessage}
              </p>
            ) : null}
          </section>

          <section className="space-y-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-gel-pink)]">
                Upisi
              </p>
              <h2 className="mt-2 text-3xl font-black text-[var(--color-ink)]">
                Stranice koje su frendice popunile
              </h2>
            </div>

            {entries.length === 0 ? (
              <EmptyState
                action={
                  <Button onClick={handleCopyInviteLink} type="button" variant="secondary">
                    Kopiraj javni link
                  </Button>
                }
                description="Pošalji javni link frendicama i čekaj prvu stranicu leksikona."
                sticker="⭐"
                title="Još nema upisa"
              />
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <EntryCard entry={entry} key={entry._id} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4 rounded-[1.25rem] border border-[rgba(190,38,78,0.24)] bg-[rgba(190,38,78,0.07)] p-5">
            <div>
              <ProgressPill label="Opasna zona" tone="pink" />
              <h2 className="mt-3 text-2xl font-black text-[var(--color-ink)]">
                Obriši leksikon
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Brisanje leksikona sakrit će pozivnicu i upise iz aplikacije.
              </p>
            </div>

            {isConfirmingDelete ? (
              <div className="space-y-4 rounded-[1rem] border border-[rgba(190,38,78,0.22)] bg-white/64 p-4">
                <div>
                  <p className="text-base font-black text-[var(--color-danger)]">
                    Jesi sigurna?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    Ova akcija će deaktivirati leksikon. U MVP-u nema ekran za
                    povrat obrisanog leksikona.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    disabled={isDeleting}
                    onClick={() => setIsConfirmingDelete(false)}
                    type="button"
                    variant="secondary"
                  >
                    Odustani
                  </Button>
                  <Button
                    disabled={isDeleting}
                    onClick={handleSoftDelete}
                    type="button"
                    variant="danger"
                  >
                    {isDeleting ? "Brišem..." : "Da, obriši leksikon"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsConfirmingDelete(true)}
                type="button"
                variant="danger"
              >
                Obriši leksikon
              </Button>
            )}

            {deleteError ? (
              <p className="state-message border-[rgba(190,38,78,0.28)] text-[var(--color-danger)]">
                {deleteError}
              </p>
            ) : null}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <CoverPreview
            ownerName={lexicon.ownerName}
            sticker={coverSticker}
            theme={coverTheme}
            title={lexicon.title}
          />
          <RetroCard className="space-y-3 p-4" variant="notebook" withTape>
            <p className="text-sm font-black text-[var(--color-ink)]">
              Privatnost linka za pregled
            </p>
            <p className="text-sm leading-6 text-[var(--color-muted)]">
              Ova stranica radi samo s tokenom iz privatnog linka za pregled.
              Token se ne sprema u browser storage i ne ulazi u javni share
              link.
            </p>
          </RetroCard>
        </aside>
      </div>
    </DashboardShell>
  );
}

type AdminEntryAnswer = {
  questionId: string;
  question: string;
  answer: string;
  visibility: "ownerOnly" | "quizEligible";
  isPrivate: boolean;
};

type AdminEntry = {
  _id: Id<"entries">;
  displayName: string;
  answers: AdminEntryAnswer[];
  stickerId?: string;
  mood?: string;
  consentQuizUse: boolean;
  createdAt: number;
  updatedAt: number;
};

function EntryCard({ entry }: { entry: AdminEntry }) {
  return (
    <RetroCard className="p-5" variant="paper" withTape>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {entry.stickerId ? (
              <Sticker size="sm" variant="yellow">
                {entry.stickerId}
              </Sticker>
            ) : null}
            <h3 className="break-words text-2xl font-black text-[var(--color-ink)]">
              {entry.displayName}
            </h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            {formatShortDateTime(entry.createdAt)}
            {entry.mood ? ` · ${entry.mood}` : ""}
          </p>
        </div>
        <ProgressPill
          label={entry.consentQuizUse ? "Može u kviz" : "Samo za čitanje"}
          tone={entry.consentQuizUse ? "success" : "neutral"}
        />
      </div>

      <div className="mt-5 space-y-4">
        {entry.answers.map((answer) => {
          const isPrivate =
            answer.isPrivate || answer.visibility === "ownerOnly";

          return (
            <div
              className="rounded-[1rem] border border-[rgba(36,27,47,0.10)] bg-white/58 p-4"
              key={answer.questionId}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-black text-[var(--color-gel-blue)]">
                  {answer.question}
                </p>
                {isPrivate ? (
                  <ProgressPill label="Privatno" tone="pink" />
                ) : null}
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--color-muted)]">
                {answer.answer}
              </p>
            </div>
          );
        })}
      </div>
    </RetroCard>
  );
}
