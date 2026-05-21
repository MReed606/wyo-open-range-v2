"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardListingsPage() {

  const [listings,
    setListings] =
    useState<any[]>([]);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    setListings(data ?? []);
  }

  async function deleteListing(
    listingId: string
  ) {

    const confirmed =
      confirm(
        "Delete this listing permanently?"
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

    if (error) {

      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        error.message
      );

      return;
    }

    loadListings();
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-6xl">

          <div className="mb-10 flex items-center justify-between">

            <h1 className="text-5xl font-black text-[#111827]">
              Your Listings
            </h1>

            <Link
              href="/sell"
              className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-black text-white"
            >
              Create Listing
            </Link>

          </div>

          <div className="space-y-6">

            {listings.map((listing) => (

              <div
                key={listing.id}
                className="rounded-3xl bg-white p-8 shadow-sm"
              >

                <div className="flex flex-wrap items-start justify-between gap-6">

                  <div>

                    <h2 className="text-3xl font-black text-[#111827]">
                      {listing.title}
                    </h2>

                    <p className="mt-4 text-xl font-bold text-[#2F5D50]">
                      ${listing.price}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      deleteListing(
                        listing.id
                      )
                    }
                    className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white"
                  >
                    Delete Listing
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>
    </>
  );
}
