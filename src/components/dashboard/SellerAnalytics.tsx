"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function SellerAnalytics() {

  const [stats, setStats] =
    useState<any>({
      listings: 0,
      views: 0,
      favorites: 0,
    });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: listings } =
      await supabase
        .from("listings")
        .select("*")
        .eq("owner_id", user.id);

    const totalViews =
      (listings ?? []).reduce(
        (acc: number, l: any) =>
          acc + (l.views ?? 0),
        0
      );

    const totalFavorites =
      (listings ?? []).reduce(
        (acc: number, l: any) =>
          acc + (l.favorites_count ?? 0),
        0
      );

    setStats({
      listings:
        listings?.length ?? 0,

      views:
        totalViews,

      favorites:
        totalFavorites,
    });
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-lg font-bold text-gray-500">
          Your Listings
        </h2>

        <div className="mt-4 text-5xl font-black text-[#111827]">
          {stats.listings}
        </div>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-lg font-bold text-gray-500">
          Listing Views
        </h2>

        <div className="mt-4 text-5xl font-black text-[#111827]">
          {stats.views}
        </div>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-lg font-bold text-gray-500">
          Saved By Users
        </h2>

        <div className="mt-4 text-5xl font-black text-[#111827]">
          {stats.favorites}
        </div>

      </div>

    </div>
  );
}
