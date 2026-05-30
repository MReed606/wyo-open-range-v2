"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  Shield,
  AlertTriangle,
  Users,
  FileWarning,
  Activity,
  Brain,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Eye,
} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";

import {
  AuthGuard
} from "@/components/auth/AuthGuard";

import {
  loadAdminStats
} from "@/lib/adminStats";

import {
  loadFlaggedListings as loadFlaggedListingsData,
  loadAdminAlerts,
} from "@/lib/adminAlerts";

export default function AdminPage() {

  const [stats,
    setStats] =
    useState({

      totalUsers: 0,

      totalListings: 0,

      flaggedListings: 0,

      flaggedUsers: 0,

      removedListings: 0,

      pendingVerifications: 0,

      reports: 0,

      activeConversations: 0,

    });

  const [flaggedListings,
    setFlaggedListings] =
    useState<any[]>([]);

  const [alerts,
    setAlerts] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // =====================================
  // INITIALIZE
  // =====================================

  useEffect(() => {

    initialize();

    subscribeRealtime();

  }, []);

  async function initialize() {

    setLoading(true);

    await Promise.all([

      loadStats(),

      loadFlaggedListings(),

      loadAlerts(),

    ]);

    setLoading(false);
  }

  // =====================================
  // REALTIME
  // =====================================

  function subscribeRealtime() {

    const channel =
      supabase.channel(
        "admin-realtime"
      );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "admin_alerts",
      },
      async () => {

        await loadAlerts();

      }
    );

    channel.subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );

    };
  }

  // =====================================
  // LOAD STATS
  // =====================================

  async function loadStats() {
  const stats =
    await loadAdminStats();

  setStats(stats);
}

  // =====================================
  // FLAGGED LISTINGS
  // =====================================

  async function loadFlaggedListings() {
  const data =
    await loadFlaggedListingsData();

  setFlaggedListings(data);
}

  // =====================================
  // ALERTS
  // =====================================

  async function loadAlerts() {
  const data =
    await loadAdminAlerts();

  setAlerts(data);
}

  // =====================================
  // REMOVE LISTING
  // =====================================

  async function removeListing(
    id: string
  ) {

    const confirmed =
      confirm(
        "Remove listing?"
      );

    if (!confirmed) {
      return;
    }

    await supabase
      .from("listings")
      .update({

        status:
          "removed",

      })
      .eq(
        "id",
        id
      );

    await initialize();
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

          <div className="mb-10 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#111827] to-[#1F2937] p-10 text-white shadow-xl">

            <div className="flex flex-wrap items-center justify-between gap-8">

              <div>

                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black backdrop-blur">

                  <Brain className="h-4 w-4" />

                  AI Marketplace Moderation

                </div>

                <h1 className="text-5xl font-black">

                  Admin Command Center

                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">

                  Marketplace intelligence, trust enforcement,
                  moderation analytics, safety systems,
                  and realtime platform oversight.

                </p>

              </div>

              <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                <div className="text-sm font-black uppercase tracking-wide text-white/60">

                  Marketplace Health

                </div>

                <div className="mt-3 text-5xl font-black">

                  96%

                </div>

                <div className="mt-3 flex items-center gap-2 text-green-300">

                  <TrendingUp className="h-5 w-5" />

                  Stable & Protected

                </div>

              </div>

            </div>

          </div>

          {/* METRICS */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              title="Marketplace Users"
              value={stats.totalUsers}
              icon={
                <Users className="h-8 w-8 text-white" />
              }
              color="bg-blue-600"
            />

            <MetricCard
              title="Total Listings"
              value={stats.totalListings}
              icon={
                <Sparkles className="h-8 w-8 text-white" />
              }
              color="bg-[#2F5D50]"
            />

            <MetricCard
              title="Flagged Listings"
              value={stats.flaggedListings}
              icon={
                <AlertTriangle className="h-8 w-8 text-white" />
              }
              color="bg-red-500"
            />

            <MetricCard
              title="Pending Verifications"
              value={stats.pendingVerifications}
              icon={
                <Shield className="h-8 w-8 text-white" />
              }
              color="bg-yellow-500"
            />

            <MetricCard
              title="Marketplace Reports"
              value={stats.reports}
              icon={
                <FileWarning className="h-8 w-8 text-white" />
              }
              color="bg-purple-600"
            />

            <MetricCard
              title="Removed Listings"
              value={stats.removedListings}
              icon={
                <Eye className="h-8 w-8 text-white" />
              }
              color="bg-gray-700"
            />

            <MetricCard
              title="Realtime Conversations"
              value={stats.activeConversations}
              icon={
                <MessageCircle className="h-8 w-8 text-white" />
              }
              color="bg-green-600"
            />

            <MetricCard
              title="AI Safety Status"
              value="ACTIVE"
              icon={
                <Activity className="h-8 w-8 text-white" />
              }
              color="bg-[#111827]"
            />

          </div>

          {/* QUICK LINKS */}

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <Link
              href="/admin/reports"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <h2 className="text-2xl font-black text-[#111827]">

                Reports

              </h2>

              <p className="mt-3 text-[#374151]">

                Review marketplace reports and trust violations.

              </p>

            </Link>

            <Link
              href="/admin/listings"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <h2 className="text-2xl font-black text-[#111827]">

                Listings

              </h2>

              <p className="mt-3 text-[#374151]">

                Manage marketplace listings and moderation.

              </p>

            </Link>

            <Link
              href="/admin/users"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <h2 className="text-2xl font-black text-[#111827]">

                Users

              </h2>

              <p className="mt-3 text-[#374151]">

                Review user trust, accounts, and verification.

              </p>

            </Link>

            <Link
              href="/admin/verification"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <h2 className="text-2xl font-black text-[#111827]">

                Verification Queue

              </h2>

              <p className="mt-3 text-[#374151]">

                Review seller identity verification requests.

              </p>

            </Link>

          </div>

          {/* FLAGGED LISTINGS */}

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center gap-3">

              <AlertTriangle className="h-7 w-7 text-red-500" />

              <h2 className="text-3xl font-black text-[#111827]">

                High Risk Listings

              </h2>

            </div>

            {!flaggedListings.length && (

              <div className="rounded-2xl bg-[#F7F5F2] p-8 text-center text-[#6B7280]">

                No high-risk listings detected.

              </div>

            )}

            <div className="space-y-5">

              {flaggedListings.map((listing) => (

                <div
                  key={listing.id}
                  className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-red-50 p-6"
                >

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-2xl font-black text-[#111827]">

                        {listing.title}

                      </h3>

                      <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">

                        Risk:
                        {" "}
                        {listing.moderation_score ?? 0}

                      </div>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">

                      {(listing.moderation_flags ?? [])
                        .map(
                          (
                            flag: string,
                            i: number
                          ) => (

                          <div
                            key={i}
                            className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-black text-yellow-700"
                          >

                            {flag}

                          </div>

                      ))}

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-4">

                    <Link
                      href={`/listing/${listing.slug}`}
                      className="rounded-2xl bg-[#111827] px-5 py-3 font-black text-white"
                    >

                      View

                    </Link>

                    <button
                      onClick={() =>
                        removeListing(
                          listing.id
                        )
                      }
                      className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white"
                    >

                      Remove

                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* ALERTS */}

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center gap-3">

              <Activity className="h-7 w-7 text-[#2F5D50]" />

              <h2 className="text-3xl font-black text-[#111827]">

                Live Safety Alerts

              </h2>

            </div>

            {!alerts.length && (

              <div className="rounded-2xl bg-[#F7F5F2] p-8 text-center text-[#6B7280]">

                No alerts at this time.

              </div>

            )}

            <div className="space-y-5">

              {alerts.map((alert) => (

                <div
                  key={alert.id}
                  className="rounded-2xl bg-[#F7F5F2] p-6"
                >

                  <div className="flex flex-wrap items-center justify-between gap-5">

                    <div>

                      <h3 className="text-xl font-black text-[#111827]">

                        {alert.title}

                      </h3>

                      <p className="mt-3 text-[#374151]">

                        {alert.message}

                      </p>

                    </div>

                    <div className="rounded-full bg-[#2F5D50]/10 px-4 py-2 text-xs font-black text-[#2F5D50]">

                      {alert.type}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>

    </>
  );
}