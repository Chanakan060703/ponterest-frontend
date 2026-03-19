"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, logout as logoutApi } from "@/lib/api/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STATE_EVENT = "auth-state-change";
let cachedUserJson: string | null | undefined;
let cachedUser: AuthUser | null = null;

const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("auth_token");

  if (!storedUser || !token) {
    cachedUserJson = null;
    cachedUser = null;
    return null;
  }

  if (storedUser === cachedUserJson) {
    return cachedUser;
  }

  try {
    cachedUser = JSON.parse(storedUser) as AuthUser;
    cachedUserJson = storedUser;
    return cachedUser;
  } catch {
    localStorage.removeItem("user");
    cachedUserJson = null;
    cachedUser = null;
    return null;
  }
};

const subscribeToAuthState = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_STATE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_STATE_EVENT, callback);
  };
};

const emitAuthStateChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_STATE_EVENT));
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useSyncExternalStore(
    subscribeToAuthState,
    getStoredUser,
    () => null,
  );

  const login = (token: string, user: AuthUser) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    emitAuthStateChange();
    router.push("/");
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Clear client auth state even if the server cookie is already gone.
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      emitAuthStateChange();
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
