"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SavedPage() {

  const [listings, setListings] =
    useState<any[]>([]);

  useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("favorites")
        .select(`
          *,
          listings (
            *
          )
        `)
        .eq("user_id", user.id);

    const mapped =
      (data ?? [])
        .map((f: any) => f.listings)
        .filter(Boolean);

    setListings(mapped);
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-7xl">

          <h1 className="mb-8 text-5xl font-black text-[#111827]">
            Saved Listings
          </h1>

          {!listings.length && (

            <div className="rounded-3xl bg-white p-10 shadow-sm">

              <h2 className="text-2xl font-black text-[#111827]">
                No saved listings
              </h2>

            </div>

          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {listings.map((listing) => (

              <Link
                key={listing.id}
                href={`/listing/${listing.slug}`}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {listing.image_url && (

                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="h-56 w-full object-cover"
                  />

                )}

                <div className="p-6">

                  <h2 className="text-2xl font-black text-[#111827]">
                    {listing.title}
                  </h2>

                  <p className="mt-4 text-xl font-bold text-[#2F5D50]">
                    ${listing.price}
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </main>
    </>
  );
}
