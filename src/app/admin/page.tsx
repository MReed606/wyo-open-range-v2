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
  removeAdminListing,
} from "@/lib/adminAlerts";

import {
  AdminFlaggedListings
} from "@/components/admin/AdminFlaggedListings";

import {
  AdminAlertsPanel
} from "@/components/admin/AdminAlertsPanel";

import {
  AdminMetricCard
} from "@/components/admin/AdminMetricCard";

import {
  AdminHero
} from "@/components/admin/AdminHero";

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

  const success =
    await removeAdminListing(
      id
    );

  if (!success) {
    return;
  }

  await initialize();
}

  

  return (

    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-7xl">

          {/* HERO */}

          <AdminHero />

          {/* METRICS */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <AdminMetricCard
              title="Marketplace Users"
              value={stats.totalUsers}
              icon={
                <Users className="h-8 w-8 text-white" />
              }
              color="bg-blue-600"
            />

            <AdminMetricCard
              title="Total Listings"
              value={stats.totalListings}
              icon={
                <Sparkles className="h-8 w-8 text-white" />
              }
              color="bg-[#2F5D50]"
            />

            <AdminMetricCard
              title="Flagged Listings"
              value={stats.flaggedListings}
              icon={
                <AlertTriangle className="h-8 w-8 text-white" />
              }
              color="bg-red-500"
            />

            <AdminMetricCard
              title="Pending Verifications"
              value={stats.pendingVerifications}
              icon={
                <Shield className="h-8 w-8 text-white" />
              }
              color="bg-yellow-500"
            />

            <AdminMetricCard
              title="Marketplace Reports"
              value={stats.reports}
              icon={
                <FileWarning className="h-8 w-8 text-white" />
              }
              color="bg-purple-600"
            />

            <AdminMetricCard
              title="Removed Listings"
              value={stats.removedListings}
              icon={
                <Eye className="h-8 w-8 text-white" />
              }
              color="bg-gray-700"
            />

            <AdminMetricCard
              title="Realtime Conversations"
              value={stats.activeConversations}
              icon={
                <MessageCircle className="h-8 w-8 text-white" />
              }
              color="bg-green-600"
            />

            <AdminMetricCard
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

          <AdminFlaggedListings
  flaggedListings={flaggedListings}
  onRemoveListing={removeListing}
/>

          <AdminAlertsPanel
  alerts={alerts}
/>
        </div>

      </main>

    </>
  );
}
           