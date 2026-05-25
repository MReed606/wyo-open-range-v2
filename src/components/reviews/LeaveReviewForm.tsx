"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function LeaveReviewForm({
  sellerId,
  listingId,
}: {
  sellerId: string;
  listingId: string;
}) {

  const [rating,
    setRating] =
    useState(5);

  const [review,
    setReview] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [hovered,
    setHovered] =
    useState(0);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      alert(
        "Login required."
      );

      setLoading(false);

      return;
    }

    // =====================================
    // PREVENT DUPLICATE REVIEWS
    // =====================================

    const {
      data: existingReview
    } =
      await supabase
        .from("seller_reviews")
        .select("id")
        .eq(
          "reviewer_id",
          user.id
        )
        .eq(
          "seller_id",
          sellerId
        )
        .eq(
          "listing_id",
          listingId
        )
        .single();

    if (existingReview) {

      alert(
        "You already reviewed this seller for this listing."
      );

      setLoading(false);

      return;
    }

    // =====================================
    // CREATE REVIEW
    // =====================================

    const { error } =
      await supabase
        .from("seller_reviews")
        .insert({

          seller_id:
            sellerId,

          reviewer_id:
            user.id,

          listing_id:
            listingId,

          rating,

          review,

        });

    if (error) {

      console.error(error);

      alert(
        "Failed to submit review."
      );

      setLoading(false);

      return;
    }

    // =====================================
    // CREATE NOTIFICATION
    // =====================================

    await supabase
      .from(
        "user_notifications"
      )
      .insert({

        user_id:
          sellerId,

        type:
          "seller_review",

        title:
          "New Seller Review",

        message:
          "You received a new seller review.",

        link:
          `/seller/profile/${sellerId}`,

      });

    alert(
      "Review submitted successfully."
    );

    location.reload();
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-3xl bg-white p-8 shadow-sm"
    >

      <h2 className="text-3xl font-black text-[#111827]">

        Leave Seller Review

      </h2>

      {/* STARS */}

      <div className="mt-8">

        <label className="mb-4 block font-bold text-[#111827]">

          Rating

        </label>

        <div className="flex items-center gap-2">

          {Array.from({
            length: 5,
          }).map((_, i) => {

            const value =
              i + 1;

            return (

              <button
                key={value}
                type="button"
                onClick={() =>
                  setRating(value)
                }
                onMouseEnter={() =>
                  setHovered(value)
                }
                onMouseLeave={() =>
                  setHovered(0)
                }
                className="transition hover:scale-110"
              >

                <Star
                  className={`h-9 w-9 ${
                    value <= (
                      hovered || rating
                    )
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />

              </button>

            );

          })}

        </div>

      </div>

      {/* REVIEW */}

      <div className="mt-8">

        <label className="mb-4 block font-bold text-[#111827]">

          Review

        </label>

        <textarea
          value={review}
          onChange={(e) =>
            setReview(
              e.target.value
            )
          }
          placeholder="Share your experience with this seller..."
          required
          className="min-h-40 w-full rounded-2xl border border-gray-300 px-5 py-4 text-[#111827] focus:border-[#2F5D50] focus:outline-none"
        />

      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 rounded-2xl bg-[#2F5D50] px-8 py-4 font-black text-white transition hover:bg-[#24473d] disabled:opacity-50"
      >

        {loading
          ? "Submitting..."
          : "Submit Review"}

      </button>

    </form>

  );
}