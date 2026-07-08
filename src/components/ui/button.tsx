import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "dark" | "clay" | "rose" | "ghost" | "wa";
type Size = "sm" | "md" | "lg";

const sizeClass: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

interface CommonProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "dark",
  size = "md",
  block,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("btn", `btn-${variant}`, sizeClass[size], block && "btn-block", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "dark",
  size = "md",
  block,
  className,
  children,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn("btn", `btn-${variant}`, sizeClass[size], block && "btn-block", className)} {...rest}>
      {children}
    </a>
  );
}
