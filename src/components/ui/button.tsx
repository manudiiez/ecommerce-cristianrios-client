import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "dark" | "clay" | "rose" | "ghost" | "wa";
type Size = "sm" | "md" | "lg";

export const btnBase =
  "inline-flex items-center justify-center gap-[9px] rounded-full py-[13px] px-[22px] font-semibold text-[14.5px] whitespace-nowrap cursor-pointer border border-transparent transition duration-150 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

export const btnVariantClass: Record<Variant, string> = {
  dark: "bg-ink text-paper",
  clay: "bg-clay text-white",
  rose: "bg-rose-deep text-white",
  ghost: "bg-transparent border-line-strong text-ink hover:bg-surface",
  wa: "bg-whatsapp text-whatsapp-deep",
};

export const btnSizeClass: Record<Size, string> = {
  sm: "py-[9px] px-[15px] text-[13px]",
  md: "",
  lg: "py-4 px-7 text-base",
};

const base = btnBase;
const variantClass = btnVariantClass;
const sizeClass = btnSizeClass;

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
      className={cn(base, variantClass[variant], sizeClass[size], block && "w-full", className)}
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
    <a className={cn(base, variantClass[variant], sizeClass[size], block && "w-full", className)} {...rest}>
      {children}
    </a>
  );
}
