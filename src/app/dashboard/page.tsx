"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  Sparkles,
  Eye,
  MessageCircle,
  Heart,
  TrendingUp,
  Brain,
  Star,
  Activity,
} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";

import {
  SellerAnalytics
} from "@/components/dashboard/SellerAnalytics";

import {
  AuthGuard
} from "@/components/auth/AuthGuard";

import {
  loadDashboardAnalytics
} from "@/lib/dashboardAnalytics";

export default function DashboardPage() {

  const [profile,
    setProfile] =
    useState<any>(null);

  const [stats,
    setStats] =
    useState({

      listings: 0,

      totalViews: 0,

      totalFavorites: 0,

      totalMessages: 0,

      recommendationScore: 0,

      averageTrending: 0,

    });

  const [topListings,
    setTopListings] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // =====================================
  // INITIALIZE
  // =====================================

  useEffect(() => {

    initialize();

  }, []);

  async function initialize() {

    setLoading(true);

    await Promise.all([

      loadProfile(),

      loadAnalytics(),

    ]);

    setLoading(false);
  }

  // =====================================
  // PROFILE
  // =====================================

  async function loadProfile() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          user.id
        )
        .maybeSingle();

    setProfile(data);
  }

  // =====================================
  // ANALYTICS
  // =====================================

  async function loadAnalytics() {
  const result =
    await loadDashboardAnalytics();

  if (!result) {
    return;
  }

  setTopListings(
    result.topListings
  );

  setStats(
    result.stats
  );
}

  // =====================================
  // METRIC CARD
  // =====================================

  function MetricCard({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }) {

    return (

      <div className="rounded-3xl bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <div className="text-sm font-bold text-[#6B7280]">

              {title}

            </div>

            <div className="mt-3 text-4xl font-black text-[#111827]">

              {value}

            </div>

          </div>

          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}>

            {icon}

          </div>

        </div>

      </div>

    );

  }

  return (

    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-7xl">

          {/* HERO */}

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
                  {profile?.full_name ??
                    "Seller"}

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

          {/* PROFILE */}

          <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-6">

              <div>

                <h2 className="text-4xl font-black text-[#111827]">

                  Account Overview

                </h2>

                <div className="mt-5 space-y-2 text-[#374151]">

                  <p>
                    {profile?.email}
                  </p>

                  <p>
                    {profile?.phone}
                  </p>

                </div>

                <div className="mt-5 flex flex-wrap gap-3">

                  {profile?.verified && (

                    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">

                      Verified Seller

                    </div>

                  )}

                  {profile
                    ?.verification_submitted && (

                    <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">

                      Verification Pending

                    </div>

                  )}

                </div>

              </div>

              <div className="flex flex-wrap gap-4">

                <Link
                  href="/settings"
                  className="rounded-2xl border border-[#2F5D50] px-6 py-4 text-lg font-bold text-[#2F5D50]"
                >

                  Account Settings

                </Link>

                <Link
                  href="/saved"
                  className="rounded-2xl border border-[#2F5D50] px-6 py-4 text-lg font-bold text-[#2F5D50]"
                >

                  Saved Listings

                </Link>

              </div>

            </div>

          </div>

          {/* METRICS */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            <MetricCard
              title="Total Listings"
              value={stats.listings}
              icon={
                <Sparkles className="h-8 w-8 text-white" />
              }
              color="bg-[#2F5D50]"
            />

            <MetricCard
              title="Marketplace Views"
              value={stats.totalViews}
              icon={
                <Eye className="h-8 w-8 text-white" />
              }
              color="bg-blue-600"
            />

            <MetricCard
              title="Saved By Buyers"
              value={stats.totalFavorites}
              icon={
                <Heart className="h-8 w-8 text-white" />
              }
              color="bg-red-500"
            />

            <MetricCard
              title="Conversation Activity"
              value={stats.totalMessages}
              icon={
                <MessageCircle className="h-8 w-8 text-white" />
              }
              color="bg-yellow-500"
            />

            <MetricCard
              title="AI Recommendation Score"
              value={`${stats.recommendationScore}%`}
              icon={
                <Brain className="h-8 w-8 text-white" />
              }
              color="bg-purple-600"
            />

            <MetricCard
              title="Average Trending Score"
              value={stats.averageTrending}
              icon={
                <TrendingUp className="h-8 w-8 text-white" />
              }
              color="bg-green-600"
            />

          </div>

          {/* TOP LISTINGS */}

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center gap-3">

              <Activity className="h-7 w-7 text-[#2F5D50]" />

              <h2 className="text-3xl font-black text-[#111827]">

                Top Performing Listings

              </h2>

            </div>

            {!topListings.length && (

              <div className="rounded-2xl bg-[#F7F5F2] p-8 text-center text-[#6B7280]">

                No listing analytics available yet.

              </div>

            )}

            <div className="space-y-5">

              {topListings.map((listing) => (

                <div
                  key={listing.id}
                  className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-[#F7F5F2] p-6"
                >

                  <div>

                    <h3 className="text-2xl font-black text-[#111827]">

                      {listing.title}

                    </h3>

                    <div className="mt-3 flex flex-wrap gap-3">

                      <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">

                        👁
                        {" "}
                        {listing.views ?? 0}
                        {" "}
                        views

                      </div>

                      <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">

                        🔥
                        {" "}
                        {listing.trending_score ?? 0}
                        {" "}
                        trending

                      </div>

                    </div>

                  </div>

                  <Link
                    href={`/listing/${listing.slug}`}
                    className="rounded-2xl bg-[#2F5D50] px-5 py-3 font-black text-white"
                  >

                    View Listing

                  </Link>

                </div>

              ))}

            </div>

          </div>

          {/* ANALYTICS */}

          <div className="mt-10">

            <SellerAnalytics />

          </div>

        </div>

      </main>

    </>
  );
}