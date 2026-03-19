"use client";

import React from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/layout/sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="flex">
      {user && <Sidebar />}
      <main
        className={`flex-1 min-w-0 ${
          user
            ? "sm:ml-20 pb-16 sm:pb-0"
            : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
