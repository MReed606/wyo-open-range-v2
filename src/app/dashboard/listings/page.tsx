"use client";

import { useEffect, useState } from "react";

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

    if (!user) {
      return;
    }

    const { data, error } =
      await supabase
        .from("listings")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    if (error) {

      console.error(error);

      return;
    }

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

      console.error(error);

      alert(error.message);

      return;
    }

    alert(
      "Listing deleted"
    );

    loadListings();
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-6xl">

          <h1 className="mb-10 text-5xl font-black text-[#111827]">
            Your Listings
          </h1>

          {listings.length === 0 ? (

            <div className="rounded-3xl bg-white p-10 text-2xl font-black shadow-sm">
              No listings found.
            </div>

          ) : (

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

                      <p className="mt-4 text-2xl font-black text-[#2F5D50]">
                        ${listing.price}
                      </p>

                    </div>

                    {/* HUGE DELETE BUTTON */}

                    <button
                      onClick={() =>
                        deleteListing(
                          listing.id
                        )
                      }
                      className="rounded-2xl bg-red-600 px-8 py-5 text-xl font-black text-white transition hover:bg-red-700"
                    >
                      DELETE LISTING
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>
    </>
  );
}
