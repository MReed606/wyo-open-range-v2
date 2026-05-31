"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Star,
  Circle,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

type Props = {
  sellerId: string;
};

export function SellerRating({
  sellerId,
}: Props) {

  const [average,
    setAverage] =
    useState(0);

  const [count,
    setCount] =
    useState(0);

  const [loading,
    setLoading] =
    useState(true);

  const [online,
    setOnline] =
    useState(false);

  const [responseRate,
    setResponseRate] =
    useState(100);

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadReviews();

    loadPresence();

    const interval =
      setInterval(() => {

        loadPresence();

      }, 30000);

    return () => {

      clearInterval(
        interval
      );

    };

  }, [sellerId]);

  // =====================================
  // LOAD REVIEWS
  // =====================================

  async function loadReviews() {

    const { data, error } =
      await supabase
        .from("seller_reviews")
        .select("rating")
        .eq(
          "seller_id",
          sellerId
        );

    if (error) {

      console.error(
        "SELLER RATING ERROR:",
        error
      );

      setLoading(false);

      return;
    }

    const reviews =
      data ?? [];

    const total =
      reviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      );

    const avg =
      reviews.length
        ? total / reviews.length
        : 0;

    setAverage(avg);

    setCount(
      reviews.length
    );

    // =====================================
    // MOCK RESPONSE RATE
    // =====================================

    const simulatedRate =
      Math.min(
        100,
        82 + reviews.length
      );

    setResponseRate(
      simulatedRate
    );

    setLoading(false);
  }

  // =====================================
  // LOAD ONLINE PRESENCE
  // =====================================

  async function loadPresence() {

    const { data } =
      await supabase
        .from("profiles")
        .select(`
          last_active
        `)
        .eq(
          "id",
          sellerId
        )
        .single();

    if (!data?.last_active) {

      setOnline(false);

      return;
    }

    const lastSeen =
      new Date(
        data.last_active
      ).getTime();

    const now =
      Date.now();

    const diffMinutes =
      (now - lastSeen)
      / 1000
      / 60;

    setOnline(
      diffMinutes <= 5
    );
  }

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="flex items-center gap-2">

        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />

      </div>

    );

  }

  const trusted =
    count >= 10 &&
    average >= 4.5;

  const elite =
    count >= 25 &&
    average >= 4.8;

  return (

    <div className="space-y-4">

      {/* TOP */}

      <div className="flex flex-wrap items-center gap-3">

        {/* STARS */}

        <div className="flex items-center gap-1">

          {Array.from({
            length: 5,
          }).map((_, i) => (

            <Star
              key={i}
              className={`h-5 w-5 ${
                i <
                Math.round(
                  average
                )
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />

          ))}

        </div>

        {/* SCORE */}

        <div className="text-sm font-black text-[#374151]">

          {average.toFixed(1)}
          {" "}
          ({count} reviews)

        </div>

        {/* ONLINE */}

        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
          online
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
        }`}>

          <Circle className={`h-2.5 w-2.5 ${
            online
              ? "fill-green-500 text-green-500"
              : "fill-gray-400 text-gray-400"
          }`} />

          {online
            ? "Seller Online"
            : "Offline"}

        </div>

      </div>

      {/* TRUST BADGES */}

      <div className="flex flex-wrap items-center gap-3">

        {trusted && (

          <div className="flex items-center gap-2 rounded-full bg-[#2F5D50]/10 px-4 py-2 text-xs font-black text-[#2F5D50]">

            <ShieldCheck className="h-4 w-4" />

            Verified Trusted Seller

          </div>

        )}

        {elite && (

          <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-xs font-black text-yellow-700">

            <Zap className="h-4 w-4" />

            Elite Marketplace Seller

          </div>

        )}

        <div className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700">

          {responseRate}%
          {" "}
          response rate

        </div>

      </div>

    </div>

  );
}