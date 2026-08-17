import { api } from "@/lib/api/axios";
import type {
  ApiResponse,
  ChangePasswordPayload,
  CurrentUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/api";

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<ApiResponse>("/auth/register", payload);
  return data;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<ApiResponse>("/auth/login", payload);
  return data;
}

export async function refresh() {
  const { data } = await api.post<ApiResponse>("/auth/refresh");
  return data;
}

export async function getMe() {
  const { data } = await api.get<ApiResponse<{ user: CurrentUser }>>("/auth/me");
  return data;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await api.patch<ApiResponse>("/auth/change-password", payload);
  return data;
}

export async function logout() {
  const { data } = await api.post<ApiResponse>("/auth/logout");
  return data;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const { data } = await api.post<ApiResponse>("/auth/forgot-password", payload);
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await api.post<ApiResponse>("/auth/reset-password", payload);
  return data;
}
