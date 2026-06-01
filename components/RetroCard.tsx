import type { ReactNode } from "react";
import { Tape } from "@/components/ui/Tape";
import { cn } from "@/lib/class-names";

type RetroCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "paper" | "sticker" | "notebook";
  withTape?: boolean;
};

const variantClasses = {
  paper: "retro-card",
  sticker:
    "border border-white/60 bg-[rgba(255,255,255,0.72)] shadow-[var(--shadow-soft)]",
  notebook: "notebook-lined border border-[rgba(36,27,47,0.14)] shadow-[var(--shadow-paper)]",
} as const;

export function RetroCard({
  children,
  className,
  variant = "paper",
  withTape = false,
}: RetroCardProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-full min-w-0 overflow-hidden rounded-[1.35rem] sm:rounded-[1.6rem]",
        variantClasses[variant],
        className,
      )}
    >
      {withTape ? <Tape className="-top-3 left-8" rotate="left" /> : null}
      {children}
    </div>
  );
}
