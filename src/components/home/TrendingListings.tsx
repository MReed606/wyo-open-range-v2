"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  Sparkles,
  Flame,
  Brain,
} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";

import {
  getRecommendedListings,
  getTrendingListings,
} from "@/lib/recommendations";

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

  const [regional,
    setRegional] =
    useState<Listing[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // =====================================
  // INITIALIZE
  // =====================================

  useEffect(() => {

    initialize();

  }, []);

  async function initialize() {

    setLoading(true);

    await Promise.all([

      loadTrending(),

      loadRecommended(),

      loadRegional(),

    ]);

    setLoading(false);
  }

  // =====================================
  // TRENDING
  // =====================================

  async function loadTrending() {

    await supabase.rpc(
      "update_listing_trending_scores"
    );

    const data =
      await getTrendingListings(6);

    setTrending(
      data as Listing[]
    );
  }

  // =====================================
  // RECOMMENDED
  // =====================================

  async function loadRecommended() {

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const data =
      await getRecommendedListings({

        userId:
          user.id,

        limit: 6,

      });

    setRecommended(
      data as Listing[]
    );
  }

  // =====================================
  // REGIONAL
  // =====================================

  async function loadRegional() {

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const {
      data: profile
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

    const regions =
      profile
        ?.favorite_regions ?? [];

    if (!regions.length) {
      return;
    }

    const data =
      await getRecommendedListings({

        userId:
          user.id,

        limit: 6,

        regionBoost:
          regions,

      });

    setRegional(
      data as Listing[]
    );
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

              👁
              {" "}
              {listing.views ?? 0}

            </div>

          </div>

        </div>

      </Link>

    );

  }

  // =====================================
  // SECTION
  // =====================================

  function ListingSection({
    title,
    description,
    icon,
    listings,
    badge,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    listings: Listing[];
    badge: string;
  }) {

    if (!listings.length) {
      return null;
    }

    return (

      <section>

        <div className="mb-8 flex items-center justify-between">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-black text-[#2F5D50]">

              {icon}

              AI Marketplace Discovery

            </div>

            <h2 className="text-4xl font-black text-[#111827]">

              {title}

            </h2>

            <p className="mt-3 text-lg text-[#6B7280]">

              {description}

            </p>

          </div>

          <Link
            href="/listings"
            className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-sm font-black text-white transition hover:bg-[#24473d]"
          >

            Explore More

          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {listings.map((listing) => (

            <ListingCard
              key={listing.id}
              listing={listing}
              badge={badge}
            />

          ))}

        </div>

      </section>

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

              <div className="h-[260px] animate-pulse bg-gray-200" />

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

    <section className="space-y-24">

      <ListingSection
        title="Recommended For You"
        description="Adaptive AI-powered marketplace recommendations based on your interests and behavior."
        icon={
          <Brain className="h-4 w-4" />
        }
        listings={recommended}
        badge="⭐ Recommended"
      />

      <ListingSection
        title="Popular In Your Regions"
        description="Marketplace activity and listings popular in your preferred Wyoming regions."
        icon={
          <Sparkles className="h-4 w-4" />
        }
        listings={regional}
        badge="📍 Regional"
      />

      <ListingSection
        title="Trending Across Wyoming"
        description="Most active and engaging listings across the platform right now."
        icon={
          <Flame className="h-4 w-4" />
        }
        listings={trending}
        badge="🔥 Trending"
      />

    </section>

  );
}