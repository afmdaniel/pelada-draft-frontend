import { api } from "@/lib/api/axios";
import type { ApiResponse, DrawPayload, DrawTeam } from "@/types/api";

export async function drawTeams(peladaId: string, payload: DrawPayload) {
  const { data } = await api.post<ApiResponse<{ draw: DrawTeam[] }>>(
    `/peladas/${peladaId}/draw`,
    payload
  );
  return data;
}
