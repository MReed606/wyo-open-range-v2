"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Brain,
  Activity,
  Flame,

} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";

import {
  MarketplaceAnnouncements
} from "@/components/home/MarketplaceAnnouncements";

import {
  MarketplaceStats
} from "@/components/dashboard/MarketplaceStats";

import {
  TrendingListings
} from "@/components/home/TrendingListings";

import {
  MarketplaceLiveFeed
} from "@/components/home/MarketplaceLiveFeed";

import {
  BrowseCategories
} from "@/components/home/BrowseCategories";

import {
  loadHomePageStats,
  getSellingDestination,
} from "@/lib/homePageService";

export default function HomePage() {

  const [liveStats,
    setLiveStats] =
    useState({

      activeUsers: 0,

      liveListings: 0,

      listingsToday: 0,

      activeMessages: 0,

      trendingVelocity: 0,

    });

 
  // =====================================
  // INITIALIZE
  // =====================================

 useEffect(() => {

  initialize();

  const cleanup =
    subscribeRealtime();

  return cleanup;

}, []);

  async function initialize() {

    await Promise.all([

      loadLiveStats(),

  
    ]);
  }

  // =====================================
  // REALTIME SUBSCRIPTIONS
  // =====================================

  function subscribeRealtime() {

    const listingsChannel =
      supabase.channel(
        "homepage-listings"
      );

    listingsChannel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "listings",
      },
      async (payload) => {

        
        await loadLiveStats();
      }
    );

    listingsChannel.subscribe();

    return () => {

      supabase.removeChannel(
        listingsChannel
      );

    };
  }

  // =====================================
  // LIVE STATS
  // =====================================

  async function loadLiveStats() {

  const stats =
    await loadHomePageStats();

  setLiveStats(
    stats
  );
}

  
  // =====================================
  // START SELLING
  // =====================================

  async function startSelling() {

  const destination =
    await getSellingDestination();

  window.location.href =
    destination;
}

  // =====================================
  // MARKETPLACE HEALTH
  // =====================================

  const marketplaceHealth =
    useMemo(() => {

      const score =
        (
          liveStats.liveListings * 0.3
        ) +
        (
          liveStats.activeMessages * 0.5
        ) +
        (
          liveStats.trendingVelocity * 2
        );

      if (score >= 250) {
        return "Extremely Active";
      }

      if (score >= 100) {
        return "Highly Active";
      }

      if (score >= 40) {
        return "Growing Fast";
      }

      return "Early Growth";
    }, [liveStats]);

  return (

    <main className="min-h-screen bg-[#F7F5F2]">

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-black/45" />

        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2400&auto=format&fit=crop"
          alt="Wyoming"
          className="h-[560px] md:h-[780px] w-full object-cover"
        />

        {/* OVERLAY */}

        <div className="absolute inset-0">

          <div className="mx-auto flex h-full max-w-7xl items-start px-6 pt-4 md:items-center md:px-10">

            <div className="w-full">

              {/* BADGES */}

              <div className="mb-6 hidden flex-wrap gap-3 md:flex">

                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur">

                  <Brain className="h-4 w-4" />

                  AI-Powered Marketplace

                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-5 py-3 text-sm font-black text-green-200 backdrop-blur">

                  <Activity className="h-4 w-4" />

                  {marketplaceHealth}

                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-5 py-3 text-sm font-black text-orange-200 backdrop-blur">

                  <Flame className="h-4 w-4" />

                  Live Marketplace Activity

                </div>

              </div>

              {/* TITLE */}

              <h1 className="max-w-5xl text-5xl md:text-7xl font-black leading-tight text-white">

                Buy, Sell, Trade,
                <br />
                and Connect Across Wyoming

              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-white/90 md:text-xl md:leading-9">

                Wyoming's intelligent regional marketplace for ranching,
                livestock, equipment, vehicles,
                land, services, and realtime community commerce.

              </p>

              {/* ACTIONS */}

              <div className="mt-10 flex flex-wrap gap-5">

                <Link
                  href="/listings"
                  border border-white/40 bg-white/10 backdrop-blur
                >

                  Explore Marketplace

                </Link>

                <button
                  onClick={startSelling}
                  className="rounded-2xl border border-white/40 bg-white/10 px-8 py-5 text-lg font-black text-white backdrop-blur transition hover:bg-white/20"
                >

                  Start Selling

                </button>

              </div>

              {/* LIVE STATS */}

              <div className="hidden md:grid mt-10 gap-4 md:grid-cols-2 xl:grid-cols-5">

                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

                  <div className="text-sm font-black uppercase tracking-wide text-white/60">

                    Active Users

                  </div>

                  <div className="mt-3 text-4xl font-black text-white">

                    {liveStats.activeUsers}

                  </div>

                </div>

                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

                  <div className="text-sm font-black uppercase tracking-wide text-white/60">

                    Marketplace Listings

                  </div>

                  <div className="mt-3 text-4xl font-black text-white">

                    {liveStats.liveListings}

                  </div>

                </div>

                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

                  <div className="text-sm font-black uppercase tracking-wide text-white/60">

                    New Today

                  </div>

                  <div className="mt-3 text-4xl font-black text-white">

                    {liveStats.listingsToday}

                  </div>

                </div>

                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

                  <div className="text-sm font-black uppercase tracking-wide text-white/60">

                    Active Messages

                  </div>

                  <div className="mt-3 text-4xl font-black text-white">

                    {liveStats.activeMessages}

                  </div>

                </div>

                <div className="hidden rounded-3xl bg-white/10 p-6 backdrop-blur md:block">

                  <div className="text-sm font-black uppercase tracking-wide text-white/60">

                    Trending Velocity

                  </div>

                  <div className="mt-3 text-4xl font-black text-white">

                    {liveStats.trendingVelocity}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="px-6 py-10 md:px-10 md:py-16">

        <div className="mx-auto max-w-7xl">

          {/* ANNOUNCEMENTS */}

          <MarketplaceAnnouncements />

          {/* STATS */}

          <MarketplaceStats />

{/* BROWSE CATEGORIES */}

<BrowseCategories />
          
          {/* AI DISCOVERY */}

          <section className="mt-24">

            <TrendingListings />

          </section>

          {/* LIVE MARKETPLACE FEED */}

          <section className="mt-24">

            <MarketplaceLiveFeed />

          </section>

        </div>

      </section>

    </main>

  );
}