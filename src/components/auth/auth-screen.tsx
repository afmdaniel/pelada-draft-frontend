"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User, Volleyball } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AppButton } from "@/components/shared/app-button";
import { Field, TextField } from "@/components/shared/field";
import { useLogin, useRegister } from "@/lib/hooks/use-auth";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/lib/validations/auth";

function Logo() {
  return (
    <div className="mb-[26px] flex items-center gap-3 animate-fade-up">
      <div
        className="grid size-14 place-items-center rounded-[18px] shadow-[0_14px_30px_-10px_var(--accent-color)]"
        style={{
          background:
            "linear-gradient(150deg, var(--accent-color), var(--accent-press))",
        }}
      >
        <Volleyball
          className="size-8"
          strokeWidth={1.7}
          style={{ color: "var(--accent-ink)" }}
        />
      </div>
      <div>
        <div className="font-display text-3xl leading-[0.95] font-bold uppercase tracking-[0.01em] text-foreground">
          Pelada<span className="text-primary">Draft</span>
        </div>
        <div className="mt-[3px] font-sans text-[12.5px] font-semibold text-faint">
          Times equilibrados em segundos
        </div>
      </div>
    </div>
  );
}

function Segmented({ mode }: { mode: "login" | "register" }) {
  const options = [
    { key: "login", label: "Entrar", href: "/login" },
    { key: "register", label: "Criar conta", href: "/register" },
  ] as const;
  return (
    <div className="mb-[22px] flex gap-1 rounded-[14px] border border-line-soft bg-card p-1 animate-fade-up">
      {options.map((option) => {
        const on = mode === option.key;
        return (
          <Link
            key={option.key}
            href={option.href}
            replace
            className={`flex h-10 flex-1 items-center justify-center rounded-[10px] font-sans text-sm font-bold transition ${
              on
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

function Shell({
  mode,
  children,
}: {
  mode: "login" | "register";
  children: React.ReactNode;
}) {
  return (
    <div className="noscroll flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col justify-center px-[26px] py-8">
        <Logo />
        <Segmented mode={mode} />
        <div className="animate-fade-up">{children}</div>
      </div>
      <div className="px-[26px] pt-3.5 pb-[26px] text-center">
        <span className="text-[11.5px] text-faint">
          Ao continuar você concorda com os termos da pelada ⚽
        </span>
      </div>
    </div>
  );
}

export function LoginScreen({ redirectTo }: { redirectTo?: string }) {
  const loginMutation = useLogin(redirectTo);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  return (
    <Shell mode="login">
      <form
        onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
        noValidate
      >
        <Field label="E-mail ou username" error={errors.identifier?.message}>
          <TextField
            icon={User}
            placeholder="seu@email.com"
            autoComplete="username"
            invalid={!!errors.identifier}
            {...register("identifier")}
          />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <TextField
            icon={Lock}
            type="password"
            placeholder="Sua senha"
            autoComplete="current-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <AppButton
          type="submit"
          full
          size="lg"
          className="mt-1"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </AppButton>
      </form>
      <div className="mt-4 text-center">
        <Link
          href="/register"
          replace
          className="font-sans text-[13.5px] font-semibold text-muted-foreground"
        >
          Não tem conta?{" "}
          <span className="text-primary">Criar nova conta</span>
        </Link>
      </div>
    </Shell>
  );
}

export function RegisterScreen() {
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  return (
    <Shell mode="register">
      <form
        onSubmit={handleSubmit((values) => registerMutation.mutate(values))}
        noValidate
      >
        <Field label="E-mail" error={errors.email?.message}>
          <TextField
            icon={User}
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field label="Username" error={errors.username?.message}>
          <TextField
            icon={User}
            placeholder="comofica"
            autoComplete="username"
            invalid={!!errors.username}
            {...register("username")}
          />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <TextField
            icon={Lock}
            type="password"
            placeholder="Mín. 6 caracteres"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <Field
          label="Confirmar senha"
          error={errors.passwordConfirmation?.message}
        >
          <TextField
            icon={Lock}
            type="password"
            placeholder="Repita a senha"
            autoComplete="new-password"
            invalid={!!errors.passwordConfirmation}
            {...register("passwordConfirmation")}
          />
        </Field>
        <AppButton
          type="submit"
          full
          size="lg"
          className="mt-1"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Criando conta..." : "Criar conta"}
        </AppButton>
      </form>
    </Shell>
  );
}
