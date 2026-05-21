"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MarketplaceFilters } from "@/components/listings/MarketplaceFilters";

export default function ListingsPage() {

  const [listings, setListings] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [category,
    setCategory] =
    useState("");

  const [region,
    setRegion] =
    useState("");

  useEffect(() => {
    loadListings();
  }, [category, region]);

  async function loadListings() {

    let query =
      supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", {
          ascending: false,
        });

    if (category) {

      query =
        query.eq(
          "category",
          category
        );
    }

    if (region) {

      query =
        query.eq(
          "region",
          region
        );
    }

    const { data } =
      await query;

    setListings(data ?? []);
  }

  const filtered =
    listings.filter((listing) => {

      if (!search) return true;

      return (
        listing.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        listing.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    });

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-5xl font-black text-[#111827]">
              Marketplace
            </h1>

            <p className="mt-4 text-lg text-[#374151]">
              Browse Wyoming listings.
            </p>

          </div>

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search listings..."
            className="w-full max-w-xl rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
          />

        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

          {/* SIDEBAR */}

          <MarketplaceFilters
            category={category}
            region={region}
            setCategory={setCategory}
            setRegion={setRegion}
          />

          {/* LISTINGS */}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {filtered.map((listing) => (

              <Link
                key={listing.id}
                href={`/listing/${listing.slug}`}
                className="market-card overflow-hidden rounded-3xl bg-white shadow-sm"
              >

                {listing.image_url ? (

                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="h-64 w-full object-cover"
                  />

                ) : (

                  <div className="flex h-60 items-center justify-center bg-gray-100 text-xl font-bold text-gray-400">
                    No Image
                  </div>

                )}

                <div className="p-6">

                  <div className="mb-4 flex flex-wrap gap-2">

                    <div className="rounded-full bg-[#2F5D50]/10 px-3 py-1 text-xs font-bold text-[#2F5D50]">
                      {listing.category}
                    </div>

                    <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                      {listing.region}
                    </div>

                  </div>

                  <h2 className="line-clamp-2 text-2xl font-black text-[#111827]">
                    {listing.title}
                  </h2>

                  <p className="mt-4 line-clamp-2 text-[#374151]">
                    {listing.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">

                    <div className="text-2xl font-black text-[#2F5D50]">
                      ${listing.price}
                    </div>

                    <div className="text-sm font-bold text-gray-500">
                      {listing.views ?? 0} views
                    </div>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}