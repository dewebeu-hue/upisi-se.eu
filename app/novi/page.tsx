import { CreateLexiconForm } from "@/components/lexicons/CreateLexiconForm";
import { NotebookHeader } from "@/components/ui/NotebookHeader";
import { NotebookPaper } from "@/components/ui/NotebookPaper";
import { ProgressPill } from "@/components/ui/ProgressPill";

export default function NewLexiconPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <NotebookPaper className="w-full" variant="grid">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <NotebookHeader
            description="Unesi osnovne podatke, izaberi korice i odmah dobivaš javni link za frendice plus privatni link za svoj pregled."
            eyebrow="Kreiranje leksikona"
            sticker="💖"
            title="Napravi svoj leksikon"
          />
          <ProgressPill
            className="shrink-0 self-start"
            label="Bez registracije"
            tone="blue"
          />
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Bez registracije. Privatni link za pregled dobivaš nakon kreiranja.
        </p>

        <div className="mt-8">
          <CreateLexiconForm />
        </div>
      </NotebookPaper>
    </section>
  );
}
