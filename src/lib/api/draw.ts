import { api } from "@/lib/api/axios";
import type { ApiResponse, DrawPayload, DrawResult } from "@/types/api";

export async function drawTeams(peladaId: string, payload: DrawPayload) {
  const { data } = await api.post<ApiResponse<DrawResult>>(
    `/peladas/${peladaId}/draw`,
    payload
  );
  return data;
}
