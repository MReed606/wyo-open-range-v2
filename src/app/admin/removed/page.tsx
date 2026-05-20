"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { isAdminEmail } from "@/lib/admin";

export default function RemovedListingsPage() {

  const router = useRouter();

  const [listings, setListings] =
    useState<any[]>([]);

  useEffect(() => {
    checkAdmin();

    loadListings();
  }, []);

  
  async function checkAdmin() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/");

      return;
    }

    if (
      !isAdminEmail(
        user.email
      )
    ) {

      router.push("/");

    }

  }


async function loadListings() {

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .eq("status", "removed")
        .order("created_at", {
          ascending: false,
        });

    setListings(data ?? []);
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-10">

      <div className="mb-10 flex items-center justify-between">

        <h1 className="text-4xl font-black text-[#111827]">
          Removed Listings
        </h1>

        <Link
          href="/admin/reports"
          className="rounded-xl border border-[#2F5D50] px-5 py-3 font-bold text-[#2F5D50]"
        >
          Back to Reports
        </Link>

      </div>

      {!listings.length && (

        <div className="rounded-3xl bg-white p-10 shadow-sm">

          <h2 className="text-2xl font-black text-[#111827]">
            No removed listings
          </h2>

        </div>

      )}

      <div className="space-y-6">

        {listings.map((listing) => (

          <div
            key={listing.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >

            <div className="flex flex-col gap-6 lg:flex-row">

              {listing.image_url && (

                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="h-48 w-full rounded-2xl object-cover lg:w-72"
                />

              )}

              <div className="flex-1">

                <h2 className="text-3xl font-black text-[#111827]">
                  {listing.title}
                </h2>

                <div className="mt-3 inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                  Removed
                </div>

                <div className="mt-6">

                  <Link
                    href={`/listing/${listing.slug}`}
                    className="rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-700"
                  >
                    View Listing
                  </Link>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
    </>
  );
}
