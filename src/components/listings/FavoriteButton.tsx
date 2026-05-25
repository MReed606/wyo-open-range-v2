"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function FavoriteButton({
  listingId,
}: {
  listingId: string;
}) {

  const [saved,
    setSaved] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {
    loadSaved();
  }, []);

  // =====================================
  // LOAD FAVORITE STATE
  // =====================================

  async function loadSaved() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq(
          "listing_id",
          listingId
        )
        .maybeSingle();

    setSaved(!!data);
  }

  // =====================================
  // TRACK USER ACTIVITY
  // =====================================

  async function trackActivity(
    userId: string,
    activityType: string
  ) {

    await supabase
      .from(
        "user_listing_activity"
      )
      .insert({

        user_id:
          userId,

        listing_id:
          listingId,

        activity_type:
          activityType,

      });
  }

  // =====================================
  // TOGGLE SAVE
  // =====================================

  async function toggleSave() {

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      setLoading(false);

      return;
    }

    // =====================================
    // REMOVE FAVORITE
    // =====================================

    if (saved) {

      await supabase
        .from("favorites")
        .delete()
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "listing_id",
          listingId
        );

      setSaved(false);

      setLoading(false);

      return;
    }

    // =====================================
    // SAVE FAVORITE
    // =====================================

    const { error } =
      await supabase
        .from("favorites")
        .insert({

          user_id:
            user.id,

          listing_id:
            listingId,

        });

    if (error) {

      console.error(
        "FAVORITE ERROR:",
        error
      );

      setLoading(false);

      return;
    }

    // =====================================
    // TRACK RECOMMENDATION SIGNAL
    // =====================================

    await trackActivity(
      user.id,
      "favorite"
    );

    setSaved(true);

    setLoading(false);
  }

  return (

    <button
      onClick={toggleSave}
      disabled={loading}
      className={`flex h-12 w-40 items-center justify-center rounded-2xl border px-4 py-2 font-black transition ${
        saved
          ? "border-[#2F5D50] bg-[#2F5D50] text-white"
          : "border-[#2F5D50] text-[#2F5D50] hover:bg-[#2F5D50]/5"
      }`}
    >

      {loading
        ? "Loading..."
        : saved
          ? "Saved"
          : "Save Listing"}

    </button>

  );
}