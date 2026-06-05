"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  MessageCircle,
  LayoutGrid,
  Shield,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { isAdmin as checkAdmin }
from "@/lib/admin";

export function MobileBottomNav() {

  const pathname =
    usePathname();

  const [isAdmin,
    setIsAdmin] =
    useState(false);

  useEffect(() => {

    async function loadAdmin() {

      const admin =
        await checkAdmin();

      setIsAdmin(admin);
    }

    loadAdmin();

  }, []);

  const nav = [
    {
      href: "/listings",
      label: "Browse",
      icon: LayoutGrid,
    },
    {
      href: "/saved",
      label: "Saved",
      icon: Bookmark,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageCircle,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutGrid,
    },
    ...(isAdmin
      ? [{
          href: "/admin",
          label: "Admin",
          icon: Shield,
        }]
      : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur md:hidden">

      <div
        className={`grid px-2 ${
          isAdmin
            ? "grid-cols-5"
            : "grid-cols-4"
        }`}
      >

        {nav.map((item) => (

          <Link
            key={item.href}
            href={item.href}
            className={`flex h-18 flex-col items-center justify-center gap-1.5 text-[11px] font-black ${
              pathname === item.href
                ? "text-[#2F5D50]"
                : "text-gray-500"
            }`}
          >
            <item.icon className="h-5 w-5" />

            <span>
              {item.label}
            </span>

          </Link>

        ))}

      </div>

    </div>
  );
}