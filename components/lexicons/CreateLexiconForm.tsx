"use client";

import { useMutation } from "convex/react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { hasConvexClientConfig } from "@/components/providers/ConvexClientProvider";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverPreview } from "@/components/ui/CoverPreview";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { SharePreviewCard } from "@/components/ui/SharePreviewCard";
import { SparkleBurst } from "@/components/ui/SparkleBurst";
import { cn } from "@/lib/class-names";
import {
  coverThemeOptions,
  getCoverThemeOption,
  questionPackOptions,
  type CoverThemeKey,
  type QuestionPackKey,
} from "@/lib/design";
import { getPublicErrorMessage } from "@/lib/errors";
import {
  LEXICON_TITLE_MAX_LENGTH,
  OWNER_NAME_MAX_LENGTH,
} from "@/lib/limits";
import { homePath } from "@/lib/routes";

type FieldErrors = {
  ownerName?: string;
  title?: string;
  cover?: string;
  questionPackKey?: string;
  form?: string;
};

type CreatedLexicon = {
  slug: string;
  invitePath: string;
  adminPath: string;
  inviteUrl: string;
  adminUrl: string;
};

type CopyTarget = "invite" | "admin";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

function getConfiguredOrigin(): string {
  if (siteUrl?.trim()) {
    return siteUrl.trim().replace(/\/+$/g, "");
  }

  return window.location.origin;
}

function toAbsoluteUrl(path: string): string {
  return new URL(path, getConfiguredOrigin()).toString();
}

function validateCreateForm(input: {
  ownerName: string;
  title: string;
  coverKey: string;
  questionPackKey: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const ownerName = input.ownerName.trim();
  const title = input.title.trim();

  if (!ownerName) {
    errors.ownerName = "Ime ili nadimak je obavezno.";
  } else if (ownerName.length > OWNER_NAME_MAX_LENGTH) {
    errors.ownerName = `Ime može imati najviše ${OWNER_NAME_MAX_LENGTH} znakova.`;
  }

  if (!title) {
    errors.title = "Naziv leksikona je obavezan.";
  } else if (title.length > LEXICON_TITLE_MAX_LENGTH) {
    errors.title = `Naziv može imati najviše ${LEXICON_TITLE_MAX_LENGTH} znakova.`;
  }

  if (!coverThemeOptions.some((option) => option.key === input.coverKey)) {
    errors.cover = "Odaberi korice.";
  }

  if (
    !questionPackOptions.some(
      (option) => option.key === input.questionPackKey,
    )
  ) {
    errors.questionPackKey = "Odaberi paket pitanja.";
  }

  return errors;
}

function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}

async function copyText(value: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}

function MissingConvexState() {
  return (
    <div className="rounded-[1.25rem] border border-[rgba(190,38,78,0.24)] bg-[rgba(190,38,78,0.07)] p-5">
      <ProgressPill label="Lokalni setup" tone="pink" />
      <h2 className="mt-3 text-2xl font-black text-[var(--color-ink)]">
        Convex nije spojen za lokalni razvoj.
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        Pokreni <code className="font-bold">npx.cmd convex dev</code> i dodaj{" "}
        <code className="font-bold">NEXT_PUBLIC_CONVEX_URL</code> u lokalne env
        varijable. Stranica je spremna, ali forma ne može spremati bez Convexa.
      </p>
    </div>
  );
}

export function CreateLexiconForm() {
  if (!hasConvexClientConfig()) {
    return <MissingConvexState />;
  }

  return <CreateLexiconFormInner />;
}

function CreateLexiconFormInner() {
  const createLexicon = useMutation(api.lexicons.createLexicon);
  const [ownerName, setOwnerName] = useState("");
  const [title, setTitle] = useState("");
  const [coverKey, setCoverKey] = useState<CoverThemeKey>(
    coverThemeOptions[0].key,
  );
  const [questionPackKey, setQuestionPackKey] = useState<QuestionPackKey>(
    questionPackOptions[0].key,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [createdLexicon, setCreatedLexicon] = useState<CreatedLexicon | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [copyError, setCopyError] = useState("");

  const selectedCover = useMemo(
    () => getCoverThemeOption(coverKey),
    [coverKey],
  );

  const selectedQuestionPack = useMemo(
    () =>
      questionPackOptions.find((option) => option.key === questionPackKey) ??
      questionPackOptions[0],
    [questionPackKey],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateCreateForm({
      ownerName,
      title,
      coverKey,
      questionPackKey,
    });

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setCreatedLexicon(null);
      return;
    }

    setErrors({});
    setCopyError("");
    setCopiedTarget(null);
    setIsSubmitting(true);

    try {
      const result = await createLexicon({
        ownerName: ownerName.trim(),
        title: title.trim(),
        theme: selectedCover.key,
        coverStyle: selectedCover.key,
        questionPackKey: selectedQuestionPack.key,
      });

      setCreatedLexicon({
        slug: result.slug,
        invitePath: result.invitePath,
        adminPath: result.adminPath,
        inviteUrl: toAbsoluteUrl(result.invitePath),
        adminUrl: toAbsoluteUrl(result.adminPath),
      });
    } catch (error) {
      setErrors({
        form: getPublicErrorMessage(error),
      });
      setCreatedLexicon(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy(target: CopyTarget, value: string) {
    setCopyError("");

    try {
      const copied = await copyText(value);

      if (!copied) {
        setCopyError(
          "Nisam uspio automatski kopirati. Označi link i kopiraj ručno.",
        );
        return;
      }

      setCopiedTarget(target);
    } catch {
      setCopyError(
        "Nisam uspio automatski kopirati. Označi link i kopiraj ručno.",
      );
    }
  }

  if (createdLexicon) {
    return (
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <CoverPreview
          ownerName={ownerName.trim() || "Tvoje ime"}
          sticker={selectedCover.sticker}
          theme={selectedCover.name}
          title={title.trim() || "Moj leksikon"}
        />

        <section className="relative space-y-5 overflow-hidden rounded-[1.25rem] border border-[rgba(9,139,104,0.24)] bg-[rgba(9,139,104,0.08)] p-5 shadow-[var(--shadow-soft)]">
          <SparkleBurst />
          <div>
            <ProgressPill label="Spremljeno" tone="success" />
            <h2 className="mt-3 text-2xl font-black text-[var(--color-ink)]">
              Tvoj leksikon je spreman ✨
            </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Pošalji javni link frendicama. Privatni link za pregled spremi
              za sebe.
            </p>
          </div>

          <SharePreviewCard
            description="Hej, napravila sam digitalni leksikon. Upiši se kad uhvatiš minutu."
            title="Pozivnica je spremna za dijeljenje"
            urlLabel={createdLexicon.inviteUrl}
          />

          <div className="space-y-4">
            <LinkField
              label="Javni link za frendice"
              value={createdLexicon.inviteUrl}
            />
            <Button
              onClick={() => handleCopy("invite", createdLexicon.inviteUrl)}
              type="button"
              variant="secondary"
            >
              {copiedTarget === "invite" ? "Kopirano!" : "Kopiraj javni link"}
            </Button>
          </div>

          <div className="space-y-4 rounded-[1rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4">
            <div>
              <p className="text-sm font-black text-[var(--color-ink)]">
                Privatni link za pregled
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                Spremi ovaj privatni link. Bez njega kasnije ne možeš otvoriti
                pregled upisa.
              </p>
            </div>
            <LinkField label="Samo za tebe" value={createdLexicon.adminUrl} />
            <Button
              onClick={() => handleCopy("admin", createdLexicon.adminUrl)}
              type="button"
              variant="secondary"
            >
              {copiedTarget === "admin"
                ? "Kopirano!"
                : "Kopiraj privatni link"}
            </Button>
          </div>

          {copyError ? (
            <p
              aria-live="polite"
              className="state-message border-[rgba(190,38,78,0.28)] text-[var(--color-danger)]"
            >
              {copyError}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={createdLexicon.invitePath}>
              Otvori pozivnicu
            </ButtonLink>
            <ButtonLink href={createdLexicon.adminPath} variant="ghost">
              Otvori privatni pregled
            </ButtonLink>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <aside className="space-y-4 lg:sticky lg:top-6">
        <CoverPreview
          ownerName={ownerName.trim() || "Tvoje ime"}
          sticker={selectedCover.sticker}
          theme={selectedCover.name}
          title={title.trim() || "Moj leksikon"}
        />
        <div className="rounded-[1.1rem] border border-[rgba(36,27,47,0.12)] bg-white/60 p-4">
          <ProgressPill label="Bez registracije" tone="blue" />
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Privatni link za pregled dobivaš nakon kreiranja. Javni link
            šalješ u WhatsApp/Viber grupu, privatni link čuvaš za pregled
            upisa.
          </p>
        </div>
      </aside>

      <form
        className="space-y-6 rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-5 shadow-[var(--shadow-soft)]"
        onSubmit={handleSubmit}
      >
        <div>
          <ProgressPill label="Korak 1" tone="yellow" />
          <h2 className="mt-3 text-2xl font-black text-[var(--color-ink)]">
            Postavi osnovu leksikona
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Unesi samo ono što treba za prvi link. Korice i pitanja možeš
            polirati kasnije.
          </p>
        </div>

        <FieldBlock
          error={errors.ownerName}
          helper="Ovo će frendice vidjeti na pozivnici."
          id="owner-name"
          label="Tvoje ime ili nadimak"
        >
          <input
            autoComplete="given-name"
            className="form-control mt-2"
            disabled={isSubmitting}
            id="owner-name"
            maxLength={OWNER_NAME_MAX_LENGTH}
            onChange={(event) => setOwnerName(event.target.value)}
            placeholder="npr. Ana"
            value={ownerName}
          />
        </FieldBlock>

        <FieldBlock
          error={errors.title}
          helper="Može biti nostalgično, dramatično ili potpuno interno."
          id="lexicon-title"
          label="Naziv leksikona"
        >
          <input
            className="form-control mt-2"
            disabled={isSubmitting}
            id="lexicon-title"
            maxLength={LEXICON_TITLE_MAX_LENGTH}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="npr. Anin leksikon iz 2002."
            value={title}
          />
        </FieldBlock>

        <fieldset>
          <legend className="form-label">Korice</legend>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
            Ovaj izbor određuje izgled korica i osnovni ton leksikona.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {coverThemeOptions.map((option) => (
              <RadioCard
                checked={coverKey === option.key}
                description={option.description}
                disabled={isSubmitting}
                key={option.key}
                name="cover"
                onChange={() => setCoverKey(option.key)}
                title={`${option.emoji} ${option.label}`}
                value={option.key}
              />
            ))}
          </div>
          <FieldError message={errors.cover} />
        </fieldset>

        <fieldset>
          <legend className="form-label">Paket pitanja</legend>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
            Odaberi smjer pitanja koji najbolje paše tvojoj ekipi.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {questionPackOptions.map((option) => (
              <RadioCard
                checked={questionPackKey === option.key}
                description={option.description}
                disabled={isSubmitting}
                key={option.key}
                name="questionPack"
                onChange={() => setQuestionPackKey(option.key)}
                title={option.name}
                value={option.key}
              />
            ))}
          </div>
          <FieldError message={errors.questionPackKey} />
        </fieldset>

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
            {isSubmitting ? "Radim leksikon..." : "Napravi leksikon"}
          </Button>
          <ButtonLink href={homePath()} variant="ghost">
            Vrati se na početnu
          </ButtonLink>
        </div>
      </form>
    </div>
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
  helper: string;
  id: string;
  label: string;
}) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
        {helper}
      </p>
      {children}
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

function RadioCard({
  checked,
  description,
  disabled = false,
  name,
  onChange,
  title,
  value,
}: {
  checked: boolean;
  description: string;
  disabled?: boolean;
  name: string;
  onChange: () => void;
  title: string;
  value: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-28 cursor-pointer flex-col rounded-[1rem] border bg-white/58 p-4 transition hover:border-[var(--color-gel-blue)] hover:bg-white/75",
        disabled && "cursor-not-allowed opacity-60 hover:border-[rgba(36,27,47,0.13)]",
        checked
          ? "border-[var(--color-gel-blue)] shadow-[0_0_0_4px_rgba(36,87,214,0.10)]"
          : "border-[rgba(36,27,47,0.13)]",
      )}
    >
      <span className="flex items-start gap-3">
        <input
          checked={checked}
          className="mt-1 h-4 w-4 accent-[var(--color-gel-blue)]"
          disabled={disabled}
          name={name}
          onChange={onChange}
          type="radio"
          value={value}
        />
        <span>
          <span className="block text-sm font-black text-[var(--color-ink)]">
            {title}
          </span>
          <span className="mt-1 block text-sm leading-5 text-[var(--color-muted)]">
            {description}
          </span>
        </span>
      </span>
    </label>
  );
}

function LinkField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      <input
        className="form-control mt-2 font-mono text-sm"
        onFocus={(event) => event.currentTarget.select()}
        readOnly
        value={value}
      />
    </label>
  );
}
