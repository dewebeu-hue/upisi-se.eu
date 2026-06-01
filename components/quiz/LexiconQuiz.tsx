"use client";

import { Component, useState, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { hasConvexClientConfig } from "@/components/providers/ConvexClientProvider";
import { RetroCard } from "@/components/RetroCard";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverPreview } from "@/components/ui/CoverPreview";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotebookHeader } from "@/components/ui/NotebookHeader";
import { NotebookPaper } from "@/components/ui/NotebookPaper";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { Sticker } from "@/components/ui/Sticker";
import { cn } from "@/lib/class-names";
import { getCoverThemeByValues } from "@/lib/design";
import {
  lexiconEntryPath,
  lexiconInvitePath,
  newLexiconPath,
} from "@/lib/routes";
import type { QuizRound } from "@/lib/quiz";

type LexiconQuizProps = {
  slug: string;
};

type QuizLexicon = {
  slug: string;
  ownerName: string;
  title: string;
  theme: string;
  coverStyle: string;
  entryCount: number;
  quizUnlockEntryCount: number;
  quizUnlocked: boolean;
};

type QuizNotFoundResult = {
  status: "not_found";
};

type QuizStateResult = {
  lexicon: QuizLexicon;
  eligibleEntryCount: number;
  requiredEligibleEntryCount: number;
  rounds: QuizRound[];
};

type QuizLockedResult = QuizStateResult & {
  status: "locked";
};

type QuizNotEnoughAnswersResult = QuizStateResult & {
  status: "not_enough_answers";
};

type QuizReadyResult = QuizStateResult & {
  status: "ready";
};

type QuizQueryResult =
  | QuizNotFoundResult
  | QuizLockedResult
  | QuizNotEnoughAnswersResult
  | QuizReadyResult;

type QuizErrorBoundaryState = {
  hasError: boolean;
};

function QuizShell({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-8 sm:px-8 sm:py-16">
      <NotebookPaper className="w-full max-w-full min-w-0" variant="grid">
        {children}
      </NotebookPaper>
    </section>
  );
}

class QuizErrorBoundary extends Component<
  { children: ReactNode },
  QuizErrorBoundaryState
> {
  state: QuizErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): QuizErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <QuizErrorState />;
    }

    return this.props.children;
  }
}

function QuizErrorState() {
  return (
    <QuizShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Pokušaj osvježiti stranicu ili napravi svoj leksikon. Privatni podaci nisu prikazani."
        sticker="📼"
        title="Nismo uspjeli otvoriti kviz"
      />
    </QuizShell>
  );
}

function MissingConvexQuizState() {
  return (
    <QuizShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Pokreni Convex lokalno i dodaj NEXT_PUBLIC_CONVEX_URL kako bi kviz mogao dohvatiti javne podatke."
        sticker="💿"
        title="Convex nije spojen za kviz"
      />
    </QuizShell>
  );
}

function QuizLoadingState() {
  return (
    <QuizShell>
      <RetroCard className="p-5" variant="notebook" withTape>
        <ProgressPill label="Slažem kviz..." tone="yellow" />
        <h1 className="mt-4 break-words text-3xl font-black text-[var(--color-ink)] [overflow-wrap:anywhere]">
          Miješam odgovore i imena.
        </h1>
        <p className="mt-3 break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere]">
          U kviz ulaze samo odgovori koji su označeni kao dopušteni za budući
          kviz.
        </p>
      </RetroCard>
    </QuizShell>
  );
}

function MissingQuizState() {
  return (
    <QuizShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Link je možda pogrešan, leksikon je obrisan ili kviz više nije aktivan."
        sticker="⭐"
        title="Kviz nije dostupan"
      />
    </QuizShell>
  );
}

function LockedQuizState({
  result,
}: {
  result: Extract<QuizQueryResult, { status: "locked" | "not_enough_answers" }>;
}) {
  const { lexicon } = result;
  const coverTheme = getCoverThemeByValues(lexicon.coverStyle, lexicon.theme);
  const isLockedByEntryCount = result.status === "locked";
  const title = isLockedByEntryCount
    ? "Kviz se otključava uskoro"
    : "Treba još quiz-safe odgovora";
  const description = isLockedByEntryCount
    ? `Kviz se otključava kad se skupi ${lexicon.quizUnlockEntryCount} upisa. Trenutno ih je ${lexicon.entryCount}.`
    : `Ima dovoljno upisa za leksikon, ali za kviz trebaju barem ${result.requiredEligibleEntryCount} osobe s odgovorima koji smiju ući u igru.`;

  return (
    <QuizShell>
      <div className="grid min-w-0 gap-7 overflow-hidden lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="min-w-0 space-y-6">
          <NotebookHeader
            description={description}
            eyebrow="Pogodi čiji je odgovor"
            sticker={coverTheme.sticker}
            title={title}
          />

          <div className="flex min-w-0 flex-wrap gap-2">
            <ProgressPill
              label={`${lexicon.entryCount}/${lexicon.quizUnlockEntryCount} upisa do kviza`}
              tone="yellow"
            />
            <ProgressPill
              label={`${result.eligibleEntryCount}/${result.requiredEligibleEntryCount} quiz-safe osoba`}
              tone={result.eligibleEntryCount >= result.requiredEligibleEntryCount ? "success" : "blue"}
            />
            <ProgressPill label="Bez javnog feeda" tone="blue" />
          </div>

          <RetroCard className="space-y-4 p-5" variant="sticker">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-gel-pink)]">
              Što dalje?
            </p>
            <h2 className="break-words text-2xl font-black text-[var(--color-ink)] [overflow-wrap:anywhere]">
              Pošalji pozivnicu dalje i skupi još malo materijala.
            </h2>
            <p className="break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere]">
              Privatni i “samo za vlasnicu” odgovori ne ulaze u kviz. To je
              namjerno, da igra ostane zabavna bez probijanja povjerenja.
            </p>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={lexiconInvitePath(lexicon.slug)} variant="secondary">
                Otvori pozivnicu
              </ButtonLink>
              <ButtonLink href={lexiconEntryPath(lexicon.slug)} variant="ghost">
                Upiši se
              </ButtonLink>
            </div>
          </RetroCard>
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-6">
          <CoverPreview
            ownerName={lexicon.ownerName}
            sticker={coverTheme.sticker}
            theme={coverTheme.key}
            title={lexicon.title}
          />
          <RetroCard className="p-4" variant="notebook" withTape>
            <p className="text-sm font-black text-[var(--color-ink)]">
              Kviz čuva granicu privatnosti
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              U ovoj fazi rezultat se ne sprema, ne postoji leaderboard i nema
              dodatnog trackinga.
            </p>
          </RetroCard>
        </aside>
      </div>
    </QuizShell>
  );
}

function ReadyQuizState({
  result,
}: {
  result: Extract<QuizQueryResult, { status: "ready" }>;
}) {
  const { lexicon, rounds } = result;
  const coverTheme = getCoverThemeByValues(lexicon.coverStyle, lexicon.theme);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const currentRound = rounds[roundIndex];
  const selectedChoice = currentRound?.choices.find(
    (choice) => choice.id === selectedChoiceId,
  );
  const isLastRound = roundIndex >= rounds.length - 1;
  const progressLabel = `${Math.min(roundIndex + 1, rounds.length)}/${rounds.length} pitanja`;

  function handleSelectChoice(choiceId: string) {
    if (selectedChoiceId || !currentRound) {
      return;
    }

    setSelectedChoiceId(choiceId);

    if (choiceId === currentRound.correctChoiceId) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNextRound() {
    if (isLastRound) {
      setIsComplete(true);
      return;
    }

    setRoundIndex((currentIndex) => currentIndex + 1);
    setSelectedChoiceId(null);
  }

  function handleRestart() {
    setRoundIndex(0);
    setSelectedChoiceId(null);
    setScore(0);
    setIsComplete(false);
  }

  if (!currentRound) {
    return <QuizErrorState />;
  }

  if (isComplete) {
    return (
      <QuizShell>
        <div className="grid min-w-0 gap-7 overflow-hidden lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div className="min-w-0 space-y-6">
            <NotebookHeader
              description="Rezultat se ne sprema. Ovo je mali read-only party game sloj za ekipu iz leksikona."
              eyebrow="Kviz završen"
              sticker="✨"
              title={`Imaš ${score}/${rounds.length} pogođenih`}
            />

            <RetroCard className="space-y-5 p-5" variant="sticker" withTape>
              <ProgressPill label="Rezultat nije spremljen" tone="blue" />
              <h2 className="break-words text-2xl font-black text-[var(--color-ink)] [overflow-wrap:anywhere]">
                Sad znaš koliko dobro pamtiš rukopis ekipe.
              </h2>
              <p className="break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere]">
                Ako želiš isti krug nostalgije sa svojom ekipom, napravi novi
                leksikon i pošalji link dalje.
              </p>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={newLexiconPath()} size="lg">
                  Napravi svoj leksikon
                </ButtonLink>
                <Button onClick={handleRestart} type="button" variant="secondary">
                  Igraj ponovno
                </Button>
                <ButtonLink href={lexiconInvitePath(lexicon.slug)} variant="ghost">
                  Natrag na pozivnicu
                </ButtonLink>
              </div>
            </RetroCard>
          </div>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-6">
            <CoverPreview
              ownerName={lexicon.ownerName}
              sticker={coverTheme.sticker}
              theme={coverTheme.key}
              title={lexicon.title}
            />
          </aside>
        </div>
      </QuizShell>
    );
  }

  return (
    <QuizShell>
      <div className="grid min-w-0 gap-7 overflow-hidden lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="min-w-0 space-y-6">
          <NotebookHeader
            description={`Odgovor je iz leksikona "${lexicon.title}". Pogodi tko ga je napisao.`}
            eyebrow="Pogodi čiji je odgovor"
            sticker={coverTheme.sticker}
            title="Tko je ovo napisao?"
          />

          <div className="flex min-w-0 flex-wrap gap-2">
            <ProgressPill className="glitter-border" label="Kviz otključan" tone="success" />
            <ProgressPill label={progressLabel} tone="yellow" />
            <ProgressPill
              label={`${result.eligibleEntryCount} quiz-safe osoba`}
              tone="blue"
            />
          </div>

          <RetroCard className="space-y-5 p-5 sm:p-6" variant="notebook" withTape>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Sticker variant="purple">?</Sticker>
              <p className="break-words text-sm font-black uppercase tracking-[0.14em] text-[var(--color-gel-blue)] [overflow-wrap:anywhere]">
                {currentRound.question}
              </p>
            </div>

            <blockquote className="rounded-[1.1rem] border border-[rgba(36,27,47,0.12)] bg-white/68 p-5 shadow-[var(--shadow-soft)]">
              <p className="break-words text-2xl font-black leading-tight text-[var(--color-ink)] [overflow-wrap:anywhere]">
                “{currentRound.answer}”
              </p>
            </blockquote>

            <div className="space-y-3" aria-label="Ponuđeni odgovori">
              {currentRound.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                const isCorrect = currentRound.correctChoiceId === choice.id;
                const shouldReveal = selectedChoiceId !== null;

                return (
                  <button
                    className={cn(
                      "min-h-12 w-full rounded-[1rem] border-2 px-4 py-3 text-left text-sm font-black leading-snug shadow-[var(--shadow-soft)] transition duration-150 ease-out [overflow-wrap:anywhere] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)] active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-default disabled:translate-x-0 disabled:translate-y-0",
                      shouldReveal && isCorrect
                        ? "border-[var(--color-success)] bg-[rgba(9,139,104,0.12)] text-[var(--color-success)]"
                        : "border-[rgba(36,27,47,0.16)] bg-white/72 text-[var(--color-ink)] hover:border-[var(--color-gel-blue)] hover:bg-white/92",
                      shouldReveal && isSelected && !isCorrect
                        ? "border-[var(--color-danger)] bg-[rgba(190,38,78,0.08)] text-[var(--color-danger)]"
                        : "",
                    )}
                    disabled={selectedChoiceId !== null}
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice.id)}
                    type="button"
                  >
                    <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <span className="break-words [overflow-wrap:anywhere]">
                        {choice.displayName}
                      </span>
                      {shouldReveal && isCorrect ? (
                        <span className="text-xs uppercase tracking-[0.12em]">
                          Točno
                        </span>
                      ) : null}
                      {shouldReveal && isSelected && !isCorrect ? (
                        <span className="text-xs uppercase tracking-[0.12em]">
                          Nije to
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedChoiceId ? (
              <div className="rounded-[1rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-4">
                <p className="text-sm font-black text-[var(--color-ink)]">
                  {selectedChoiceId === currentRound.correctChoiceId
                    ? "Pogođeno!"
                    : "Skoro."}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                  Odgovor je napisala{" "}
                  <strong className="text-[var(--color-ink)]">
                    {
                      currentRound.choices.find(
                        (choice) => choice.id === currentRound.correctChoiceId,
                      )?.displayName
                    }
                  </strong>
                  {selectedChoice ? `, a ti si odabrala ${selectedChoice.displayName}.` : "."}
                </p>
              </div>
            ) : null}

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <ProgressPill label={`Score ${score}/${rounds.length}`} tone="blue" />
              <Button
                disabled={!selectedChoiceId}
                onClick={handleNextRound}
                type="button"
              >
                {isLastRound ? "Vidi rezultat" : "Sljedeće pitanje"}
              </Button>
            </div>
          </RetroCard>
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-6">
          <CoverPreview
            ownerName={lexicon.ownerName}
            sticker={coverTheme.sticker}
            theme={coverTheme.key}
            title={lexicon.title}
          />
          <RetroCard className="p-4" variant="sticker">
            <p className="text-sm font-black text-[var(--color-ink)]">
              Samo javno dopušteni odgovori
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Privatna pitanja, owner-only odgovori i upisi bez consent-a za
              kviz ostaju izvan igre.
            </p>
          </RetroCard>
        </aside>
      </div>
    </QuizShell>
  );
}

export function LexiconQuiz({ slug }: LexiconQuizProps) {
  if (!hasConvexClientConfig()) {
    return <MissingConvexQuizState />;
  }

  return (
    <QuizErrorBoundary key={slug}>
      <LexiconQuizWithConvex slug={slug} />
    </QuizErrorBoundary>
  );
}

function LexiconQuizWithConvex({ slug }: LexiconQuizProps) {
  const result = useQuery(api.quiz.getQuizBySlug, { slug }) as
    | QuizQueryResult
    | undefined;

  if (result === undefined) {
    return <QuizLoadingState />;
  }

  if (result.status === "not_found") {
    return <MissingQuizState />;
  }

  if (result.status === "locked" || result.status === "not_enough_answers") {
    return <LockedQuizState result={result} />;
  }

  return <ReadyQuizState result={result} />;
}
