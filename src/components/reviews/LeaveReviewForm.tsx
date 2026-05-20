"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function LeaveReviewForm({
  sellerId,
}: {
  sellerId: string;
}) {

  const [rating, setRating] =
    useState(5);

  const [review, setReview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login required.");
      return;
    }

    
    // =====================================
    // CHECK EXISTING REVIEW
    // =====================================
    const { data: existingReview } =
      await supabase
        .from("user_reviews")
        .select("id")
        .eq("reviewer_id", user.id)
        .eq(
          "reviewed_user_id",
          sellerId
        )
        .single();

    if (existingReview) {
      alert(
        "You already reviewed this seller."
      );
      return;
    }


    // =====================================
    // CREATE REVIEW
    // =====================================
    const { error } = await supabase
      .from("user_reviews")
      .insert({
        reviewer_id: user.id,
        reviewed_user_id: sellerId,
        rating,
        review,
      });

    if (error) {
      console.error(error);
      alert("Failed to submit review.");
      return;
    }

    // =====================================
    // RECALCULATE SCORE
    // =====================================
    const { data: reviews } =
      await supabase
        .from("user_reviews")
        .select("rating")
        .eq(
          "reviewed_user_id",
          sellerId
        );

    const total =
      reviews?.reduce(
        (sum, r) =>
          sum + r.rating,
        0
      ) ?? 0;

    const count =
      reviews?.length ?? 0;

    const average =
      count > 0
        ? (
            total / count
          ).toFixed(1)
        : 0;

    await supabase
      .from("profiles")
      .update({
        review_score: average,
        review_count: count,
      })
      .eq("id", sellerId);

    alert("Review submitted.");

    location.reload();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-3xl bg-white p-8 shadow-sm"
    >

      <h2 className="text-3xl font-black text-[#111827]">
        Leave Review
      </h2>

      <div className="mt-6">

        <label className="mb-2 block font-bold text-[#111827]">
          Rating
        </label>

        <select
          value={rating}
          onChange={(e) =>
            setRating(
              Number(e.target.value)
            )
          }
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#111827]"
        >
          <option value={5}>
            ⭐⭐⭐⭐⭐ (5)
          </option>

          <option value={4}>
            ⭐⭐⭐⭐ (4)
          </option>

          <option value={3}>
            ⭐⭐⭐ (3)
          </option>

          <option value={2}>
            ⭐⭐ (2)
          </option>

          <option value={1}>
            ⭐ (1)
          </option>

        </select>

      </div>

      <textarea
        value={review}
        onChange={(e) =>
          setReview(e.target.value)
        }
        placeholder="Write your review..."
        required
        className="mt-5 min-h-40 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-2xl bg-[#2F5D50] px-6 py-4 font-bold text-white"
      >
        {loading
          ? "Submitting..."
          : "Submit Review"}
      </button>

    </form>
  );
}
