"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api/axios";
import { createPlayer, deletePlayer, updatePlayer } from "@/lib/api/players";
import { peladaKeys } from "@/lib/hooks/use-peladas";
import type { PlayerPayload } from "@/types/api";

export function useCreatePlayer(peladaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlayerPayload) => createPlayer(peladaId, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: peladaKeys.detail(peladaId) });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdatePlayer(peladaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playerId,
      payload,
    }: {
      playerId: string;
      payload: PlayerPayload;
    }) => updatePlayer(peladaId, playerId, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: peladaKeys.detail(peladaId) });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeletePlayer(peladaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playerId: string) => deletePlayer(peladaId, playerId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: peladaKeys.detail(peladaId) });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
