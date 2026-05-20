"use client";

import { MarketplaceAnnouncements } from "@/components/home/MarketplaceAnnouncements";

import { MarketplaceStats } from "@/components/dashboard/MarketplaceStats";

import { TrendingListings } from "@/components/home/TrendingListings";

import { MarketplaceLiveFeed } from "@/components/home/MarketplaceLiveFeed";

export default function HomePage() {

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-7xl">

        <MarketplaceAnnouncements />

        <MarketplaceStats />

        <TrendingListings />

        <MarketplaceLiveFeed />

      </div>

    </main>
  );
}
