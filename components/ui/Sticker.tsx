import type { ReactNode } from "react";
import { cn } from "@/lib/class-names";
import type { StickerVariant } from "@/lib/design";

type StickerProps = {
  children?: ReactNode;
  label?: string;
  variant?: StickerVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const variantClasses: Record<StickerVariant, string> = {
  pink: "bg-[rgba(255,105,180,0.18)] text-[var(--color-gel-pink)]",
  blue: "bg-[rgba(36,87,214,0.14)] text-[var(--color-gel-blue)]",
  yellow: "bg-[rgba(255,227,109,0.56)] text-[var(--color-ink)]",
  purple: "bg-[rgba(129,78,199,0.16)] text-[var(--color-gel-purple)]",
  green: "bg-[rgba(16,142,104,0.14)] text-[var(--color-gel-green)]",
};

const sizeClasses = {
  sm: "min-h-7 px-2.5 text-xs",
  md: "min-h-9 px-3 text-sm",
  lg: "min-h-11 px-4 text-base",
} as const;

export function Sticker({
  children,
  label,
  variant = "pink",
  size = "md",
  className,
}: StickerProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center justify-center rounded-[0.9rem] border border-white/60 text-center font-black leading-tight whitespace-normal break-words shadow-[0_8px_20px_rgba(36,27,47,0.10)] [overflow-wrap:anywhere]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children ?? label}
    </span>
  );
}
