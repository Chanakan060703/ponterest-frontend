import axios from "axios";

const API_ENV = process.env.NEXT_PUBLIC_API_ENV ?? "local";

const API_BASE_URLS = {
  local: process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL ?? "http://localhost:5001",
  dev:
    process.env.NEXT_PUBLIC_API_BASE_URL_DEV ??
    "https://ponterest-dev-api.onrender.com",
} as const;

const API_BASE_URL =
  API_ENV === "dev" ? API_BASE_URLS.dev : API_BASE_URLS.local;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
