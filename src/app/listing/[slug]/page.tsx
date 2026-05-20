"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ListingPage() {

  const params = useParams();

  const slug =
    params?.slug as string;

  const [listing, setListing] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [saved, setSaved] =
    useState(false);

  const [reportReason, setReportReason] =
    useState("");

  const [reportSubmitted,
    setReportSubmitted] =
    useState(false);

  useEffect(() => {
    loadListing();
  }, [slug]);

  async function loadListing() {

    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .single();

    setListing(data);

    setLoading(false);
  }

  async function saveListing() {

    setSaved(true);
  }

  async function submitReport() {

    if (!reportReason.trim()) {
      alert(
        "Please enter a reason."
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    
    // =====================================
    // DUPLICATE REPORT PROTECTION
    // =====================================
    const {
      data: existingReport
    } = await supabase
      .from("reports")
      .select("id")
      .eq("listing_id", listing.id)
      .eq(
        "reporter_id",
        user?.id
      )
      .single();

    if (existingReport) {

      alert(
        "You already reported this listing."
      );

      return;
    }



    await supabase
      .from("reports")
      .insert({
        listing_id: listing.id,
        reporter_id:
          user?.id ?? null,
        reason: reportReason,
      });

    setReportSubmitted(true);

    setReportReason("");
  }

  if (loading) {

    return (
      <main className="min-h-screen bg-[#F7F5F2] p-10">
        Loading...
      </main>
    );

  }

  if (!listing) {

    return (
      <main className="min-h-screen bg-[#F7F5F2] p-10">
        Listing not found.
      </main>
    );

  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-6xl">

        {/* LISTING CARD */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

          {listing.image_url && (

            <img
              src={listing.image_url}
              alt={listing.title}
              className="h-[450px] w-full object-cover"
            />

          )}

          <div className="p-8">

            <div className="flex flex-wrap items-start justify-between gap-6">

              <div>

                <h1 className="text-5xl font-black text-[#111827]">
                  {listing.title}
                </h1>

                {listing.category && (

                  <div className="mt-4 inline-flex rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-bold text-[#2F5D50]">
                    {listing.category}
                  </div>

                )}

                <p className="mt-6 text-4xl font-black text-[#2F5D50]">
                  ${listing.price ?? "Contact"}
                </p>

              </div>

              <div className="flex flex-wrap gap-4">

                <button
                  onClick={saveListing}
                  className="rounded-2xl border border-[#2F5D50] px-6 py-4 text-lg font-bold text-[#2F5D50] transition hover:bg-[#F3F7F5]"
                >
                  {saved
                    ? "Saved ✓"
                    : "Save Listing"}
                </button>

                <Link
                  href={`/seller/profile/${listing.owner_id}`}
                  className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#24493f]"
                >
                  Seller Profile
                </Link>

              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-10">

              <h2 className="text-3xl font-black text-[#111827]">
                Description
              </h2>

              <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-[#374151]">
                {listing.description}
              </p>

            </div>

          </div>

        </div>

        {/* REPORT SECTION */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-2xl font-black text-[#111827]">
            Report Listing
          </h2>

          <textarea
            value={reportReason}
            onChange={(e) =>
              setReportReason(
                e.target.value
              )
            }
            placeholder="Why are you reporting this?"
            className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-medium text-[#111827] placeholder:text-gray-500 focus:border-red-500 focus:outline-none"
          />

          <button
            onClick={submitReport}
            className="mt-5 w-full rounded-2xl bg-red-600 px-6 py-4 text-xl font-black text-white transition hover:bg-red-700"
          >
            Submit Report
          </button>

          {reportSubmitted && (

            <div className="mt-4 rounded-2xl bg-red-50 px-5 py-4">

              <p className="text-sm font-semibold text-[#374151]">
                Report submitted successfully.
              </p>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}