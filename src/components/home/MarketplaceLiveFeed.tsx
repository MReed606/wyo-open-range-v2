"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function MarketplaceLiveFeed() {

  const [listings, setListings] =
    useState<any[]>([]);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", {
          ascending: false,
        })
        .limit(5);

    setListings(data ?? []);
  }

  return (
    <section className="mt-16">

      <h2 className="mb-6 text-4xl font-black text-[#111827]">
        Recent Marketplace Activity
      </h2>

      <div className="space-y-4">

        {listings.map((listing) => (

          <div
            key={listing.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between gap-4">

              <div>

                <div className="text-xl font-black text-[#111827]">
                  {listing.title}
                </div>

                <div className="mt-2 text-[#374151]">
                  New listing posted in {listing.region}
                </div>

              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                New
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
