import type { ReactNode } from "react";
import { RetroCard } from "@/components/RetroCard";
import { Sticker } from "@/components/ui/Sticker";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  sticker?: string;
};

export function EmptyState({
  title,
  description,
  action,
  sticker = "✨",
}: EmptyStateProps) {
  return (
    <RetroCard className="p-5 text-center sm:p-7" variant="notebook" withTape>
      <Sticker className="mx-auto" variant="yellow">
        {sticker}
      </Sticker>
      <h2 className="mt-5 text-2xl font-black text-[var(--color-ink)]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-muted)] sm:text-base">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </RetroCard>
  );
}
