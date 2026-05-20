"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function FavoriteButton({
  listingId,
}: {
  listingId: string;
}) {

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    checkSaved();
  }, []);

  async function checkSaved() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("listing_id", listingId)
        .maybeSingle();

    setSaved(!!data);
  }

  async function toggleSave() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      alert(
        "Login required."
      );

      return;
    }

    if (saved) {

      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId);

      setSaved(false);

    } else {

      await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          listing_id: listingId,
        });

      setSaved(true);
    }
  }

  return (
    <button
      onClick={toggleSave}
      className={`rounded-2xl px-6 py-4 text-lg font-black transition ${
        saved
          ? "bg-red-600 text-white"
          : "border border-gray-300 bg-white text-[#111827]"
      }`}
    >
      {saved
        ? "Saved ♥"
        : "Save Listing"}
    </button>
  );
}
