"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function EditListingPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const id =
    params.id as string;

  const [listing,
    setListing] =
    useState<any>(null);

  useEffect(() => {
    loadListing();
  }, []);

  async function loadListing() {

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

    setListing(data);
  }

  async function saveListing() {

    await supabase
      .from("listings")
      .update({
        title: listing.title,
        description:
          listing.description,
        price:
          listing.price,
      })
      .eq("id", id);

    alert(
      "Listing updated"
    );

    router.push(
      "/dashboard/listings"
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="mb-8 text-5xl font-black text-[#111827]">
          Edit Listing
        </h1>

        <div className="space-y-6">

          <input
            value={listing.title}
            onChange={(e) =>
              setListing({
                ...listing,
                title:
                  e.target.value,
              })
            }
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-xl"
          />

          <textarea
            value={
              listing.description
            }
            onChange={(e) =>
              setListing({
                ...listing,
                description:
                  e.target.value,
              })
            }
            className="min-h-[180px] w-full rounded-2xl border border-gray-300 px-5 py-4 text-xl"
          />

          <input
            value={listing.price}
            onChange={(e) =>
              setListing({
                ...listing,
                price:
                  e.target.value,
              })
            }
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-xl"
          />

          <button
            onClick={saveListing}
            className="w-full rounded-2xl bg-[#2F5D50] px-6 py-5 text-xl font-black text-white"
          >
            Save Changes
          </button>

        </div>

      </div>

    </main>
  );
}
