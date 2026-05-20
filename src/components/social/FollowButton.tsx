"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function FollowButton({
  sellerId,
}: {
  sellerId: string;
}) {

  const [following, setFollowing] =
    useState(false);

  useEffect(() => {
    checkFollow();
  }, []);

  async function checkFollow() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("followers")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", sellerId)
        .maybeSingle();

    setFollowing(!!data);
  }

  async function toggleFollow() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      alert(
        "Login required."
      );

      return;
    }

    if (following) {

      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", sellerId);

      setFollowing(false);

    } else {

      await supabase
        .from("followers")
        .insert({
          follower_id: user.id,
          following_id: sellerId,
        });

      setFollowing(true);
    }
  }

  return (
    <button
      onClick={toggleFollow}
      className={`rounded-2xl px-6 py-4 text-lg font-black transition ${
        following
          ? "bg-[#2F5D50] text-white"
          : "border border-[#2F5D50] bg-white text-[#2F5D50]"
      }`}
    >
      {following
        ? "Following"
        : "Follow Seller"}
    </button>
  );
}
