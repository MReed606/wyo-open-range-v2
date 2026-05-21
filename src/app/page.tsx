"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { MarketplaceAnnouncements } from "@/components/home/MarketplaceAnnouncements";
import { MarketplaceStats } from "@/components/dashboard/MarketplaceStats";
import { TrendingListings } from "@/components/home/TrendingListings";
import { MarketplaceLiveFeed } from "@/components/home/MarketplaceLiveFeed";

export default function HomePage() {

  async function startSelling() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {

      window.location.href =
        "/post";

      return;
    }

    window.location.href =
      "/login";
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2]">

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-black/40" />

        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2400&auto=format&fit=crop"
          alt="Wyoming"
          className="h-[700px] w-full object-cover"
        />

        <div className="absolute inset-0 flex items-center px-6 md:px-10">

          <div className="mx-auto w-full max-w-7xl">

            <h1 className="max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
              Buy, Sell, Trade,
              <br />
              and Connect Across Wyoming
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-white/90">
              Wyoming's modern marketplace for ranching,
              livestock, equipment, vehicles,
              land, services, and community discussion.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/listings"
                className="rounded-2xl bg-[#2F5D50] px-8 py-5 text-lg font-black text-white transition hover:bg-[#24473d]"
              >
                Browse Marketplace
              </Link>

              <button
                onClick={startSelling}
                className="rounded-2xl border border-white/40 bg-white/10 px-8 py-5 text-lg font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                Start Selling
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="px-6 py-16 md:px-10">

        <div className="mx-auto max-w-7xl">

          <MarketplaceAnnouncements />

          <MarketplaceStats />

          <section className="mt-20">

            <TrendingListings />

          </section>

          <section className="mt-20">

            <MarketplaceLiveFeed />

          </section>

        </div>

      </section>

    </main>
  );
}