import { cn } from "@/lib/class-names";
import { Sticker } from "@/components/ui/Sticker";

type SharePreviewCardProps = {
  title: string;
  description: string;
  urlLabel?: string;
  className?: string;
};

export function SharePreviewCard({
  title,
  description,
  urlLabel = "/l/moj-leksikon",
  className,
}: SharePreviewCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.4rem] border border-[rgba(36,27,47,0.14)] bg-white/70 p-4 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(9,139,104,0.12)] text-xl">
          💬
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-black leading-tight text-[var(--color-ink)]">
              {title}
            </p>
            <Sticker size="sm" variant="green">
              link
            </Sticker>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            {description}
          </p>
          <p className="mt-3 truncate text-xs font-bold text-[var(--color-gel-blue)]">
            {urlLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
