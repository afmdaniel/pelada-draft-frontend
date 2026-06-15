"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_0.5rem_1.25rem_-0.625rem_var(--accent-color)]",
  secondary: "bg-card-hi text-foreground border border-line",
  ghost: "bg-transparent text-muted-foreground",
  danger:
    "bg-danger-soft text-danger border border-[color-mix(in_oklch,var(--danger)_40%,transparent)]",
  soft: "bg-accent-soft text-primary",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-[0.8125rem] px-3 min-h-11 gap-1.5 md:min-h-9",
  md: "text-[0.9375rem] px-4 min-h-12 gap-2",
  lg: "text-base px-5 min-h-13.5 gap-2",
};

interface AppButtonProps extends React.ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  full?: boolean;
}

export function AppButton({
  variant = "primary",
  size = "md",
  icon: Icon,
  full,
  className,
  children,
  ...rest
}: AppButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-sans font-bold transition select-none",
        "active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        full && "w-full",
        className
      )}
      {...rest}
    >
      {Icon && (
        <Icon
          className={size === "sm" ? "size-4" : "size-4.5"}
          strokeWidth={2.2}
        />
      )}
      {children}
    </button>
  );
}
