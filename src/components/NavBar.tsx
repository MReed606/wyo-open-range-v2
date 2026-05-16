import Link from "next/link";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { NotificationBell } from "@/components/NotificationBell";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#1F2933]">
          Wyo Open Range
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/listings" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Browse</Link>
          <Link href="/regions" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Regions</Link>
          <Link href="/forums" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Forums</Link>
          <Link href="/businesses" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Businesses</Link>
          <Link href="/dashboard" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Dashboard</Link>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <AuthStatus />

          <Link
            href="/post"
            className="rounded-xl bg-[#2F5D50] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24493f]"
          >
            Post Listing
          </Link>
        </div>
      </div>
    </nav>
  );
}
