"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api/axios";
import {
  createPelada,
  deletePelada,
  getPelada,
  getPeladas,
  updatePelada,
} from "@/lib/api/peladas";
import type { PeladaPayload } from "@/types/api";

export const peladaKeys = {
  all: ["peladas"] as const,
  detail: (peladaId: string) => ["peladas", peladaId] as const,
};

export function usePeladas() {
  return useQuery({
    queryKey: peladaKeys.all,
    queryFn: getPeladas,
    select: (response) => response.data.peladas,
  });
}

export function usePelada(peladaId: string) {
  return useQuery({
    queryKey: peladaKeys.detail(peladaId),
    queryFn: () => getPelada(peladaId),
    select: (response) => response.data.pelada,
  });
}

export function useCreatePelada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PeladaPayload) => createPelada(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: peladaKeys.all });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdatePelada(peladaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PeladaPayload) => updatePelada(peladaId, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: peladaKeys.all });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeletePelada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (peladaId: string) => deletePelada(peladaId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: peladaKeys.all });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
