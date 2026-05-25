"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import FavoriteButton from "@/components/listings/FavoriteButton";
import { SellerRating } from "@/components/reviews/SellerRating";
import { LeaveReviewForm } from "@/components/reviews/LeaveReviewForm";

import { supabase } from "@/lib/supabase";

type RelatedListing = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  price: string;
  region: string;
  category: string | null;
  trending_score: number;
};

export default function ListingPage() {

  const params = useParams();

  const slug =
    params?.slug as string;

  const [listing,
    setListing] =
    useState<any>(null);

  const [relatedListings,
    setRelatedListings] =
    useState<RelatedListing[]>([]);

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
  // TRACK USER ACTIVITY + LEARN PREFERENCES
  // =====================================

  async function trackActivity(
    listingId: string,
    activityType: string
  ) {

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    // =====================================
    // TRACK RAW ACTIVITY
    // =====================================

    await supabase
      .from(
        "user_listing_activity"
      )
      .insert({

        user_id:
          user.id,

        listing_id:
          listingId,

        activity_type:
          activityType,

      });

    // =====================================
    // LOAD LISTING DETAILS
    // =====================================

    const { data: listingData } =
      await supabase
        .from("listings")
        .select(`
          category,
          region
        `)
        .eq("id", listingId)
        .single();

    if (!listingData) {
      return;
    }

    // =====================================
    // LOAD EXISTING PROFILE
    // =====================================

    const {
      data: existingProfile
    } =
      await supabase
        .from(
          "user_preference_profiles"
        )
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    const currentCategories =
      existingProfile
        ?.favorite_categories ?? [];

    const currentRegions =
      existingProfile
        ?.favorite_regions ?? [];

    // =====================================
    // MERGE CATEGORY SIGNALS
    // =====================================

    const updatedCategories =
      Array.from(
        new Set([

          ...currentCategories,

          listingData.category,

        ].filter(Boolean))
      );

    // =====================================
    // MERGE REGION SIGNALS
    // =====================================

    const updatedRegions =
      Array.from(
        new Set([

          ...currentRegions,

          listingData.region,

        ].filter(Boolean))
      );

    // =====================================
    // UPSERT PROFILE
    // =====================================

    await supabase
      .from(
        "user_preference_profiles"
      )
      .upsert({

        user_id:
          user.id,

        favorite_categories:
          updatedCategories,

        favorite_regions:
          updatedRegions,

        updated_at:
          new Date()
            .toISOString(),

      });

  }

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
          listing_id:
            listingId,
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
  // LOAD RELATED
  // =====================================

  async function loadRelatedListings(
    currentListing: any
  ) {

    const { data, error } =
      await supabase
        .from("listings")
        .select(`
          id,
          title,
          slug,
          image_url,
          price,
          region,
          category,
          trending_score
        `)
        .neq(
          "id",
          currentListing.id
        )
        .eq(
          "category",
          currentListing.category
        )
        .or("status.is.null,status.neq.removed")
        .or("hidden_by_system.is.null,hidden_by_system.neq.true")
        .order(
          "trending_score",
          {
            ascending: false,
          }
        )
        .limit(6);

    if (error) {

      console.error(
        "RELATED LISTINGS ERROR:",
        error
      );

      return;
    }

    setRelatedListings(
      data ?? []
    );
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

    await trackActivity(
      data.id,
      "view"
    );

    await loadRelatedListings(
      data
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
    } =
      await supabase.auth.getUser();

    const {
      data: existingReport
    } =
      await supabase
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

    await trackActivity(
      listing.id,
      "contact_seller"
    );

    const {
      data: existing
    } =
      await supabase
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

                {listing.category && (

                  <div className="mt-4 inline-flex rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-bold text-[#2F5D50]">

                    {listing.category}

                  </div>

                )}

                {/* SELLER */}

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
                  listingId={
                    listing.id
                  }
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

        {/* REVIEW FORM */}

        <LeaveReviewForm
          sellerId={listing.owner_id}
          listingId={listing.id}
        />

        {/* RELATED */}

        {relatedListings.length > 0 && (

          <section className="mt-16">

            <div className="mb-8">

              <h2 className="text-4xl font-black text-[#111827]">

                Similar Listings

              </h2>

              <p className="mt-3 text-lg text-[#6B7280]">

                Related listings you may also like.

              </p>

            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {relatedListings.map((item) => (

                <Link
                  key={item.id}
                  href={`/listing/${item.slug}`}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="relative h-[240px] overflow-hidden">

                    {item.image_url ? (

                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center bg-[#E5E7EB]">

                        <span className="font-bold text-[#6B7280]">

                          No Image

                        </span>

                      </div>

                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-[#2F5D50] px-4 py-2 text-sm font-black text-white">

                      Similar

                    </div>

                  </div>

                  <div className="p-6">

                    <h3 className="line-clamp-2 text-2xl font-black text-[#111827]">

                      {item.title}

                    </h3>

                    <p className="mt-4 text-3xl font-black text-[#2F5D50]">

                      {item.price}

                    </p>

                    <div className="mt-6 flex items-center justify-between">

                      <p className="text-sm font-bold text-[#6B7280]">

                        {item.region}

                      </p>

                      <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-black text-[#111827]">

                        🔥
                        {" "}
                        {Math.round(
                          item.trending_score ?? 0
                        )}

                      </div>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          </section>

        )}

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