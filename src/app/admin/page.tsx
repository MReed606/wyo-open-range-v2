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
  loadStats(),
  loadFlaggedListings(),

      ]);

    setLoading(false);
  }

  // =====================================
  // REALTIME
  // =====================================

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
  href="/admin/users"
              icon={
                <Users className="h-8 w-8 text-white" />
              }
              color="bg-blue-600"
            />

            <AdminMetricCard
  title="Total Listings"
  value={stats.totalListings}
  href="/admin/listings"
              icon={
                <Sparkles className="h-8 w-8 text-white" />
              }
              color="bg-[#2F5D50]"
            />

            <AdminMetricCard
  title="Flagged Listings"
  value={stats.flaggedListings}
  href="/admin/reports"
              icon={
                <AlertTriangle className="h-8 w-8 text-white" />
              }
              color="bg-red-500"
            />

            <AdminMetricCard
  title="Pending Verifications"
  value={stats.pendingVerifications}
  href="/admin/verification"
              icon={
                <Shield className="h-8 w-8 text-white" />
              }
              color="bg-yellow-500"
            />

            <AdminMetricCard
  title="Marketplace Reports"
  value={stats.reports}
  href="/admin/reports"
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
  href="/admin/messages"
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

          

          <AdminFlaggedListings
  flaggedListings={flaggedListings}
  onRemoveListing={removeListing}
/>

          
        </div>

      </main>

    </>
  );
}
           