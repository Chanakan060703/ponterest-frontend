"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Plus,
  Bell,
  MessageCircle,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { CreateImageModal } from "@/components/feed/create-image-modal";

export function Sidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: Home, href: "/", label: "Home" },
    { icon: LayoutGrid, href: "/explore", label: "Explore" },
  ];

  const actionItems = [
    { icon: Bell, label: "Notifications" },
    { icon: MessageCircle, label: "Messages" },
  ];

  const allBottomItems = [...navItems, null, ...actionItems];
  return (
    <>
      <nav className="fixed left-0 top-0 z-40 hidden sm:flex h-screen w-20 flex-col items-center border-r border-black/5 bg-white py-8">
        <Link
          href="/"
          className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fb923c] text-white shadow-[0_14px_40px_rgba(251,146,60,0.28)] hover:scale-105 transition-transform"
        >
          <span className="text-2xl font-bold">P</span>
        </Link>

        <div className="flex flex-1 flex-col gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all hover:bg-black/5 ${
                  isActive ? "bg-black/5 text-black" : "text-[#767676]"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="absolute left-full ml-4 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-[#767676] transition-all hover:bg-black/5"
          >
            <Plus size={24} />
            <span className="absolute left-full ml-4 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              Create
            </span>
          </button>

          <div className="my-2 h-[1px] w-8 bg-black/5" />

          {actionItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-[#767676] transition-all hover:bg-black/5"
              >
                <Icon size={24} />
                <span className="absolute left-full ml-4 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <button className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-[#767676] transition-all hover:bg-black/5">
          <Settings size={24} />
          <span className="absolute left-full ml-4 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            Settings
          </span>
        </button>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex sm:hidden h-16 items-center justify-around border-t border-black/5 bg-white/90 backdrop-blur-xl px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? "text-[#fb923c]" : "text-[#767676]"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fb923c] text-white shadow-[0_8px_24px_rgba(251,146,60,0.35)] active:scale-95 transition-transform"
        >
          <Plus size={22} />
        </button>

        {actionItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[#767676] transition-all"
            >
              <Icon size={22} strokeWidth={2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <CreateImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
