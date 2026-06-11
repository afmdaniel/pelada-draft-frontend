import { api } from "@/lib/api/axios";
import type {
  ApiResponse,
  PeladaDetails,
  PeladaPayload,
  PeladaSummary,
} from "@/types/api";

export async function getPeladas() {
  const { data } = await api.get<ApiResponse<PeladaSummary[]>>("/peladas");
  return data;
}

export async function getPelada(peladaId: string) {
  const { data } = await api.get<ApiResponse<PeladaDetails>>(`/peladas/${peladaId}`);
  return data;
}

export async function createPelada(payload: PeladaPayload) {
  const { data } = await api.post<ApiResponse<PeladaSummary>>("/peladas", payload);
  return data;
}

export async function updatePelada(peladaId: string, payload: PeladaPayload) {
  const { data } = await api.put<ApiResponse<PeladaSummary>>(
    `/peladas/${peladaId}`,
    payload
  );
  return data;
}

export async function deletePelada(peladaId: string) {
  const { data } = await api.delete<ApiResponse>(`/peladas/${peladaId}`);
  return data;
}
