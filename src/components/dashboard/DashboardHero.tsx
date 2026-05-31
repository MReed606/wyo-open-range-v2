import Link from "next/link";

import {
  Brain,
} from "lucide-react";

type DashboardHeroProps = {
  fullName?: string | null;
};

export function DashboardHero({
  fullName,
}: DashboardHeroProps) {

  return (

    <div className="mb-10 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#2F5D50] to-[#1F2933] p-10 text-white shadow-xl">

      <div className="flex flex-wrap items-center justify-between gap-8">

        <div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black backdrop-blur">

            <Brain className="h-4 w-4" />

            AI Marketplace Intelligence

          </div>

          <h1 className="text-5xl font-black">

            Welcome back,
            {" "}
            {fullName ?? "Seller"}

          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">

            Track marketplace performance, seller growth,
            engagement metrics, and AI recommendation visibility.

          </p>

        </div>

        <div className="flex flex-wrap gap-4">

          <Link
            href="/post"
            className="rounded-2xl bg-white px-6 py-4 text-lg font-black text-[#111827]"
          >

            Create Listing

          </Link>

          <Link
            href="/dashboard/listings"
            className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-lg font-black text-white backdrop-blur"
          >

            Manage Listings

          </Link>

        </div>

      </div>

    </div>

  );
}