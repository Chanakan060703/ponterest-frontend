"use client";

import React from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/layout/sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="flex">
      {user && <Sidebar />}
      <main className={`flex-1 ${user ? "ml-20" : ""}`}>
        {children}
      </main>
    </div>
  );
}
