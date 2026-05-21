"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ListingCard } from "@/components/ListingCard";

export default function ListingsPage() {

  const searchParams =
    useSearchParams();

  const category =
    searchParams.get("category");

  const [listings,
    setListings] =
    useState<any[]>([]);

  useEffect(() => {
    loadListings();
  }, [category]);

  async function loadListings() {

    let query =
      supabase
        .from("listings")
        .select("*")
        .neq("status", "removed")
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

    const { data } =
      await query;

    setListings(data ?? []);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-12">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">

          <h1 className="text-5xl font-black text-[#111827]">

            {category
              ? `${category} Listings`
              : "Marketplace Listings"}

          </h1>

        </div>

        {!listings.length && (

          <div className="rounded-3xl bg-white p-10 shadow-sm">

            <h2 className="text-2xl font-black text-[#111827]">
              No listings found
            </h2>

          </div>

        )}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {listings.map((listing) => (

            <ListingCard
              key={listing.id}
              title={listing.title}
              price={listing.price}
              location={listing.region}
              seller={listing.seller ?? "Seller"}
              slug={listing.slug}
              image={listing.image_url}
            />

          ))}

        </div>

      </div>

    </main>
  );
}