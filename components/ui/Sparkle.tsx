import { cn } from "@/lib/class-names";

type SparkleProps = {
  size?: "sm" | "md" | "lg";
  tone?: "pink" | "yellow" | "blue" | "purple";
  className?: string;
  decorative?: boolean;
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
} as const;

const toneClasses = {
  pink: "text-[var(--color-gel-pink)]",
  yellow: "text-[var(--color-gel-yellow)]",
  blue: "text-[var(--color-gel-blue)]",
  purple: "text-[var(--color-gel-purple)]",
} as const;

export function Sparkle({
  size = "md",
  tone = "yellow",
  className,
  decorative = true,
}: SparkleProps) {
  const accessibilityProps = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": "Sjaj" } as const);

  return (
    <span
      className={cn(
        "inline-flex select-none items-center justify-center leading-none drop-shadow-[0_5px_10px_rgba(36,27,47,0.14)]",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
      {...accessibilityProps}
    >
      ✨
    </span>
  );
}
