import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/class-names";
import type { ButtonSize, ButtonVariant } from "@/lib/design";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClasses =
  "inline-flex min-h-11 max-w-full items-center justify-center rounded-full border-2 text-center font-black leading-tight whitespace-normal break-words no-underline shadow-[var(--shadow-marker)] transition duration-150 ease-out [overflow-wrap:anywhere] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)] active:translate-x-0.5 active:translate-y-0.5 disabled:pointer-events-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "gel-shimmer border-[var(--color-ink)] bg-[var(--color-primary)] text-[var(--color-ink)] hover:bg-[var(--color-gel-yellow)]",
  secondary:
    "border-[rgba(36,27,47,0.24)] bg-[var(--color-paper-strong)] text-[var(--color-ink)] hover:border-[var(--color-gel-blue)] hover:text-[var(--color-gel-blue)]",
  accent:
    "border-[var(--color-gel-pink)] bg-[rgba(224,68,157,0.16)] text-[var(--color-ink)] hover:border-[var(--color-gel-purple)] hover:bg-[rgba(224,68,157,0.24)] hover:text-[var(--color-ink)]",
  ghost:
    "border-transparent bg-transparent text-[var(--color-gel-blue)] shadow-none hover:bg-white/55",
  danger:
    "border-[var(--color-danger)] bg-[var(--color-paper-strong)] text-[var(--color-danger)] hover:bg-[rgba(190,38,78,0.08)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "min-h-12 px-6 py-4 text-base",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName({ variant, size, className })}
      type={type}
      {...props}
    />
  );
}
