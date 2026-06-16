"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/shared/app-button";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Field, PasswordTextField } from "@/components/shared/field";
import { useChangePassword } from "@/lib/hooks/use-auth";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/validations/auth";

interface ChangePasswordSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordSheet({ open, onOpenChange }: ChangePasswordSheetProps) {
  const mutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  function onSubmit(values: ChangePasswordFormValues) {
    mutation.mutate(values, {
      onSuccess: (response) => {
        toast.success(response.message);
        handleOpenChange(false);
      },
    });
  }

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange} title="Alterar senha">
      <form onSubmit={handleSubmit(onSubmit)} className="pb-1">
        <Field label="Senha atual" error={errors.currentPassword?.message}>
          <PasswordTextField
            {...register("currentPassword")}
            placeholder="Sua senha atual"
            invalid={!!errors.currentPassword}
            autoComplete="current-password"
          />
        </Field>
        <Field label="Nova senha" error={errors.newPassword?.message}>
          <PasswordTextField
            {...register("newPassword")}
            placeholder="Mínimo 6 caracteres"
            invalid={!!errors.newPassword}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Confirmar nova senha" error={errors.newPasswordConfirmation?.message}>
          <PasswordTextField
            {...register("newPasswordConfirmation")}
            placeholder="Repita a nova senha"
            invalid={!!errors.newPasswordConfirmation}
            autoComplete="new-password"
          />
        </Field>
        <AppButton
          type="submit"
          full
          disabled={mutation.isPending}
          className="mt-1"
        >
          {mutation.isPending ? "Alterando..." : "Alterar senha"}
        </AppButton>
      </form>
    </BottomSheet>
  );
}
