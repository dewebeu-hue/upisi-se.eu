import { RetroCard } from "@/components/RetroCard";
import { Sticker } from "@/components/ui/Sticker";

type StepCardProps = {
  number: string | number;
  title: string;
  description: string;
  sticker?: string;
};

export function StepCard({ number, title, description, sticker }: StepCardProps) {
  return (
    <RetroCard className="h-full p-5" variant="paper">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] text-sm font-black text-[var(--color-ink)] shadow-[2px_3px_0_var(--color-ink)]">
          {number}
        </span>
        {sticker ? (
          <Sticker className="-rotate-3" size="sm" variant="pink">
            {sticker}
          </Sticker>
        ) : null}
      </div>
      <h3 className="mt-5 text-lg font-black leading-tight text-[var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
        {description}
      </p>
    </RetroCard>
  );
}
