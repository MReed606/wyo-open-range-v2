"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

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

    if (!user) {
      return;
    }

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
    id: string
  ) {

    const confirmed =
      confirm(
        "Delete this listing?"
      );

    if (!confirmed) {
      return;
    }

    await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    loadListings();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-6xl">

        <h1 className="mb-10 text-5xl font-black text-[#111827]">
          Your Listings
        </h1>

        {!listings.length && (

          <div className="rounded-3xl bg-white p-10 text-xl font-bold text-[#6B7280] shadow-sm">
            No listings yet.
          </div>

        )}

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

                  <p className="mt-3 text-2xl font-black text-[#2F5D50]">
                    ${listing.price}
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <Link
                    href={`/edit-listing/${listing.id}`}
                    className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      deleteListing(
                        listing.id
                      )
                    }
                    className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}
