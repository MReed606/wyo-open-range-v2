"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function SavedPage() {

  const [listings,
    setListings] =
    useState<any[]>([]);

  useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    // =====================================
    // GET FAVORITES
    // =====================================

    const { data: favorites } =
      await supabase
        .from("favorites")
        .select("listing_id")
        .eq("user_id", user.id);

    if (!favorites?.length) {

      setListings([]);

      return;
    }

    const ids =
      favorites.map(
        (f) => f.listing_id
      );

    // =====================================
    // GET LISTINGS
    // =====================================

    const { data: listingsData } =
      await supabase
        .from("listings")
        .select("*")
        .in("id", ids);

    setListings(
      listingsData ?? []
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-6xl">

        <h1 className="mb-10 text-5xl font-black text-[#111827]">
          Saved Listings
        </h1>

        {!listings.length && (

          <div className="rounded-3xl bg-white p-10 text-xl font-bold text-[#6B7280] shadow-sm">
            No saved listings yet.
          </div>

        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {listings.map((listing) => (

            <Link
              key={listing.id}
              href={`/listing/${listing.slug}`}
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >

              <h2 className="text-2xl font-black text-[#111827]">
                {listing.title}
              </h2>

              <p className="mt-4 text-3xl font-black text-[#2F5D50]">
                $${listing.price}
              </p>

              <p className="mt-4 text-[#4B5563]">
                {listing.description}
              </p>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}
