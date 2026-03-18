import { apiClient } from "@/lib/api/axios";
import { ApiEnvelope, UnknownRecord } from "@/lib/types";

type AuthPayload = {
  email: string;
  password: string;
};

type RegisterPayload = AuthPayload & {
  name: string;
  phone: string;
};

const unwrapAuthData = <T>(payload: ApiEnvelope<T>) => payload.data ?? null;

export async function login(payload: AuthPayload) {
  const response = await apiClient.post<ApiEnvelope<UnknownRecord>>(
    "/auth/login",
    payload,
  );
  return unwrapAuthData(response.data);
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<ApiEnvelope<UnknownRecord>>(
    "/auth/register",
    payload,
  );
  return unwrapAuthData(response.data);
}

export async function logout() {
  const response = await apiClient.post<ApiEnvelope<UnknownRecord>>("/auth/logout");
  return unwrapAuthData(response.data);
}
