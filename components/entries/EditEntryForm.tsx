"use client";

import { Component, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { hasConvexClientConfig } from "@/components/providers/ConvexClientProvider";
import { RetroCard } from "@/components/RetroCard";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotebookHeader } from "@/components/ui/NotebookHeader";
import { NotebookPaper } from "@/components/ui/NotebookPaper";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SparkleBurst } from "@/components/ui/SparkleBurst";
import { cn } from "@/lib/class-names";
import { stickerOptions } from "@/lib/design";
import {
  DISPLAY_NAME_MAX_LENGTH,
  LONG_ANSWER_MAX_LENGTH,
  SHORT_ANSWER_MAX_LENGTH,
} from "@/lib/limits";
import { DEFAULT_ENTRY_QUESTIONS } from "@/lib/question-pack";
import { lexiconInvitePath, newLexiconPath } from "@/lib/routes";

type EditEntryFormProps = {
  entryId: string;
  token?: string;
};

type EditEntryErrorBoundaryProps = {
  children: ReactNode;
};

type EditEntryErrorBoundaryState = {
  hasError: boolean;
};

type EditableAnswer = {
  questionId: string;
  question: string;
  answer: string;
  visibility: "ownerOnly" | "quizEligible";
  isPrivate: boolean;
};

type EditableEntry = {
  _id: Id<"entries">;
  lexiconId: Id<"lexicons">;
  lexiconSlug: string;
  lexiconTitle: string;
  displayName: string;
  answers: EditableAnswer[];
  stickerId?: string;
  mood?: string;
  consentOwnerView: boolean;
  consentQuizUse: boolean;
  createdAt: number;
  updatedAt: number;
};

type AnswerState = Record<string, string>;
type FieldErrors = {
  displayName?: string;
  consentOwnerView?: string;
  form?: string;
} & Record<string, string | undefined>;

const moodOptions = ["Nostalgija", "Drama", "Smijeh", "Tajna ekipa"] as const;

class EditEntryErrorBoundary extends Component<
  EditEntryErrorBoundaryProps,
  EditEntryErrorBoundaryState
> {
  state: EditEntryErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): EditEntryErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <QueryErrorState />;
    }

    return this.props.children;
  }
}

function EntryShell({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      <NotebookPaper className="w-full" variant="lined">
        {children}
      </NotebookPaper>
    </section>
  );
}

function MissingConvexState() {
  return (
    <EntryShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Pokreni npx.cmd convex dev i dodaj NEXT_PUBLIC_CONVEX_URL u lokalne env varijable kako bi privatni edit link mogao dohvatiti upis."
        sticker="📼"
        title="Convex nije spojen za lokalni razvoj"
      />
    </EntryShell>
  );
}

function InvalidPrivateLinkState() {
  return (
    <EntryShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Ovaj upis se može urediti ili obrisati samo putem privatnog linka koji je prikazan odmah nakon slanja upisa."
        sticker="🔒"
        title="Privatni link nije valjan"
      />
    </EntryShell>
  );
}

function QueryErrorState() {
  return (
    <EntryShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Nešto je pošlo po zlu pri otvaranju upisa. Pokušaj osvježiti stranicu."
        sticker="📼"
        title="Upis se nije otvorio"
      />
    </EntryShell>
  );
}

function LoadingState() {
  return (
    <EntryShell>
      <div className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-5 shadow-[var(--shadow-soft)]">
        <ProgressPill label="Otvaram tvoj upis..." tone="yellow" />
        <h1 className="mt-4 text-3xl font-black text-[var(--color-ink)]">
          Listam tvoju stranicu.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Provjeravam privatni link i dohvaćam odgovore.
        </p>
      </div>
    </EntryShell>
  );
}

export function EditEntryForm({ entryId, token }: EditEntryFormProps) {
  if (!hasConvexClientConfig()) {
    return <MissingConvexState />;
  }

  return (
    <EditEntryErrorBoundary key={`${entryId}:${token ?? ""}`}>
      <EditEntryFormWithConvex entryId={entryId} token={token} />
    </EditEntryErrorBoundary>
  );
}

function EditEntryFormWithConvex({ entryId, token }: EditEntryFormProps) {
  const normalizedToken = token?.trim();
  const shouldQuery = Boolean(normalizedToken && entryId.trim());
  const entryData = useQuery(
    api.entries.getEntryForEdit,
    shouldQuery
      ? {
          entryId: entryId as Id<"entries">,
          token: normalizedToken as string,
        }
      : "skip",
  );

  if (!normalizedToken || !entryId.trim()) {
    return <InvalidPrivateLinkState />;
  }

  if (entryData === undefined) {
    return <LoadingState />;
  }

  if (entryData === null) {
    return <InvalidPrivateLinkState />;
  }

  return (
    <LoadedEditEntryForm
      entry={entryData}
      entryId={entryId}
      token={normalizedToken}
    />
  );
}

function createInitialAnswers(entry: EditableEntry): AnswerState {
  return Object.fromEntries(
    entry.answers.map((answer) => [answer.questionId, answer.answer]),
  );
}

function getQuestionMeta(answer: EditableAnswer) {
  return DEFAULT_ENTRY_QUESTIONS.find(
    (question) => question.id === answer.questionId,
  );
}

function getAnswerMaxLength(answer: EditableAnswer): number {
  const question = getQuestionMeta(answer);

  if (question) {
    return question.maxLength;
  }

  return answer.answer.length > SHORT_ANSWER_MAX_LENGTH
    ? LONG_ANSWER_MAX_LENGTH
    : SHORT_ANSWER_MAX_LENGTH;
}

function isOptionalAnswer(answer: EditableAnswer): boolean {
  const question = getQuestionMeta(answer);

  return question ? !question.required : false;
}

function buildMoodOptions(currentMood: string | undefined): string[] {
  return Array.from(
    new Set([...(currentMood ? [currentMood] : []), ...moodOptions]),
  );
}

function LoadedEditEntryForm({
  entry,
  entryId,
  token,
}: {
  entry: EditableEntry;
  entryId: string;
  token: string;
}) {
  const updateEntry = useMutation(api.entries.updateEntry);
  const softDeleteEntry = useMutation(api.entries.softDeleteEntry);
  const invitePath = lexiconInvitePath(entry.lexiconSlug);
  const [displayName, setDisplayName] = useState(entry.displayName);
  const [answers, setAnswers] = useState<AnswerState>(() =>
    createInitialAnswers(entry),
  );
  const [selectedSticker, setSelectedSticker] = useState(entry.stickerId ?? "");
  const [selectedMood, setSelectedMood] = useState(entry.mood ?? "");
  const [consentOwnerView, setConsentOwnerView] = useState(
    entry.consentOwnerView,
  );
  const [consentQuizUse, setConsentQuizUse] = useState(entry.consentQuizUse);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const dynamicMoodOptions = useMemo(
    () => buildMoodOptions(entry.mood),
    [entry.mood],
  );

  if (isDeleted) {
    return (
      <EntryShell>
        <EmptyState
          action={<ButtonLink href={invitePath}>Otvori pozivnicu</ButtonLink>}
          description="Tvoj upis više nije aktivan u ovom leksikonu."
          sticker="✨"
          title="Upis je obrisan"
        />
        <div className="mt-5 text-center">
          <ButtonLink href={newLexiconPath()} variant="ghost">
            Napravi svoj leksikon
          </ButtonLink>
        </div>
      </EntryShell>
    );
  }

  function validateForm() {
    const nextErrors: FieldErrors = {};
    const normalizedDisplayName = displayName.trim().replace(/\s+/g, " ");

    if (!normalizedDisplayName) {
      nextErrors.displayName = "Ime ili nadimak je obavezno.";
    } else if (normalizedDisplayName.length > DISPLAY_NAME_MAX_LENGTH) {
      nextErrors.displayName = `Ime može imati najviše ${DISPLAY_NAME_MAX_LENGTH} znakova.`;
    }

    if (!consentOwnerView) {
      nextErrors.consentOwnerView =
        "Za spremanje upisa moraš potvrditi da vlasnica smije vidjeti upis.";
    }

    const mappedAnswers = entry.answers.flatMap((answer) => {
      const value = (answers[answer.questionId] ?? "").trim();
      const maxLength = getAnswerMaxLength(answer);
      const optional = isOptionalAnswer(answer);

      if (!value && optional) {
        return [];
      }

      if (!value) {
        nextErrors[answer.questionId] = "Ovaj odgovor je obavezan.";
        return [];
      }

      if (value.length > maxLength) {
        nextErrors[answer.questionId] =
          `Odgovor može imati najviše ${maxLength} znakova.`;
        return [];
      }

      const visibility: "ownerOnly" | "quizEligible" =
        answer.isPrivate || !consentQuizUse ? "ownerOnly" : "quizEligible";

      return [
        {
          questionId: answer.questionId,
          question: answer.question,
          answer: value,
          visibility,
          isPrivate: answer.isPrivate,
        },
      ];
    });

    if (mappedAnswers.length === 0) {
      nextErrors.form = "Dodaj barem jedan odgovor.";
    }

    return {
      ok: Object.values(nextErrors).every((value) => !value),
      errors: nextErrors,
      value: {
        displayName: normalizedDisplayName,
        answers: mappedAnswers,
      },
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    const validation = validateForm();

    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      const result = await updateEntry({
        entryId: entryId as Id<"entries">,
        token,
        displayName: validation.value.displayName,
        answers: validation.value.answers,
        stickerId: selectedSticker || undefined,
        mood: selectedMood || undefined,
        consentOwnerView,
        consentQuizUse,
      });

      if (!result.ok) {
        setErrors({
          form: "Nešto je pošlo po zlu pri spremanju izmjena. Pokušaj ponovno.",
        });
        return;
      }

      setStatusMessage("Promjene su spremljene ✨");
    } catch {
      setErrors({
        form: "Nešto je pošlo po zlu pri spremanju izmjena. Pokušaj ponovno.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setErrors({});
    setStatusMessage("");
    setIsDeleting(true);

    try {
      const result = await softDeleteEntry({
        entryId: entryId as Id<"entries">,
        token,
      });

      if (!result.ok) {
        setErrors({
          form: "Nešto je pošlo po zlu pri brisanju upisa. Pokušaj ponovno.",
        });
        return;
      }

      setIsDeleted(true);
    } catch {
      setErrors({
        form: "Nešto je pošlo po zlu pri brisanju upisa. Pokušaj ponovno.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <EntryShell>
      <form className="space-y-7" onSubmit={handleSubmit}>
        <NotebookHeader
          description={`Ovdje možeš urediti svoj upis u "${entry.lexiconTitle}". Privatni link čuvaj za sebe.`}
          eyebrow="Privatni edit link"
          sticker={selectedSticker || "✏️"}
          title="Uredi svoj upis"
        />

        <div className="flex flex-wrap gap-2">
          <ProgressPill label="Samo preko privatnog linka" tone="blue" />
          <ProgressPill
            label={consentQuizUse ? "Može u kviz" : "Samo za čitanje"}
            tone={consentQuizUse ? "success" : "neutral"}
          />
        </div>

        <RetroCard className="space-y-5 p-5 sm:p-6" variant="paper" withTape>
          <FieldBlock
            error={errors.displayName}
            helper="Ovako te vlasnica prepoznaje u leksikonu."
            id="edit-display-name"
            label="Ime ili nadimak"
          >
            <input
              className="form-control mt-2"
              disabled={isSaving || isDeleting}
              id="edit-display-name"
              maxLength={DISPLAY_NAME_MAX_LENGTH}
              onChange={(event) => setDisplayName(event.target.value)}
              value={displayName}
            />
          </FieldBlock>

          <div className="space-y-5">
            {entry.answers.map((answer) => (
              <AnswerField
                answer={answer}
                disabled={isSaving || isDeleting}
                error={errors[answer.questionId]}
                key={answer.questionId}
                onChange={(value) =>
                  setAnswers((current) => ({
                    ...current,
                    [answer.questionId]: value,
                  }))
                }
                value={answers[answer.questionId] ?? ""}
              />
            ))}
          </div>
        </RetroCard>

        <RetroCard className="space-y-5 p-5 sm:p-6" variant="sticker">
          <fieldset>
            <legend className="form-label">Naljepnica upisa</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                aria-pressed={selectedSticker === ""}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-black transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]",
                  selectedSticker === ""
                    ? "border-[var(--color-ink)] bg-[var(--color-gel-yellow)]"
                    : "border-[rgba(36,27,47,0.14)] bg-white/62",
                )}
                disabled={isSaving || isDeleting}
                onClick={() => setSelectedSticker("")}
                type="button"
              >
                Bez naljepnice
              </button>
              {stickerOptions.map((sticker) => (
                <button
                  aria-pressed={selectedSticker === sticker}
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-xl transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]",
                    selectedSticker === sticker
                      ? "border-[var(--color-ink)] bg-[var(--color-gel-yellow)]"
                      : "border-[rgba(36,27,47,0.14)] bg-white/62 hover:border-[var(--color-gel-pink)]",
                  )}
                  disabled={isSaving || isDeleting}
                  key={sticker}
                  onClick={() => setSelectedSticker(sticker)}
                  type="button"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="form-label">Mood upisa</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-[rgba(36,27,47,0.12)] bg-white/58 p-3 text-sm font-bold text-[var(--color-ink)]">
                <input
                  checked={selectedMood === ""}
                  className="h-4 w-4 accent-[var(--color-gel-blue)]"
                  disabled={isSaving || isDeleting}
                  name="edit-entry-mood"
                  onChange={() => setSelectedMood("")}
                  type="radio"
                />
                Bez mooda
              </label>
              {dynamicMoodOptions.map((mood) => (
                <label
                  className="flex items-center gap-3 rounded-2xl border border-[rgba(36,27,47,0.12)] bg-white/58 p-3 text-sm font-bold text-[var(--color-ink)]"
                  key={mood}
                >
                  <input
                    checked={selectedMood === mood}
                    className="h-4 w-4 accent-[var(--color-gel-blue)]"
                    disabled={isSaving || isDeleting}
                    name="edit-entry-mood"
                    onChange={() => setSelectedMood(mood)}
                    type="radio"
                  />
                  {mood}
                </label>
              ))}
            </div>
          </fieldset>
        </RetroCard>

        <RetroCard className="space-y-4 p-5 sm:p-6" variant="notebook">
          <CheckboxField
            checked={consentOwnerView}
            disabled={isSaving || isDeleting}
            error={errors.consentOwnerView}
            label="Razumijem da će moj upis vidjeti vlasnica ovog leksikona."
            onChange={setConsentOwnerView}
          />
          <CheckboxField
            checked={consentQuizUse}
            disabled={isSaving || isDeleting}
            helper="Ako ovo isključiš, tvoji odgovori ostaju samo za čitanje vlasnici i ne ulaze u budući kviz."
            label="Moji odgovori se smiju koristiti u budućem kvizu ‘Pogodi čiji je odgovor?’"
            onChange={setConsentQuizUse}
          />
        </RetroCard>

        {errors.form ? (
          <p className="state-message border-[rgba(190,38,78,0.28)] text-[var(--color-danger)]">
            {errors.form}
          </p>
        ) : null}
        {statusMessage ? (
          <div className="relative space-y-4 overflow-hidden rounded-[1.25rem] border border-[rgba(9,139,104,0.24)] bg-[rgba(9,139,104,0.08)] p-5">
            <SparkleBurst />
            <p className="font-black text-[var(--color-success)]">
              {statusMessage}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={invitePath} variant="secondary">
                Otvori pozivnicu
              </ButtonLink>
              <ButtonLink href={newLexiconPath()} variant="ghost">
                Napravi svoj leksikon
              </ButtonLink>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button disabled={isSaving || isDeleting} size="lg" type="submit">
            {isSaving ? "Spremam izmjene..." : "Spremi izmjene"}
          </Button>
          <ButtonLink href={invitePath} variant="ghost">
            Otvori pozivnicu
          </ButtonLink>
        </div>

        <section className="space-y-4 rounded-[1.25rem] border border-[rgba(190,38,78,0.24)] bg-[rgba(190,38,78,0.07)] p-5">
          <div>
            <ProgressPill label="Opasna zona" tone="pink" />
            <h2 className="mt-3 text-2xl font-black text-[var(--color-ink)]">
              Obriši moj upis
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Ako obrišeš upis, vlasnica ga više neće vidjeti u svom
              leksikonu.
            </p>
          </div>

          {isConfirmingDelete ? (
            <div className="space-y-4 rounded-[1rem] border border-[rgba(190,38,78,0.22)] bg-white/64 p-4">
              <div>
                <p className="text-base font-black text-[var(--color-danger)]">
                  Jesi sigurna?
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Ova akcija će sakriti tvoj upis iz leksikona.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  disabled={isDeleting || isSaving}
                  onClick={() => setIsConfirmingDelete(false)}
                  type="button"
                  variant="secondary"
                >
                  Odustani
                </Button>
                <Button
                  disabled={isDeleting || isSaving}
                  onClick={handleDelete}
                  type="button"
                  variant="danger"
                >
                  {isDeleting ? "Brišem upis..." : "Da, obriši moj upis"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              disabled={isSaving || isDeleting}
              onClick={() => setIsConfirmingDelete(true)}
              type="button"
              variant="danger"
            >
              Obriši upis
            </Button>
          )}
        </section>
      </form>
    </EntryShell>
  );
}

function AnswerField({
  answer,
  disabled,
  error,
  onChange,
  value,
}: {
  answer: EditableAnswer;
  disabled: boolean;
  error?: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const maxLength = getAnswerMaxLength(answer);
  const isShort = maxLength <= SHORT_ANSWER_MAX_LENGTH;
  const isPrivate = answer.isPrivate || answer.visibility === "ownerOnly";

  return (
    <FieldBlock
      error={error}
      helper={
        isPrivate
          ? "Ovaj odgovor vidi vlasnica, ali ga ne prikazujemo javno."
          : "Uredi odgovor i spremi promjene kad si zadovoljna."
      }
      id={`edit-${answer.questionId}`}
      label={answer.question}
      trailing={isPrivate ? <ProgressPill label="Privatno" tone="pink" /> : null}
    >
      {isShort ? (
        <input
          className="form-control mt-2"
          disabled={disabled}
          id={`edit-${answer.questionId}`}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
      ) : (
        <textarea
          className="form-control mt-2 min-h-28 resize-y"
          disabled={disabled}
          id={`edit-${answer.questionId}`}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
      )}
      <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
        {value.length}/{maxLength}
      </p>
    </FieldBlock>
  );
}

function FieldBlock({
  children,
  error,
  helper,
  id,
  label,
  trailing,
}: {
  children: ReactNode;
  error?: string;
  helper: string;
  id: string;
  label: string;
  trailing?: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
        {trailing}
      </div>
      <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
        {helper}
      </p>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function CheckboxField({
  checked,
  disabled,
  error,
  helper,
  label,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  error?: string;
  helper?: string;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <label className="flex gap-3 rounded-2xl bg-white/55 p-4 text-sm leading-6 text-[var(--color-muted)]">
        <input
          checked={checked}
          className="mt-1 h-4 w-4 accent-[var(--color-gel-blue)]"
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span>
          <span className="font-bold text-[var(--color-ink)]">{label}</span>
          {helper ? <span className="mt-1 block">{helper}</span> : null}
        </span>
      </label>
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 text-sm font-semibold text-[var(--color-danger)]">
      {message}
    </p>
  );
}
