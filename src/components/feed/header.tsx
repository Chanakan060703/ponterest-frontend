"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

type HeaderProps = {
  totalItems: number;
};

export function FeedHeader({ totalItems }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(247,243,238,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#7b6352]">
              Ponterest Feed
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-[#22170f] sm:text-2xl">
              Ideas worth saving
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#5d4a3e] hidden sm:inline">
                Hi, {user.name || user.email.split("@")[0]}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold text-[#5d4a3e] hover:bg-black/5 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-[#fb923c] text-white text-sm font-bold hover:bg-[#f97316] transition-colors shadow-sm"
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
