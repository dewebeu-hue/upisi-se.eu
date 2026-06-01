import { Sticker } from "@/components/ui/Sticker";

type NotebookHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  sticker?: string;
};

export function NotebookHeader({
  eyebrow,
  title,
  description,
  sticker,
}: NotebookHeaderProps) {
  return (
    <div className="relative">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-gel-pink)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-balance text-4xl font-black leading-[0.98] text-[var(--color-ink)] sm:text-5xl">
            {title}
          </h1>
        </div>
        {sticker ? (
          <Sticker className="shrink-0 rotate-6" size="lg" variant="yellow">
            {sticker}
          </Sticker>
        ) : null}
      </div>
      {description ? (
        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[var(--color-muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
