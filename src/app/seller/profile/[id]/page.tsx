"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

import { FollowButton } from "@/components/social/FollowButton";

export default function SellerProfilePage() {

  const params = useParams();

  const id =
    params?.id as string;

  const [seller, setSeller] =
    useState<any>(null);

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [listings, setListings] =
    useState<any[]>([]);

  useEffect(() => {
    loadSeller();
  }, []);

  async function loadSeller() {

    // =====================================
    // SELLER
    // =====================================

    const { data: sellerData } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    setSeller(sellerData);

    // =====================================
    // REVIEWS
    // =====================================

    const { data: reviewData } =
      await supabase
        .from("reviews")
        .select("*")
        .eq("seller_id", id)
        .order("created_at", {
          ascending: false,
        });

    setReviews(reviewData ?? []);

    // =====================================
    // LISTINGS
    // =====================================

    const { data: listingData } =
      await supabase
        .from("listings")
        .select("*")
        .eq("owner_id", id)
        .eq("status", "active")
        .order("created_at", {
          ascending: false,
        });

    setListings(listingData ?? []);
  }

  if (!seller) {

    return (
      <>
        <AuthGuard />

        <main className="min-h-screen bg-[#F7F5F2] p-10">

          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-sm">

            <h1 className="text-4xl font-black text-[#111827]">
              Loading Seller...
            </h1>

          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-6xl">

          {/* PROFILE */}

          <div className="rounded-3xl bg-white p-8 shadow-sm">

            <div className="flex flex-wrap items-start justify-between gap-8">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-5xl font-black text-[#111827]">
                    {seller.full_name}
                  </h1>

                  {seller.badge && (

                    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">
                      {seller.badge}
                    </div>

                  )}

                  {seller.premium_seller && (

                    <div className="rounded-full bg-purple-100 px-4 py-2 text-sm font-black text-purple-700">
                      Premium Seller
                    </div>

                  )}

                  {seller.verified && (

                    <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                      Verified
                    </div>

                  )}

                </div>

                <div className="mt-5 space-y-2 text-lg text-[#374151]">

                  <p>
                    Email:
                    {" "}
                    {seller.public_email
                      ? seller.email
                      : "Private"}
                  </p>

                  <p>
                    Phone:
                    {" "}
                    {seller.public_phone
                      ? seller.phone
                      : "Private"}
                  </p>

                  <p>
                    Trust Score:
                    {" "}
                    {seller.trust_score ?? 100}
                  </p>

                  <p>
                    Response Rate:
                    {" "}
                    {seller.response_rate ?? 100}%
                  </p>

                  <p>
                    Response Speed:
                    {" "}
                    {seller.response_time ?? "Fast"}
                  </p>

                </div>

                <div className="mt-6">
                  <FollowButton sellerId={id} />
                </div>

              </div>

            </div>

          </div>

          {/* BIO */}

          {seller.bio && (

            <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="text-3xl font-black text-[#111827]">
                Seller Bio
              </h2>

              <p className="mt-5 text-lg leading-8 text-[#374151]">
                {seller.bio}
              </p>

            </div>

          )}

          {/* LISTINGS */}

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="mb-8 text-4xl font-black text-[#111827]">
              Active Listings
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              {listings.map((listing) => (

                <div
                  key={listing.id}
                  className="rounded-3xl border border-gray-200 p-6"
                >

                  <h3 className="text-2xl font-black text-[#111827]">
                    {listing.title}
                  </h3>

                  <p className="mt-4 text-[#374151]">
                    {listing.description}
                  </p>

                  <div className="mt-5 text-2xl font-black text-[#2F5D50]">
                    ${listing.price}
                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* REVIEWS */}

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="mb-8 text-4xl font-black text-[#111827]">
              Reviews
            </h2>

            <div className="space-y-6">

              {reviews.map((review) => (

                <div
                  key={review.id}
                  className="rounded-3xl border border-gray-200 p-6"
                >

                  <div className="text-xl font-black text-[#111827]">
                    {review.rating}/5
                  </div>

                  <p className="mt-4 text-[#374151]">
                    {review.comment}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>
    </>
  );
}
