import type { ReactNode } from "react";
import { cn } from "@/lib/class-names";

type NotebookPaperProps = {
  children: ReactNode;
  variant?: "grid" | "lined" | "plain";
  className?: string;
};

const variantClasses = {
  grid: "notebook-grid",
  lined: "notebook-lined",
  plain: "bg-[var(--color-paper)]",
} as const;

export function NotebookPaper({
  children,
  variant = "grid",
  className,
}: NotebookPaperProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] border border-[rgba(36,27,47,0.14)] px-5 py-6 shadow-[var(--shadow-paper)] sm:rounded-[1.75rem] sm:px-7 sm:py-8",
        "before:absolute before:inset-y-0 before:left-7 before:w-px before:bg-[rgba(224,68,157,0.28)] before:content-[''] sm:before:left-10",
        variantClasses[variant],
        className,
      )}
    >
      <div className="relative">{children}</div>
    </div>
  );
}
