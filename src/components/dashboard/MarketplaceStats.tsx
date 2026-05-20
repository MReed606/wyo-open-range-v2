"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function MarketplaceStats() {

  const [stats, setStats] =
    useState<any>({
      listings: 0,
      users: 0,
      saved: 0,
    });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {

    const {
      count: listingCount
    } = await supabase
      .from("listings")
      .select("*", {
        count: "exact",
        head: true,
      });

    const {
      count: userCount
    } = await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      });

    const {
      count: savedCount
    } = await supabase
      .from("favorites")
      .select("*", {
        count: "exact",
        head: true,
      });

    setStats({
      listings:
        listingCount ?? 0,

      users:
        userCount ?? 0,

      saved:
        savedCount ?? 0,
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-lg font-bold text-gray-500">
          Active Listings
        </h2>

        <div className="mt-4 text-5xl font-black text-[#111827]">
          {stats.listings}
        </div>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-lg font-bold text-gray-500">
          Marketplace Users
        </h2>

        <div className="mt-4 text-5xl font-black text-[#111827]">
          {stats.users}
        </div>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-lg font-bold text-gray-500">
          Saved Listings
        </h2>

        <div className="mt-4 text-5xl font-black text-[#111827]">
          {stats.saved}
        </div>

      </div>

    </div>
  );
}
