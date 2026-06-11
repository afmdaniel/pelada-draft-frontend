"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login, logout, register } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/axios";
import { clearIdentifier, saveIdentifier } from "@/lib/utils/current-user";
import type { LoginPayload, RegisterPayload } from "@/types/api";

export function useLogin(redirectTo?: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response, payload) => {
      saveIdentifier(payload.identifier);
      toast.success(response.message);
      router.push(redirectTo ?? "/peladas");
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      router.push("/login");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearIdentifier();
      router.push("/login");
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
