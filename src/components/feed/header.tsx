"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

type FeedHeaderProps = {
  eyebrow?: string;
  title?: string;
  searchSlot?: ReactNode;
};

export function FeedHeader({
  eyebrow = "Ponterest Feed",
  title = "Ideas worth saving",
  searchSlot,
}: FeedHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(247,243,238,0.85)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-4 py-3 sm:grid-cols-[minmax(160px,1fr)_minmax(260px,620px)_minmax(160px,1fr)] sm:px-6 sm:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <div className="min-w-0">
            <p className="hidden sm:block font-mono text-xs uppercase tracking-[0.28em] text-[#7b6352]">
              {eyebrow}
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-[#22170f] sm:text-2xl">
              {title}
            </h1>
          </div>
        </div>

        {searchSlot ? (
          <div className="order-3 col-span-2 w-full sm:order-none sm:col-span-1 sm:col-start-2 sm:row-start-1">
            {searchSlot}
          </div>
        ) : null}

        <div className="flex shrink-0 items-center justify-end gap-2 sm:col-start-3 sm:row-start-1 sm:gap-4">
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
