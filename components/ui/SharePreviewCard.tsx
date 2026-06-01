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
        "w-full max-w-full min-w-0 overflow-hidden rounded-[1.4rem] border border-[rgba(36,27,47,0.14)] bg-white/70 p-4 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(9,139,104,0.12)] text-xl">
          💬
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="min-w-0 break-words font-black leading-tight text-[var(--color-ink)] [overflow-wrap:anywhere]">
              {title}
            </p>
            <Sticker size="sm" variant="green">
              link
            </Sticker>
          </div>
          <p className="mt-2 min-w-0 break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere]">
            {description}
          </p>
          <p className="mt-3 max-w-full break-all text-xs font-bold leading-5 text-[var(--color-gel-blue)] [overflow-wrap:anywhere]">
            {urlLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
