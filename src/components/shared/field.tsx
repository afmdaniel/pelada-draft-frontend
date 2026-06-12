"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-3.5 block">
      {label && (
        <span className="mb-[7px] block font-sans text-[12.5px] font-semibold tracking-[0.01em] text-muted-foreground">
          {label}
        </span>
      )}
      {children}
      {error ? (
        <span className="mt-1.5 block text-[11.5px] font-semibold text-danger">
          {error}
        </span>
      ) : (
        hint && (
          <span className="mt-1.5 block text-[11.5px] text-faint">{hint}</span>
        )
      )}
    </label>
  );
}

interface TextFieldProps extends React.ComponentProps<"input"> {
  icon?: LucideIcon;
  invalid?: boolean;
}

export function TextField({
  icon: Icon,
  invalid,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <div className="relative">
      {Icon && (
        <span className="pointer-events-none absolute top-1/2 left-[13px] -translate-y-1/2 text-faint">
          <Icon className="size-[18px]" />
        </span>
      )}
      <input
        className={cn(
          "h-[50px] w-full rounded-[13px] border bg-card px-3.5 font-sans text-[15px] font-semibold text-foreground outline-none transition-all placeholder:text-faint",
          "focus:border-primary focus:shadow-[0_0_0_3px_var(--accent-soft)]",
          invalid ? "border-danger" : "border-line",
          Icon && "pl-[42px]",
          className
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    </div>
  );
}
