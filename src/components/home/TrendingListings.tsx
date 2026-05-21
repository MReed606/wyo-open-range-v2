"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function TrendingListings() {

  const [listings, setListings] =
    useState<any[]>([]);

  useEffect(() => {
    loadTrending();
  }, []);

  async function loadTrending() {

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("views", {
          ascending: false,
        })
        .limit(6);

    setListings(data ?? []);
  }

  if (!listings.length) {
    return null;
  }

  return (
    <section className="mt-16">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-4xl font-black text-[#111827]">
            Trending Listings
          </h2>

          <p className="mt-3 text-lg text-[#374151]">
            Most viewed listings on the marketplace.
          </p>

        </div>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        {listings.map((listing) => (

          <Link
            key={listing.id}
            href={`/listing/${listing.slug}`}
            className="market-card overflow-hidden rounded-3xl bg-white shadow-sm"
          >

            {listing.image_url && (

              <img
                src={listing.image_url}
                alt={listing.title}
                className="h-56 w-full object-cover"
              />

            )}

            <div className="p-6">

              <div className="mb-3 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                Trending
              </div>

              <h2 className="line-clamp-2 text-2xl font-black text-[#111827]">
                {listing.title}
              </h2>

              <div className="mt-4 flex items-center justify-between">

                <div className="text-2xl font-black text-[#2F5D50]">
                  $${listing.price}
                </div>

                <div className="text-sm font-bold text-gray-500">
                  {listing.views ?? 0} views
                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}
