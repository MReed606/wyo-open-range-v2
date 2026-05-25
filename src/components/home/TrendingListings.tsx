"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string;
  slug: string;
  price: string;
  region: string;
  image_url: string | null;
  views: number;
  trending_score: number;
  category: string | null;
};

export function TrendingListings() {

  const [trending,
    setTrending] =
    useState<Listing[]>([]);

  const [recommended,
    setRecommended] =
    useState<Listing[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadTrendingListings();

    loadRecommendedListings();

  }, []);

  // =====================================
  // TRENDING
  // =====================================

  async function loadTrendingListings() {

    await supabase.rpc(
      "update_listing_trending_scores"
    );

    const { data, error } =
      await supabase
        .from("listings")
        .select(`
          id,
          title,
          slug,
          price,
          region,
          image_url,
          views,
          trending_score,
          category
        `)
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
        "TRENDING ERROR:",
        error
      );

      return;
    }

    setTrending(data ?? []);

    setLoading(false);
  }

  // =====================================
  // RECOMMENDATIONS
  // =====================================

  async function loadRecommendedListings() {

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    // =====================================
    // USER ACTIVITY
    // =====================================

    const {
      data: activity
    } =
      await supabase
        .from(
          "user_listing_activity"
        )
        .select(`
          listing_id,
          activity_type,
          listings (
            category
          )
        `)
        .eq(
          "user_id",
          user.id
        )
        .limit(25);

    if (!activity?.length) {
      return;
    }

    // =====================================
    // TOP CATEGORY SIGNALS
    // =====================================

    const categoryCounts:
      Record<string, number> = {};

    activity.forEach(
      (item: any) => {

        const category =
          item.listings?.category;

        if (!category) {
          return;
        }

        categoryCounts[
          category
        ] =
          (
            categoryCounts[
              category
            ] || 0
          ) + 1;

      }
    );

    const topCategories =
      Object.entries(
        categoryCounts
      )
        .sort(
          (a, b) =>
            b[1] - a[1]
        )
        .slice(0, 3)
        .map(
          ([category]) =>
            category
        );

    if (!topCategories.length) {
      return;
    }

    // =====================================
    // LOAD RECOMMENDATIONS
    // =====================================

    const { data, error } =
      await supabase
        .from("listings")
        .select(`
          id,
          title,
          slug,
          price,
          region,
          image_url,
          views,
          trending_score,
          category
        `)
        .in(
          "category",
          topCategories
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
        "RECOMMENDATION ERROR:",
        error
      );

      return;
    }

    setRecommended(data ?? []);
  }

  // =====================================
  // CARD
  // =====================================

  function ListingCard({
    listing,
    badge,
  }: {
    listing: Listing;
    badge: string;
  }) {

    return (

      <Link
        href={`/listing/${listing.slug}`}
        className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
      >

        <div className="relative overflow-hidden">

          {listing.image_url ? (

            <div className="relative h-[260px] w-full">

              <Image
                src={listing.image_url}
                alt={listing.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />

            </div>

          ) : (

            <div className="flex h-[260px] items-center justify-center bg-[#E5E7EB]">

              <span className="text-lg font-bold text-[#6B7280]">

                No Image

              </span>

            </div>

          )}

          <div className="absolute left-4 top-4 rounded-full bg-[#2F5D50] px-4 py-2 text-sm font-black text-white">

            {badge}

          </div>

        </div>

        <div className="p-6">

          {listing.category && (

            <div className="mb-4 inline-flex rounded-full bg-[#2F5D50]/10 px-4 py-2 text-xs font-black text-[#2F5D50]">

              {listing.category}

            </div>

          )}

          <h3 className="line-clamp-2 text-2xl font-black text-[#111827]">

            {listing.title}

          </h3>

          <p className="mt-4 text-3xl font-black text-[#2F5D50]">

            {listing.price ?? "Contact"}

          </p>

          <div className="mt-6 flex items-center justify-between">

            <p className="text-sm font-bold text-[#6B7280]">

              {listing.region ?? "Wyoming"}

            </p>

            <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-black text-[#111827]">

              👁 {listing.views ?? 0}

            </div>

          </div>

        </div>

      </Link>

    );

  }

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <section>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, i) => (

            <div
              key={i}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >

              <div className="h-[240px] animate-pulse bg-gray-200" />

              <div className="p-6">

                <div className="h-8 animate-pulse rounded bg-gray-200" />

                <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-gray-200" />

              </div>

            </div>

          ))}

        </div>

      </section>

    );

  }

  return (

    <section className="space-y-20">

      {/* RECOMMENDED */}

      {recommended.length > 0 && (

        <div>

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h2 className="text-4xl font-black text-[#111827]">

                Recommended For You

              </h2>

              <p className="mt-2 text-lg text-[#6B7280]">

                Personalized listings based on your activity.

              </p>

            </div>

          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {recommended.map((listing) => (

              <ListingCard
                key={listing.id}
                listing={listing}
                badge="⭐ Recommended"
              />

            ))}

          </div>

        </div>

      )}

      {/* TRENDING */}

      <div>

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-4xl font-black text-[#111827]">

              Trending Listings

            </h2>

            <p className="mt-2 text-lg text-[#6B7280]">

              Most active listings across Wyoming.

            </p>

          </div>

          <Link
            href="/listings"
            className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-sm font-black text-white transition hover:bg-[#24473d]"
          >

            Browse All

          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {trending.map((listing) => (

            <ListingCard
              key={listing.id}
              listing={listing}
              badge="🔥 Trending"
            />

          ))}

        </div>

      </div>

    </section>

  );
}