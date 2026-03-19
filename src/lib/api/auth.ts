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

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

const isAuthUser = (value: unknown): value is AuthUser => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string"
  );
};

const unwrapAuthData = <T>(payload: ApiEnvelope<T>) => payload.data ?? null;

const parseLoginResponse = (payload: UnknownRecord | null): LoginResponse | null => {
  if (!payload) {
    return null;
  }

  const token = payload.token;
  const user = payload.user;

  if (typeof token !== "string" || !isAuthUser(user)) {
    return null;
  }

  return { token, user };
};

export async function login(payload: AuthPayload) {
  const response = await apiClient.post<ApiEnvelope<UnknownRecord>>(
    "/auth/login",
    payload,
  );
  return parseLoginResponse(unwrapAuthData(response.data));
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
