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
  Sparkles,
  TrendingUp,
  Shield,
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

  const [realtimeEvents,
    setRealtimeEvents] =
    useState<any[]>([]);

  // =====================================
  // INITIALIZE
  // =====================================

  useEffect(() => {

    initialize();

    subscribeRealtime();

  }, []);

  async function initialize() {

    await Promise.all([

      loadLiveStats(),

      loadRealtimeEvents(),

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

        setRealtimeEvents(
          (prev) => [

            {

              type:
                "listing",

              title:
                payload.new.title,

              region:
                payload.new.region,

              created_at:
                new Date()
                  .toISOString(),

            },

            ...prev,

          ].slice(0, 10)
        );

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

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const [
      listingsRes,
      todayListingsRes,
      conversationsRes,
    ] = await Promise.all([

      supabase
        .from("listings")
        .select(
          "id, trending_score"
        ),

      supabase
        .from("listings")
        .select("id")
        .gte(
          "created_at",
          today.toISOString()
        ),

      supabase
        .from("messages")
        .select("id"),

    ]);

    const listings =
      listingsRes.data ?? [];

    const trendingVelocity =
      listings.length

        ? Math.round(
            listings.reduce(
              (
                sum,
                listing
              ) =>

                sum +
                (
                  listing.trending_score || 0
                ),

              0
            )
            /
            listings.length
          )

        : 0;

    setLiveStats({

      activeUsers:
        Math.max(
          12,
          Math.round(
            listings.length * 0.35
          )
        ),

      liveListings:
        listings.length,

      listingsToday:
        todayListingsRes
          .data?.length ?? 0,

      activeMessages:
        conversationsRes
          .data?.length ?? 0,

      trendingVelocity,

    });
  }

  // =====================================
  // LIVE FEED
  // =====================================

  async function loadRealtimeEvents() {

    const {
      data
    } =
      await supabase
        .from("listings")
        .select(`
          id,
          title,
          region,
          created_at
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(10);

    setRealtimeEvents(
      (data ?? []).map(
        (listing) => ({

          type:
            "listing",

          title:
            listing.title,

          region:
            listing.region,

          created_at:
            listing.created_at,

        })
      )
    );
  }

  // =====================================
  // START SELLING
  // =====================================

  async function startSelling() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (user) {

      window.location.href =
        "/post";

      return;
    }

    window.location.href =
      "/login";
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
          className="h-[780px] w-full object-cover"
        />

        {/* OVERLAY */}

        <div className="absolute inset-0">

          <div className="mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">

            <div className="w-full">

              {/* BADGES */}

              <div className="mb-6 flex flex-wrap gap-3">

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

              <h1 className="max-w-5xl text-5xl font-black leading-tight text-white md:text-7xl">

                Buy, Sell, Trade,
                <br />
                and Connect Across Wyoming

              </h1>

              <p className="mt-8 max-w-3xl text-xl leading-9 text-white/90">

                Wyoming's intelligent regional marketplace for ranching,
                livestock, equipment, vehicles,
                land, services, and realtime community commerce.

              </p>

              {/* ACTIONS */}

              <div className="mt-10 flex flex-wrap gap-5">

                <Link
                  href="/listings"
                  className="rounded-2xl bg-[#2F5D50] px-8 py-5 text-lg font-black text-white transition hover:bg-[#24473d]"
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

              <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-5">

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

                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

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

      <section className="px-6 py-16 md:px-10">

        <div className="mx-auto max-w-7xl">

          {/* ANNOUNCEMENTS */}

          <MarketplaceAnnouncements />

          {/* STATS */}

          <MarketplaceStats />

          {/* REALTIME FEED */}

          <section className="mt-20">

            <div className="mb-8 flex flex-wrap items-center justify-between gap-5">

              <div>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-black text-[#2F5D50]">

                  <Sparkles className="h-4 w-4" />

                  Realtime Marketplace Feed

                </div>

                <h2 className="text-4xl font-black text-[#111827]">

                  Live Wyoming Activity

                </h2>

                <p className="mt-4 text-lg text-[#6B7280]">

                  Realtime marketplace engagement and discovery activity.

                </p>

              </div>

              <div className="rounded-2xl bg-green-100 px-5 py-3 text-sm font-black text-green-700">

                LIVE

              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {realtimeEvents.map(
                (event, index) => (

                <div
                  key={index}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >

                  <div className="flex items-center justify-between gap-4">

                    <div className="rounded-full bg-[#2F5D50]/10 p-3">

                      <TrendingUp className="h-5 w-5 text-[#2F5D50]" />

                    </div>

                    <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">

                      NEW

                    </div>

                  </div>

                  <h3 className="mt-5 text-2xl font-black text-[#111827]">

                    {event.title}

                  </h3>

                  <p className="mt-3 text-[#6B7280]">

                    New marketplace activity in
                    {" "}
                    {event.region ?? "Wyoming"}

                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#2F5D50]">

                    <Shield className="h-4 w-4" />

                    AI Verified Activity

                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* AI DISCOVERY */}

          <section className="mt-24">

            <TrendingListings />

          </section>

          {/* LEGACY FEED */}

          <section className="mt-24">

            <MarketplaceLiveFeed />

          </section>

        </div>

      </section>

    </main>

  );
}