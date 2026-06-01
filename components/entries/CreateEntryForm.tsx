"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RetroCard } from "@/components/RetroCard";
import { hasConvexClientConfig } from "@/components/providers/ConvexClientProvider";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverPreview } from "@/components/ui/CoverPreview";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotebookHeader } from "@/components/ui/NotebookHeader";
import { NotebookPaper } from "@/components/ui/NotebookPaper";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SparkleBurst } from "@/components/ui/SparkleBurst";
import { copyTextToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/class-names";
import { coverThemeOptions, stickerOptions } from "@/lib/design";
import { getPublicErrorMessage } from "@/lib/errors";
import { DISPLAY_NAME_MAX_LENGTH } from "@/lib/limits";
import {
  BASIC_ENTRY_QUESTIONS,
  DEFAULT_ENTRY_QUESTIONS,
  EXTENDED_ENTRY_QUESTIONS,
  type EntryQuestion,
} from "@/lib/question-pack";
import { editEntryPath, lexiconThanksPath, newLexiconPath } from "@/lib/routes";
import { createAbsoluteUrl } from "@/lib/share";

type CreateEntryFormProps = {
  slug: string;
};

type AnswerState = Record<string, string>;

type FieldErrors = {
  displayName?: string;
  consentOwnerView?: string;
  form?: string;
} & Record<string, string | undefined>;

type CreatedEntry = {
  editPath: string;
  editUrl: string;
  thanksPath: string;
  entryCount: number;
  quizUnlockEntryCount: number;
  quizUnlocked: boolean;
};

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const moodOptions = ["Nostalgija", "Drama", "Smijeh", "Tajna ekipa"] as const;

function EntryShell({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <NotebookPaper className="w-full" variant="lined">
        {children}
      </NotebookPaper>
    </section>
  );
}

function getOrigin(): string {
  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  return typeof window === "undefined" ? "" : window.location.origin;
}

function toAbsolutePath(path: string): string {
  const origin = getOrigin();
  return origin ? createAbsoluteUrl(path, origin) : path;
}

function createInitialAnswers(): AnswerState {
  return Object.fromEntries(
    DEFAULT_ENTRY_QUESTIONS.map((question) => [question.id, ""]),
  );
}

function getCoverThemeName(theme: string, coverStyle: string): string {
  const option =
    coverThemeOptions.find((item) => item.key === coverStyle) ??
    coverThemeOptions.find((item) => item.key === theme) ??
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

function validateEntryForm(input: {
  displayName: string;
  answers: AnswerState;
  consentOwnerView: boolean;
}): FieldErrors {
  const errors: FieldErrors = {};
  const displayName = input.displayName.trim();

  if (!displayName) {
    errors.displayName = "Ime ili nadimak je obavezno.";
  } else if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    errors.displayName = `Ime može imati najviše ${DISPLAY_NAME_MAX_LENGTH} znakova.`;
  }

  for (const question of DEFAULT_ENTRY_QUESTIONS) {
    const value = (input.answers[question.id] ?? "").trim();

    if (question.required && !value) {
      errors[question.id] = "Ovaj odgovor je obavezan.";
      continue;
    }

    if (value.length > question.maxLength) {
      errors[question.id] = "Odgovor je predug.";
    }
  }

  if (!input.consentOwnerView) {
    errors.consentOwnerView =
      "Za slanje upisa moraš potvrditi da vlasnica smije vidjeti upis.";
  }

  return errors;
}

function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}

function mapAnswers(
  answers: AnswerState,
  consentQuizUse: boolean,
) {
  return DEFAULT_ENTRY_QUESTIONS.flatMap((question) => {
    const answer = (answers[question.id] ?? "").trim();

    if (!answer && !question.required) {
      return [];
    }

    const visibility: "ownerOnly" | "quizEligible" =
      question.isPrivate || !question.quizEligible || !consentQuizUse
        ? "ownerOnly"
        : "quizEligible";

    return [
      {
        questionId: question.id,
        question: question.label,
        answer,
        visibility,
        isPrivate: question.isPrivate,
      },
    ];
  });
}

function MissingConvexState() {
  return (
    <EntryShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Pokreni npx.cmd convex dev i dodaj NEXT_PUBLIC_CONVEX_URL u lokalne env varijable kako bi forma mogla spremiti upis."
        sticker="📼"
        title="Convex nije spojen za lokalni razvoj"
      />
    </EntryShell>
  );
}

export function CreateEntryForm({ slug }: CreateEntryFormProps) {
  if (!hasConvexClientConfig()) {
    return <MissingConvexState />;
  }

  return <CreateEntryFormInner slug={slug} />;
}

function CreateEntryFormInner({ slug }: CreateEntryFormProps) {
  const lexicon = useQuery(api.lexicons.getPublicLexiconBySlug, { slug });
  const createEntry = useMutation(api.entries.createEntry);
  const [displayName, setDisplayName] = useState("");
  const [answers, setAnswers] = useState<AnswerState>(createInitialAnswers);
  const [selectedSticker, setSelectedSticker] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [consentOwnerView, setConsentOwnerView] = useState(false);
  const [consentQuizUse, setConsentQuizUse] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [createdEntry, setCreatedEntry] = useState<CreatedEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExtendedQuestions, setShowExtendedQuestions] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const progressLabel =
    lexicon && lexicon.quizUnlocked
      ? "Kviz je otključan"
      : lexicon
        ? `${lexicon.entryCount}/${lexicon.quizUnlockEntryCount} upisa do kviza`
        : "Upis u tijeku";

  const coverTheme = lexicon
    ? getCoverThemeName(lexicon.theme, lexicon.coverStyle)
    : coverThemeOptions[0].name;
  const coverSticker = lexicon
    ? getCoverSticker(lexicon.theme, lexicon.coverStyle)
    : "✨";

  const basicAnswerCount = useMemo(
    () =>
      BASIC_ENTRY_QUESTIONS.filter(
        (question) => (answers[question.id] ?? "").trim().length > 0,
      ).length,
    [answers],
  );

  const extendedAnswerCount = useMemo(
    () =>
      EXTENDED_ENTRY_QUESTIONS.filter(
        (question) => (answers[question.id] ?? "").trim().length > 0,
      ).length,
    [answers],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lexicon) {
      return;
    }

    const nextErrors = validateEntryForm({
      displayName,
      answers,
      consentOwnerView,
    });

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    const mappedAnswers = mapAnswers(answers, consentQuizUse);

    if (mappedAnswers.length === 0) {
      setErrors({ form: "Dodaj barem jedan odgovor." });
      return;
    }

    setErrors({});
    setCopyMessage("");
    setIsSubmitting(true);

    try {
      const result = await createEntry({
        lexiconId: lexicon._id,
        displayName: displayName.trim(),
        answers: mappedAnswers,
        stickerId: selectedSticker || undefined,
        mood: selectedMood || undefined,
        consentOwnerView,
        consentQuizUse,
      });

      const editPath =
        result.editPath || editEntryPath(result.entryId, result.editToken);

      setCreatedEntry({
        editPath,
        editUrl: toAbsolutePath(editPath),
        thanksPath: lexiconThanksPath(result.lexiconSlug),
        entryCount: result.entryCount,
        quizUnlockEntryCount: result.quizUnlockEntryCount,
        quizUnlocked: result.quizUnlocked,
      });
    } catch (error) {
      const publicMessage = getPublicErrorMessage(error);
      setErrors({
        form:
          publicMessage === "Nešto je pošlo po zlu. Pokušaj ponovno."
            ? "Nešto je pošlo po zlu pri spremanju upisa. Pokušaj ponovno."
            : publicMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopyEditLink(value: string) {
    setCopyMessage("");

    try {
      const copied = await copyTextToClipboard(value);

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

  if (lexicon === undefined) {
    return (
      <EntryShell>
        <div className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-5 shadow-[var(--shadow-soft)]">
          <ProgressPill label="Otvaram formu..." tone="yellow" />
          <h1 className="mt-4 text-3xl font-black text-[var(--color-ink)]">
            Pripremam pitanja iz leksikona.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Samo tren, listam stranice i vadim gel olovku.
          </p>
        </div>
      </EntryShell>
    );
  }

  if (lexicon === null) {
    return (
      <EntryShell>
        <EmptyState
          action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
          description="Link je možda pogrešan, obrisan ili više nije aktivan."
          sticker="⭐"
          title="Leksikon nije pronađen"
        />
      </EntryShell>
    );
  }

  if (createdEntry) {
    return (
      <EntryShell>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <CoverPreview
            ownerName={lexicon.ownerName}
            sticker={selectedSticker || coverSticker}
            theme={coverTheme}
            title={lexicon.title}
          />
          <section className="relative space-y-5 overflow-hidden rounded-[1.25rem] border border-[rgba(9,139,104,0.24)] bg-[rgba(9,139,104,0.08)] p-5 shadow-[var(--shadow-soft)]">
            <SparkleBurst />
            <ProgressPill label="Upis spremljen" tone="success" />
            <div>
              <h1 className="text-3xl font-black text-[var(--color-ink)]">
                Upisano ✨
              </h1>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                Upis je spremljen — i to baš prava stranica leksikona. Spremi
                link ispod ako želiš kasnije urediti ili obrisati svoj upis.
              </p>
            </div>

            <div className="rounded-[1rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-4">
              <label className="form-label" htmlFor="edit-link">
                Moj privatni link za uređivanje i brisanje
              </label>
              <input
                className="form-control mt-2 font-mono text-sm"
                id="edit-link"
                onFocus={(event) => event.currentTarget.select()}
                readOnly
                value={createdEntry.editUrl}
              />
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Spremi ga odmah. Bez ovog linka kasnije ne možeš promijeniti
                ili obrisati svoj upis.
              </p>
              <Button
                className="mt-4"
                onClick={() => handleCopyEditLink(createdEntry.editUrl)}
                type="button"
                variant="secondary"
              >
                {copyMessage === "Link je kopiran!"
                  ? "Link je kopiran!"
                  : "Kopiraj privatni link"}
              </Button>
            </div>

            {copyMessage && copyMessage !== "Link je kopiran!" ? (
              <p className="state-message border-[rgba(190,38,78,0.28)] text-[var(--color-danger)]">
                {copyMessage}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={createdEntry.thanksPath} size="lg">
                Nastavi
              </ButtonLink>
              <ButtonLink href={newLexiconPath()} variant="ghost">
                Napravi svoj leksikon
              </ButtonLink>
            </div>

            <ProgressPill
              className={createdEntry.quizUnlocked ? "glitter-border" : undefined}
              label={
                createdEntry.quizUnlocked
                  ? "Kviz je otključan"
                  : `${createdEntry.entryCount}/${createdEntry.quizUnlockEntryCount} upisa do kviza`
              }
              tone={createdEntry.quizUnlocked ? "success" : "yellow"}
            />
          </section>
        </div>
      </EntryShell>
    );
  }

  return (
    <EntryShell>
      <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-6">
          <CoverPreview
            ownerName={lexicon.ownerName}
            sticker={selectedSticker || coverSticker}
            theme={coverTheme}
            title={lexicon.title}
          />
          <div className="rounded-[1.1rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4">
            <ProgressPill
              className={lexicon.quizUnlocked ? "glitter-border" : undefined}
              label={progressLabel}
              tone={lexicon.quizUnlocked ? "success" : "yellow"}
            />
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Upisuješ se u leksikon koji vodi{" "}
              <span className="font-black text-[var(--color-ink)]">
                {lexicon.ownerName}
              </span>
              . Odgovore vidi vlasnica preko privatnog linka.
            </p>
          </div>
        </aside>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <RetroCard className="p-5 sm:p-6" variant="notebook" withTape>
            <NotebookHeader
              description="Odgovori kratko, iskreno i dovoljno nostalgično da se ekipa nasmije."
              eyebrow="Forma za prijateljicu"
              sticker={selectedSticker || "⭐"}
              title={`Upisuješ se u ${lexicon.title}`}
            />
          </RetroCard>

          <RetroCard className="space-y-5 p-5 sm:p-6" variant="paper">
            <FieldBlock
              error={errors.displayName}
              helper="Ovako će te vlasnica prepoznati."
              id="display-name"
              label="Ime ili nadimak"
            >
              <input
                autoComplete="nickname"
                className="form-control mt-2"
                disabled={isSubmitting}
                id="display-name"
                maxLength={DISPLAY_NAME_MAX_LENGTH}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="npr. Maja iz 8.b"
                value={displayName}
              />
            </FieldBlock>

            <div className="flex flex-wrap gap-2">
              <ProgressPill
                label={`${basicAnswerCount}/${BASIC_ENTRY_QUESTIONS.length} osnovnih odgovora`}
                tone="blue"
              />
              {extendedAnswerCount > 0 ? (
                <ProgressPill
                  label={`${extendedAnswerCount} dodatnih uspomena`}
                  tone="pink"
                />
              ) : null}
              <ProgressPill label="Bez registracije" tone="yellow" />
            </div>
          </RetroCard>

          <RetroCard className="space-y-6 p-5 sm:p-6" variant="paper">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-gel-pink)]">
                Osnovna pitanja
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Kratki upis je sasvim dovoljan. Obavezna pitanja su označena,
                a tajno pitanje može ostati prazno.
              </p>
            </div>
            {BASIC_ENTRY_QUESTIONS.map((question) => (
              <QuestionField
                disabled={isSubmitting}
                error={errors[question.id]}
                key={question.id}
                onChange={(value) =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: value,
                  }))
                }
                question={question}
                value={answers[question.id] ?? ""}
              />
            ))}
          </RetroCard>

          <RetroCard className="space-y-5 p-5 sm:p-6" variant="notebook">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-gel-purple)]">
                  Želim ispuniti još pitanja ✨
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Osnovni upis je dovoljan, ali možeš dodati još uspomena ako
                  želiš. Za slučaj da te uhvatila nostalgija.
                </p>
              </div>
              <Button
                aria-controls="extended-entry-questions"
                aria-expanded={showExtendedQuestions}
                disabled={isSubmitting}
                onClick={() => setShowExtendedQuestions((current) => !current)}
                type="button"
                variant="secondary"
              >
                {showExtendedQuestions
                  ? "Sakrij dodatna pitanja"
                  : "Prikaži dodatna pitanja"}
              </Button>
            </div>

            {showExtendedQuestions ? (
              <div
                className="space-y-6 border-t border-[rgba(36,27,47,0.12)] pt-5"
                id="extended-entry-questions"
              >
                <p className="rounded-2xl border border-[rgba(36,87,214,0.15)] bg-white/55 p-4 text-sm leading-6 text-[var(--color-muted)]">
                  Sva dodatna pitanja su opcionalna. Prazna pitanja se neće
                  spremiti, a privatna poruka ostaje samo za vlasnicu.
                </p>
                {EXTENDED_ENTRY_QUESTIONS.map((question) => (
                  <QuestionField
                    disabled={isSubmitting}
                    error={errors[question.id]}
                    key={question.id}
                    onChange={(value) =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: value,
                      }))
                    }
                    question={question}
                    value={answers[question.id] ?? ""}
                  />
                ))}
              </div>
            ) : null}
          </RetroCard>

          <RetroCard className="space-y-5 p-5 sm:p-6" variant="sticker">
            <fieldset>
              <legend className="form-label">
                Odaberi naljepnicu za svoj upis
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {stickerOptions.map((sticker) => (
                  <button
                    aria-pressed={selectedSticker === sticker}
                    className={cn(
                      "min-h-11 rounded-full border px-4 text-xl transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]",
                      selectedSticker === sticker
                        ? "border-[var(--color-gel-blue)] bg-white shadow-[0_0_0_4px_rgba(36,87,214,0.10)]"
                        : "border-[rgba(36,27,47,0.14)] bg-white/58",
                    )}
                    disabled={isSubmitting}
                    key={sticker}
                    onClick={() =>
                      setSelectedSticker((current) =>
                        current === sticker ? "" : sticker,
                      )
                    }
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
                {moodOptions.map((mood) => (
                  <label
                    className="flex items-center gap-3 rounded-2xl border border-[rgba(36,27,47,0.12)] bg-white/58 p-3 text-sm font-bold text-[var(--color-ink)]"
                    key={mood}
                  >
                    <input
                      checked={selectedMood === mood}
                      className="h-4 w-4 accent-[var(--color-gel-blue)]"
                      disabled={isSubmitting}
                      name="entry-mood"
                      onChange={() => setSelectedMood(mood)}
                      type="radio"
                    />
                    {mood}
                  </label>
                ))}
              </div>
            </fieldset>
          </RetroCard>

          <RetroCard className="space-y-4 p-5 sm:p-6" variant="paper">
            <CheckboxField
              checked={consentOwnerView}
              disabled={isSubmitting}
              error={errors.consentOwnerView}
              label="Razumijem da će moj upis vidjeti vlasnica ovog leksikona."
              onChange={setConsentOwnerView}
            />
            <CheckboxField
              checked={consentQuizUse}
              disabled={isSubmitting}
              helper="Default je isključeno. Ako ostane isključeno, tvoji odgovori neće ulaziti u budući kviz."
              label="Moji odgovori se smiju koristiti u budućem kvizu ‘Pogodi čiji je odgovor?’"
              onChange={setConsentQuizUse}
            />
          </RetroCard>

          {errors.form ? (
            <p className="state-message border-[rgba(190,38,78,0.28)] text-[var(--color-danger)]">
              {errors.form}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {isSubmitting ? "Spremam upis..." : "Pošalji upis"}
            </Button>
            <ButtonLink href={newLexiconPath()} variant="ghost">
              Napravi svoj leksikon
            </ButtonLink>
          </div>
        </form>
      </div>
    </EntryShell>
  );
}

function FieldBlock({
  children,
  error,
  helper,
  id,
  label,
}: {
  children: ReactNode;
  error?: string;
  helper?: string;
  id: string;
  label: string;
}) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      {helper ? (
        <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
          {helper}
        </p>
      ) : null}
      {children}
      <FieldError message={error} />
    </div>
  );
}

function QuestionField({
  disabled,
  error,
  onChange,
  question,
  value,
}: {
  disabled: boolean;
  error?: string;
  onChange: (value: string) => void;
  question: EntryQuestion;
  value: string;
}) {
  const isShort = question.type === "shortText" || question.type === "optionalSecret";

  return (
    <FieldBlock
      error={error}
      helper={question.helperText}
      id={question.id}
      label={`${question.label}${question.required ? " *" : ""}`}
    >
      {isShort ? (
        <input
          className="form-control mt-2"
          disabled={disabled}
          id={question.id}
          maxLength={question.maxLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            question.type === "optionalSecret"
              ? "Može ostati prazno."
              : "Napiši kratko, kao u pravom leksikonu."
          }
          value={value}
        />
      ) : (
        <textarea
          className="form-control mt-2 min-h-28 resize-y"
          disabled={disabled}
          id={question.id}
          maxLength={question.maxLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Napiši kratko, interno i dovoljno jasno."
          value={value}
        />
      )}
      <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
        {value.length}/{question.maxLength}
        {question.isPrivate ? " · vidi samo vlasnica" : ""}
      </p>
    </FieldBlock>
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
