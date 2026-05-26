"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type FeedItem = {
  id: string;
  title: string;
  region: string;
  slug: string;
  created_at: string;
  views: number;
  trending_score: number;
};

export function MarketplaceLiveFeed() {

  const [listings,
    setListings] =
    useState<FeedItem[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadFeed();

    // =====================================
    // REALTIME SUBSCRIPTIONS
    // =====================================

    const channel =
      supabase
        .channel(
          "marketplace-live-feed"
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "listings",
          },
          (payload) => {

            const newListing =
              payload.new as FeedItem;

            setListings((prev) => [

              {
                ...newListing,
              },

              ...prev,

            ].slice(0, 10));

          }
        )
        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, []);

  async function loadFeed() {

    setLoading(true);

    const { data, error } =
      await supabase
        .from("listings")
        .select(`
          id,
          title,
          region,
          slug,
          created_at,
          views,
          trending_score
        `)
        .eq("status", "active")
        .order("created_at", {
          ascending: false,
        })
        .limit(10);

    if (error) {

      console.error(
        "LIVE FEED ERROR:",
        error
      );

      setLoading(false);
      return;
    }

    setListings(data ?? []);

    setLoading(false);
  }

  function getRelativeTime(
    dateString: string
  ) {

    const now =
      new Date().getTime();

    const created =
      new Date(
        dateString
      ).getTime();

    const diff =
      Math.floor(
        (now - created) / 1000
      );

    if (diff < 60) {
      return "Just now";
    }

    if (diff < 3600) {

      return `${Math.floor(
        diff / 60
      )}m ago`;
    }

    if (diff < 86400) {

      return `${Math.floor(
        diff / 3600
      )}h ago`;
    }

    return `${Math.floor(
      diff / 86400
    )}d ago`;
  }

  return (
    <section className="mt-16">

      {/* HEADER */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-4xl font-black text-[#111827]">
            Live Marketplace Activity
          </h2>

          <p className="mt-3 text-lg text-[#6B7280]">
            Real-time activity happening across Wyoming.
          </p>

        </div>

        <div className="flex items-center gap-3 rounded-full bg-green-100 px-5 py-3">

          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />

          <span className="text-sm font-black text-green-700">
            LIVE
          </span>

        </div>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="space-y-4">

          {Array.from({
            length: 5,
          }).map((_, i) => (

            <div
              key={i}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >

              <div className="h-8 animate-pulse rounded bg-gray-200" />

              <div className="mt-4 h-6 w-1/3 animate-pulse rounded bg-gray-200" />

            </div>

          ))}

        </div>

      )}

      {/* EMPTY */}

      {!loading &&
        !listings.length && (

        <div className="rounded-3xl bg-white p-10 shadow-sm">

          <h3 className="text-2xl font-black text-[#111827]">
            No marketplace activity yet
          </h3>

        </div>

      )}

      {/* FEED */}

      <div className="space-y-4">

        {listings.map((listing) => (

          <Link
            key={listing.id}
            href={`/listing/${listing.slug}`}
            className="relative z-10 block rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>

                <div className="text-xl font-black text-[#111827]">

                  {listing.title}

                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-[#6B7280]">

                  <span>
                    📍 {listing.region ?? "Wyoming"}
                  </span>

                  <span>
                    👁 {listing.views ?? 0} views
                  </span>

                  <span>
                    🔥 {Math.round(
                      listing.trending_score ?? 0
                    )}
                  </span>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-black text-[#2F5D50]">

                  {getRelativeTime(
                    listing.created_at
                  )}

                </div>

                <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">

                  New

                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}