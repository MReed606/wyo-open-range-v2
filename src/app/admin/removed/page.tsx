"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RemovedListingsPage() {

  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    loadRemoved();
  }, []);

  async function loadRemoved() {

    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "removed")
      .order("created_at", {
        ascending: false,
      });

    setListings(data ?? []);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-red-600">
        Removed Listings
      </h1>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {listings.map((listing) => (

          <div
            key={listing.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >

            {listing.image_url && (

              <img
                src={listing.image_url}
                alt={listing.title}
                className="h-48 w-full object-cover opacity-60"
              />

            )}

            <div className="p-5">

              <h2 className="text-xl font-bold text-[#111827]">
                {listing.title}
              </h2>

              <p className="mt-3 text-sm text-red-600">
                {listing.removal_reason ??
                  "Removed by moderation"}
              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
