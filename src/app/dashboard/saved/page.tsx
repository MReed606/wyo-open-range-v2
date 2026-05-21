"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SavedListingsPage() {

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

    if (!user) return;

    const { data: favorites } =
      await supabase
        .from("favorites")
        .select("listing_id")
        .eq("user_id", user.id);

    const ids =
      favorites?.map(
        (f) => f.listing_id
      ) ?? [];

    if (!ids.length) {
      return;
    }

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .in("id", ids);

    setListings(data ?? []);
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-6xl">

          <h1 className="mb-10 text-5xl font-black text-[#111827]">
            Saved Listings
          </h1>

          <div className="space-y-6">

            {listings.map((listing) => (

              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="block rounded-3xl bg-white p-8 shadow-sm"
              >

                <h2 className="text-3xl font-black text-[#111827]">
                  {listing.title}
                </h2>

                <p className="mt-4 text-2xl font-black text-[#2F5D50]">
                  ${listing.price}
                </p>

              </Link>

            ))}

          </div>

        </div>

      </main>
    </>
  );
}
