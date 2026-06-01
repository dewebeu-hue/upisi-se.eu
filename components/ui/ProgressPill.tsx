import { cn } from "@/lib/class-names";
import type { StatusTone } from "@/lib/design";

type ProgressPillProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-[rgba(36,27,47,0.14)] bg-white/65 text-[var(--color-muted)]",
  pink: "border-[rgba(224,68,157,0.24)] bg-[rgba(224,68,157,0.10)] text-[var(--color-gel-pink)]",
  blue: "border-[rgba(36,87,214,0.22)] bg-[rgba(36,87,214,0.10)] text-[var(--color-gel-blue)]",
  yellow: "border-[rgba(151,116,0,0.18)] bg-[rgba(255,227,109,0.48)] text-[var(--color-ink)]",
  success: "border-[rgba(9,139,104,0.22)] bg-[rgba(9,139,104,0.10)] text-[var(--color-success)]",
};

export function ProgressPill({
  label,
  tone = "neutral",
  className,
}: ProgressPillProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 max-w-full items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em]",
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
