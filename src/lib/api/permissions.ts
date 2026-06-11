import { api } from "@/lib/api/axios";
import type { ApiResponse, PermissionPayload, PermissionUser } from "@/types/api";

export async function getPermissions(peladaId: string) {
  const { data } = await api.get<ApiResponse<PermissionUser[]>>(
    `/peladas/${peladaId}/permission`
  );
  return data;
}

export async function managePermission(
  peladaId: string,
  payload: PermissionPayload
) {
  const { data } = await api.post<ApiResponse>(
    `/peladas/${peladaId}/permission`,
    payload
  );
  return data;
}
