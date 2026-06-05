"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminListingsPage() {

  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {

    const { data } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setListings(data ?? []);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Admin Listings
      </h1>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {listings.map((listing) => (

          <div
            key={listing.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >

            {listing.image_url && (

              <img
                src={listing.image_url}
                alt={listing.title}
                className="h-48 w-full object-cover"
              />

            )}

            <div className="p-5">

              <h2 className="text-xl font-bold text-[#111827]">
                {listing.title}
              </h2>

              <p className="mt-2 text-[#374151]">
                {listing.price ?? "Contact"}
              </p>

              <div className="mt-4 flex gap-3">

                <Link
                  href={`/listing/${listing.slug}`}
                  className="rounded-lg bg-[#2F5D50] px-4 py-2 text-sm font-bold text-white"
                >
                  Open
                </Link>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
