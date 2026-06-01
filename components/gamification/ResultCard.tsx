import type { ReactNode } from "react";
import { RetroCard } from "@/components/RetroCard";
import { SparkleBurst } from "@/components/ui/SparkleBurst";
import { Sticker } from "@/components/ui/Sticker";
import { cn } from "@/lib/class-names";

type ResultCardProps = {
  title: string;
  description: string;
  emoji?: string;
  action?: ReactNode;
  className?: string;
};

export function ResultCard({
  action,
  className,
  description,
  emoji = "✨",
  title,
}: ResultCardProps) {
  return (
    <RetroCard
      className={cn(
        "relative overflow-hidden p-5 sm:p-6",
        "border-[rgba(224,68,157,0.24)] bg-[rgba(224,68,157,0.08)]",
        className,
      )}
      variant="sticker"
      withTape
    >
      <SparkleBurst />
      <div className="relative z-[1] flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-gel-pink)]">
            Ti si...
          </p>
          <h2 className="mt-2 break-words text-3xl font-black leading-tight text-[var(--color-ink)]">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            {description}
          </p>
        </div>
        <Sticker className="shrink-0 rotate-6" size="lg" variant="yellow">
          {emoji}
        </Sticker>
      </div>
      {action ? <div className="relative z-[1] mt-5">{action}</div> : null}
    </RetroCard>
  );
}
