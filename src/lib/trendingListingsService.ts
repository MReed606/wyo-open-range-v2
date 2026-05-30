import { supabase } from "@/lib/supabase";

import {
  getRecommendedListings,
  getTrendingListings,
} from "@/lib/recommendations";

export async function loadTrendingListings() {

  await supabase.rpc(
    "update_listing_trending_scores"
  );

  return await getTrendingListings(
    6
  );
}

export async function loadRecommendedListings(
  userId: string | null
) {

  if (!userId) {
    return [];
  }

  return await getRecommendedListings({

    userId,

    limit: 6,

  });
}

export async function loadRegionalListings(
  userId: string | null
) {

  if (!userId) {
    return [];
  }

  const {
    data: profile,
  } =
    await supabase
      .from(
        "user_preference_profiles"
      )
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();

  const regions =
    profile
      ?.favorite_regions ?? [];

  if (!regions.length) {
    return [];
  }

  return await getRecommendedListings({

    userId,

    limit: 6,

    regionBoost:
      regions,

  });
}