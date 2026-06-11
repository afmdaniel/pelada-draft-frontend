"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api/axios";
import { drawTeams } from "@/lib/api/draw";
import type { DrawPayload } from "@/types/api";

export function useDrawTeams(peladaId: string) {
  return useMutation({
    mutationFn: (payload: DrawPayload) => drawTeams(peladaId, payload),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
