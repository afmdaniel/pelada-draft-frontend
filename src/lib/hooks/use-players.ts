"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api/axios";
import {
  createPlayer,
  deletePlayer,
  getPlayers,
  updatePlayer,
} from "@/lib/api/players";
import { peladaKeys } from "@/lib/hooks/use-peladas";
import type { PlayerPayload } from "@/types/api";

export const playerKeys = {
  list: (peladaId: string) => ["peladas", peladaId, "players"] as const,
};

export function usePlayers(peladaId: string) {
  return useQuery({
    queryKey: playerKeys.list(peladaId),
    queryFn: () => getPlayers(peladaId),
    select: (response) => response.data.players,
  });
}

function useInvalidatePlayers(peladaId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: playerKeys.list(peladaId) });
    queryClient.invalidateQueries({ queryKey: peladaKeys.detail(peladaId) });
  };
}

export function useCreatePlayer(peladaId: string) {
  const invalidate = useInvalidatePlayers(peladaId);

  return useMutation({
    mutationFn: (payload: PlayerPayload) => createPlayer(peladaId, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidate();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdatePlayer(peladaId: string) {
  const invalidate = useInvalidatePlayers(peladaId);

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
      invalidate();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeletePlayer(peladaId: string) {
  const invalidate = useInvalidatePlayers(peladaId);

  return useMutation({
    mutationFn: (playerId: string) => deletePlayer(peladaId, playerId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidate();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
