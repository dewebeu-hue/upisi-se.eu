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
    <div className="relative min-w-0 max-w-full overflow-hidden">
      <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="max-w-full break-words text-xs font-black uppercase leading-snug tracking-[0.12em] text-[var(--color-gel-pink)] [overflow-wrap:anywhere] sm:tracking-[0.16em]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 max-w-full break-words text-3xl font-black leading-tight text-[var(--color-ink)] [overflow-wrap:anywhere] sm:text-balance sm:text-5xl sm:leading-[0.98]">
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
        <p className="mt-5 max-w-2xl break-words text-base leading-7 text-[var(--color-muted)] [overflow-wrap:anywhere] sm:text-pretty sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
