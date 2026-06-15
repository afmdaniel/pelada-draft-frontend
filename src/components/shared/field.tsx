"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

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
        <span className="mb-[0.4375rem] block font-sans text-[0.78125rem] font-semibold tracking-[0.01em] text-muted-foreground">
          {label}
        </span>
      )}
      {children}
      {error ? (
        <span className="mt-1.5 block text-[0.71875rem] font-semibold text-danger">
          {error}
        </span>
      ) : (
        hint && (
          <span className="mt-1.5 block text-[0.71875rem] text-faint">{hint}</span>
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
        <span className="pointer-events-none absolute top-1/2 left-[0.8125rem] -translate-y-1/2 text-faint">
          <Icon className="size-[1.125rem]" />
        </span>
      )}
      <input
        className={cn(
          "min-h-[3.125rem] w-full rounded-[0.8125rem] border bg-card px-3.5 font-sans text-[0.9375rem] font-semibold text-foreground outline-none transition-all placeholder:text-faint",
          "focus:border-primary focus:shadow-[0_0_0_3px_var(--accent-soft)]",
          invalid ? "border-danger" : "border-line",
          Icon && "pl-[2.625rem]",
          className
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    </div>
  );
}

type PasswordTextFieldProps = Omit<TextFieldProps, "icon" | "type">;

export function PasswordTextField({ invalid, className, ...rest }: PasswordTextFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-[0.8125rem] -translate-y-1/2 text-faint">
        <Lock className="size-[1.125rem]" />
      </span>
      <input
        type={show ? "text" : "password"}
        className={cn(
          "min-h-[3.125rem] w-full rounded-[0.8125rem] border bg-card pl-[2.625rem] pr-[2.75rem] font-sans text-[0.9375rem] font-semibold text-foreground outline-none transition-all placeholder:text-faint",
          "focus:border-primary focus:shadow-[0_0_0_3px_var(--accent-soft)]",
          invalid ? "border-danger" : "border-line",
          className
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        className="absolute top-1/2 right-[0.8125rem] -translate-y-1/2 text-faint transition active:scale-90 hover:text-muted-foreground"
      >
        {show ? <EyeOff className="size-[1.125rem]" /> : <Eye className="size-[1.125rem]" />}
      </button>
    </div>
  );
}
