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

  useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {

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
      return;
    }

    if (saved) {

      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId);

      setSaved(false);

      return;
    }

    await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        listing_id: listingId,
      });

    setSaved(true);
  }

  return (
    <button
      onClick={toggleSave}
      className="rounded-2xl border border-[#2F5D50] px-4 py-2 font-black text-[#2F5D50]"
    >
      {saved
        ? "Saved"
        : "Save Listing"}
    </button>
  );
}
