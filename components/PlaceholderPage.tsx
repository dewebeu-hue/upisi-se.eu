import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotebookHeader } from "@/components/ui/NotebookHeader";
import { NotebookPaper } from "@/components/ui/NotebookPaper";
import { PLACEHOLDER_COPY } from "@/lib/app-copy";

type PlaceholderPageProps = {
  title: string;
  description: string;
  eyebrow?: string;
  sticker?: string;
  children?: ReactNode;
};

export function PlaceholderPage({
  title,
  description,
  eyebrow = PLACEHOLDER_COPY.workInProgress,
  sticker = "✨",
  children,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 items-center px-5 py-10 sm:px-8 sm:py-16">
      <NotebookPaper className="w-full" variant="grid">
        <NotebookHeader
          description={description}
          eyebrow={eyebrow}
          sticker={sticker}
          title={title}
        />
        <div className="mt-8">
          {children ?? (
            <EmptyState
              description="Ova stranica je već rezervirana u flowu i dobit će pravi sadržaj u sljedećim koracima."
              title="Pripremljeno za MVP"
            />
          )}
        </div>
      </NotebookPaper>
    </section>
  );
}
