import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { buttonClassName } from "@/components/ui/Button";
import type { ButtonSize, ButtonVariant } from "@/lib/design";

type ButtonLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "href"
> & {
  href: LinkProps["href"];
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  children,
  className,
  href,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClassName({ variant, size, className })}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
