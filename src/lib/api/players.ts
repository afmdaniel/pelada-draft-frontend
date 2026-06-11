import { api } from "@/lib/api/axios";
import type { ApiResponse, Player, PlayerPayload } from "@/types/api";

export async function getPlayers(peladaId: string) {
  const { data } = await api.get<ApiResponse<Player[]>>(
    `/peladas/${peladaId}/players`
  );
  return data;
}

export async function createPlayer(peladaId: string, payload: PlayerPayload) {
  const { data } = await api.post<ApiResponse<Player>>(
    `/peladas/${peladaId}/players`,
    payload
  );
  return data;
}

export async function updatePlayer(
  peladaId: string,
  playerId: string,
  payload: PlayerPayload
) {
  const { data } = await api.put<ApiResponse<Player>>(
    `/peladas/${peladaId}/players/${playerId}`,
    payload
  );
  return data;
}

export async function deletePlayer(peladaId: string, playerId: string) {
  const { data } = await api.delete<ApiResponse>(
    `/peladas/${peladaId}/players/${playerId}`
  );
  return data;
}
