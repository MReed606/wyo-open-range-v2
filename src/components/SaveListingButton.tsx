"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type SaveListingButtonProps = {
  listingId: string;
};

export function SaveListingButton({ listingId }: SaveListingButtonProps) {
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function checkSaved() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("saved_listings")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", listingId)
        .maybeSingle();

      setSaved(Boolean(data));
    }

    checkSaved();
  }, [listingId]);

  async function toggleSave() {
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (saved) {
      const { error } = await supabase
        .from("saved_listings")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId);

      if (error) {
        setStatus(error.message);
        return;
      }

      setSaved(false);
      return;
    }

    const { error } = await supabase.from("saved_listings").insert({
      user_id: user.id,
      listing_id: listingId,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setSaved(true);
  }

  return (
    <div>
      <button
        onClick={toggleSave}
        className="w-full rounded-xl border border-black/10 px-5 py-3 font-semibold text-[#1F2933] transition hover:bg-[#F7F5F2]"
      >
        {saved ? "Saved ✓" : "Save Listing"}
      </button>

      {status && (
        <p className="mt-2 text-sm font-semibold text-red-700">
          {status}
        </p>
      )}
    </div>
  );
}
