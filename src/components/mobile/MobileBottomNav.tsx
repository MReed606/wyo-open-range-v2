"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {

  const pathname =
    usePathname();

  const nav = [
    {
      href: "/listings",
      label: "Browse",
    },
    {
      href: "/saved",
      label: "Saved",
    },
    {
      href: "/messages",
      label: "Messages",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white md:hidden">

      <div className="grid grid-cols-4">

        {nav.map((item) => (

          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-4 text-sm font-black ${
              pathname === item.href
                ? "text-[#2F5D50]"
                : "text-gray-500"
            }`}
          >
            {item.label}
          </Link>

        ))}

      </div>

    </div>
  );
}
