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
    <RetroCard className="p-4 text-center sm:p-7" variant="notebook" withTape>
      <Sticker className="mx-auto" variant="yellow">
        {sticker}
      </Sticker>
      <h2 className="mt-5 break-words text-2xl font-black text-[var(--color-ink)] [overflow-wrap:anywhere]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md break-words text-sm leading-6 text-[var(--color-muted)] [overflow-wrap:anywhere] sm:text-base">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </RetroCard>
  );
}
