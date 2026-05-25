"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {

    loadReviews();

  }, [sellerId]);

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

    setCount(reviews.length);

    setLoading(false);
  }

  if (loading) {

    return (

      <div className="flex items-center gap-2">

        <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />

      </div>

    );

  }

  return (

    <div className="flex flex-wrap items-center gap-3">

      <div className="flex items-center gap-1">

        {Array.from({
          length: 5,
        }).map((_, i) => (

          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.round(average)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />

        ))}

      </div>

      <div className="text-sm font-bold text-[#374151]">

        {average.toFixed(1)}
        {" "}
        ({count} reviews)

      </div>

      {count >= 10 && average >= 4.5 && (

        <div className="rounded-full bg-[#2F5D50]/10 px-3 py-1 text-xs font-black text-[#2F5D50]">

          Verified Trusted Seller

        </div>

      )}

    </div>

  );
}