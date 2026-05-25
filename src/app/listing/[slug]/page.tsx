"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import FavoriteButton from "@/components/listings/FavoriteButton";
import { SellerRating } from "@/components/reviews/SellerRating";

import { supabase } from "@/lib/supabase";

export default function ListingPage() {

  const params = useParams();

  const slug =
    params?.slug as string;

  const [listing,
    setListing] =
    useState<any>(null);

  const [loading,
    setLoading] =
    useState(true);

  const [reportReason,
    setReportReason] =
    useState("");

  const [reportSubmitted,
    setReportSubmitted] =
    useState(false);

  useEffect(() => {

    if (slug) {
      loadListing();
    }

  }, [slug]);

  // =====================================
  // VIEW COUNTER
  // =====================================

  async function incrementViewCount(
    listingId: string
  ) {

    const storageKey =
      `viewed_listing_${listingId}`;

    const alreadyViewed =
      sessionStorage.getItem(
        storageKey
      );

    if (alreadyViewed) {
      return;
    }

    sessionStorage.setItem(
      storageKey,
      "true"
    );

    const { error } =
      await supabase.rpc(
        "increment_listing_views",
        {
          listing_id: listingId,
        }
      );

    if (error) {

      console.error(
        "VIEW COUNT ERROR:",
        error
      );

    }
  }

  // =====================================
  // LOAD LISTING
  // =====================================

  async function loadListing() {

    const { data, error } =
      await supabase
        .from("listings")
        .select("*")
        .or("status.is.null,status.neq.removed")
        .or("hidden_by_system.is.null,hidden_by_system.neq.true")
        .eq("slug", slug)
        .single();

    if (error) {

      console.error(
        "LISTING LOAD ERROR:",
        error
      );

      setLoading(false);

      return;
    }

    if (!data) {

      setLoading(false);

      return;
    }

    setListing({
      ...data,
      views:
        (data.views ?? 0) + 1,
    });

    await incrementViewCount(
      data.id
    );

    setLoading(false);
  }

  // =====================================
  // REPORT LISTING
  // =====================================

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

    const {
      data: existingReport
    } = await supabase
      .from("reports")
      .select("id")
      .eq(
        "listing_id",
        listing.id
      )
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

        listing_id:
          listing.id,

        reporter_id:
          user?.id ?? null,

        reason:
          reportReason,

      });

    setReportSubmitted(true);

    setReportReason("");
  }

  // =====================================
  // CONTACT SELLER
  // =====================================

  async function contactSeller() {

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    if (!user) {

      alert(
        "Login required."
      );

      return;
    }

    const {
      data: existing
    } = await supabase
      .from("conversations")
      .select("*")
      .eq(
        "listing_id",
        listing.id
      )
      .eq(
        "buyer_id",
        user.id
      )
      .single();

    if (existing) {

      window.location.href =
        `/messages/${existing.id}`;

      return;
    }

    const { data } =
      await supabase
        .from("conversations")
        .insert({

          listing_id:
            listing.id,

          buyer_id:
            user.id,

          seller_id:
            listing.owner_id,

        })
        .select()
        .single();

    // =====================================
    // NOTIFICATION
    // =====================================

    await supabase
      .from(
        "user_notifications"
      )
      .insert({

        user_id:
          listing.owner_id,

        type:
          "message",

        title:
          "New Buyer Message",

        message:
          `"${listing.title}" received a new buyer message.`,

        link:
          `/messages/${data.id}`,

      });

    window.location.href =
      `/messages/${data.id}`;
  }

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <main className="min-h-screen bg-[#F7F5F2] p-10">

        Loading...

      </main>

    );

  }

  // =====================================
  // NOT FOUND
  // =====================================

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

        {/* LISTING */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

          {/* IMAGE */}

          {listing.image_url && (

            <div className="relative h-[450px] w-full">

              <Image
                src={listing.image_url}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />

            </div>

          )}

          <div className="p-8">

            <div className="flex flex-wrap items-start justify-between gap-6">

              {/* LEFT */}

              <div className="max-w-3xl">

                <h1 className="text-5xl font-black text-[#111827]">

                  {listing.title}

                </h1>

                {/* CATEGORY */}

                {listing.category && (

                  <div className="mt-4 inline-flex rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-bold text-[#2F5D50]">

                    {listing.category}

                  </div>

                )}

                {/* SELLER RATING */}

                <div className="mt-6">

                  <SellerRating
                    sellerId={
                      listing.owner_id
                    }
                  />

                </div>

                {/* PRICE */}

                <p className="mt-8 text-4xl font-black text-[#2F5D50]">

                  {listing.price ??
                    "Contact"}

                </p>

                {/* META */}

                <div className="mt-6 flex flex-wrap gap-3">

                  <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-black text-[#111827]">

                    👁
                    {" "}
                    {listing.views ?? 0}
                    {" "}
                    views

                  </div>

                  <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-black text-[#111827]">

                    📍
                    {" "}
                    {listing.region ??
                      "Wyoming"}

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-4">

                <FavoriteButton
                  listingId={listing.id}
                />

                <Link
                  href={`/seller/profile/${listing.owner_id}`}
                  className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#24493f]"
                >

                  Seller Profile

                </Link>

                <button
                  onClick={
                    contactSeller
                  }
                  className="rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
                >

                  Contact Seller

                </button>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-12">

              <h2 className="text-3xl font-black text-[#111827]">

                Description

              </h2>

              <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-[#374151]">

                {listing.description}

              </p>

            </div>

          </div>

        </div>

        {/* REPORT */}

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