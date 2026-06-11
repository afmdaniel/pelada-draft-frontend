"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api/axios";
import { getPermissions, managePermission } from "@/lib/api/permissions";
import type { PermissionPayload } from "@/types/api";

export const permissionKeys = {
  list: (peladaId: string) => ["peladas", peladaId, "permissions"] as const,
};

export function usePermissions(peladaId: string) {
  return useQuery({
    queryKey: permissionKeys.list(peladaId),
    queryFn: () => getPermissions(peladaId),
    select: (response) => response.data,
    retry: false,
  });
}

export function useManagePermission(peladaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PermissionPayload) =>
      managePermission(peladaId, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: permissionKeys.list(peladaId) });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
