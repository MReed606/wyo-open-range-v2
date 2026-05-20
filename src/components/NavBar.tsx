import Link from "next/link";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { NotificationBell } from "@/components/NotificationBell";
import { AdminVerificationLink } from "@/components/AdminVerificationLink";
import { AdminNavLink } from "@/components/AdminNavLink";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#1F2933]">
          Wyo Open Range
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/listings" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Browse</Link>
          <Link href="/regions" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Regions</Link>
          <Link href="/forums" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Forums</Link>
          <Link href="/businesses" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Businesses</Link>
          <Link href="/dashboard" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">Dashboard</Link>

          <AdminNavLink />

          <Link href="/admin/verification-disabled" className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]">
          </Link>

        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          
          <Link
            href="/messages"
            className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]"
          >
            Messages
          </Link>


<AdminVerificationLink />
          <NotificationBell />

          <AuthStatus />

          <Link
            href="/post"
            className="rounded-xl bg-[#2F5D50] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#24493f] sm:px-4"
          >
            Post Listing
          </Link>
        </div>
      </div>
    </nav>
  );
}