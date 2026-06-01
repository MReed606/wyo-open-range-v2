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

import {
  DashboardMetricCard
} from "@/components/dashboard/DashboardMetricCard";

import {
  DashboardHero
} from "@/components/dashboard/DashboardHero";

import {
  ProfileCompletionGuard
} from "@/components/auth/ProfileCompletionGuard";

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

  

  return (

    <>
  <AuthGuard />
  <ProfileCompletionGuard />

  <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-7xl">

          {/* HERO */}

          <DashboardHero
  fullName={
    profile?.full_name
  }
/>

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

                  {profile?.verification_submitted &&
 !profile?.verified && (

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

            <DashboardMetricCard
              title="Total Listings"
              value={stats.listings}
              icon={
                <Sparkles className="h-8 w-8 text-white" />
              }
              color="bg-[#2F5D50]"
            />

            <DashboardMetricCard
              title="Marketplace Views"
              value={stats.totalViews}
              icon={
                <Eye className="h-8 w-8 text-white" />
              }
              color="bg-blue-600"
            />

            <DashboardMetricCard
              title="Saved By Buyers"
              value={stats.totalFavorites}
              icon={
                <Heart className="h-8 w-8 text-white" />
              }
              color="bg-red-500"
            />

            <DashboardMetricCard
              title="Conversation Activity"
              value={stats.totalMessages}
              icon={
                <MessageCircle className="h-8 w-8 text-white" />
              }
              color="bg-yellow-500"
            />

            <DashboardMetricCard
              title="AI Recommendation Score"
              value={`${stats.recommendationScore}%`}
              icon={
                <Brain className="h-8 w-8 text-white" />
              }
              color="bg-purple-600"
            />

            <DashboardMetricCard
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