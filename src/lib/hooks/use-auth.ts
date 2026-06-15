"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getMe, login, logout, register } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/axios";
import type { RegisterFormValues } from "@/lib/validations/auth";
import type { LoginPayload } from "@/types/api";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    select: (response) => response.data.user,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useLogin(redirectTo?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (response) => {
      await fetch("/api/auth/session", { method: "POST" });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
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
    mutationFn: ({ acceptedTerms: _, ...payload }: RegisterFormValues) => register(payload),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
      await fetch("/api/auth/session", { method: "DELETE" });
    },
    onSettled: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
