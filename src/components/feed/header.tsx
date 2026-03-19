"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export function FeedHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(247,243,238,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 min-w-0">
          <div className="min-w-0">
            <p className="hidden sm:block font-mono text-xs uppercase tracking-[0.28em] text-[#7b6352]">
              Ponterest Feed
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-[#22170f] sm:text-2xl">
              Ideas worth saving
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-sm font-medium text-[#5d4a3e]">
                Hi, {user.name || user.email.split("@")[0]}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-rose-50 text-rose-600 text-xs sm:text-sm font-bold hover:bg-rose-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-[#5d4a3e] hover:bg-black/5 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#fb923c] text-white text-xs sm:text-sm font-bold hover:bg-[#f97316] transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
