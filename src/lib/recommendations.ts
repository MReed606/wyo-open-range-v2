import { supabase }
from "@/lib/supabase";

type RecommendationOptions = {

  userId?: string;

  limit?: number;

  categoryBoost?: string[];

  regionBoost?: string[];

};

type ListingScore = {

  id: string;

  title: string;

  slug: string;

  category: string | null;

  region: string | null;

  views: number;

  trending_score: number;

  image_url: string | null;

  price: string;

  recommendation_score: number;

};

// =====================================
// MAIN ENGINE
// =====================================

export async function getRecommendedListings({

  userId,

  limit = 12,

  categoryBoost = [],

  regionBoost = [],

}: RecommendationOptions = {}) {

  // =====================================
  // LOAD LISTINGS
  // =====================================

  const { data: listings, error }
    = await supabase
      .from("listings")
      .select(`
        id,
        title,
        slug,
        category,
        region,
        views,
        trending_score,
        image_url,
        price
      `)
      .or("status.is.null,status.neq.removed")
      .or("hidden_by_system.is.null,hidden_by_system.neq.true")
      .limit(100);

  if (error || !listings) {

    console.error(
      "RECOMMENDATION ENGINE ERROR:",
      error
    );

    return [];
  }

  // =====================================
  // USER PROFILE
  // =====================================

  let preferredCategories:
    string[] = [];

  let preferredRegions:
    string[] = [];

  if (userId) {

    const {
      data: profile
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

    preferredCategories =
      profile
        ?.favorite_categories ?? [];

    preferredRegions =
      profile
        ?.favorite_regions ?? [];
  }

  // =====================================
  // MERGE BOOSTS
  // =====================================

  preferredCategories = [

    ...new Set([

      ...preferredCategories,

      ...categoryBoost,

    ])

  ];

  preferredRegions = [

    ...new Set([

      ...preferredRegions,

      ...regionBoost,

    ])

  ];

  // =====================================
  // SCORE LISTINGS
  // =====================================

  const scored:
    ListingScore[] =
    listings.map(
      (listing: any) => {

        let score = 0;

        // =====================================
        // TRENDING WEIGHT
        // =====================================

        score +=
          (
            listing.trending_score || 0
          ) * 5;

        // =====================================
        // VIEW WEIGHT
        // =====================================

        score +=
          (
            listing.views || 0
          ) * 0.25;

        // =====================================
        // CATEGORY AFFINITY
        // =====================================

        if (
          listing.category &&
          preferredCategories.includes(
            listing.category
          )
        ) {

          score += 120;
        }

        // =====================================
        // REGION AFFINITY
        // =====================================

        if (
          listing.region &&
          preferredRegions.includes(
            listing.region
          )
        ) {

          score += 80;
        }

        // =====================================
        // RANDOMIZATION
        // =====================================

        score +=
          Math.random() * 25;

        return {

          ...listing,

          recommendation_score:
            score,

        };
      }
    );

  // =====================================
  // SORT
  // =====================================

  scored.sort(
    (a, b) =>
      b.recommendation_score -
      a.recommendation_score
  );

  // =====================================
  // RETURN
  // =====================================

  return scored.slice(
    0,
    limit
  );
}

// =====================================
// RELATED LISTINGS
// =====================================

export async function getRelatedListings({

  listingId,

  category,

  region,

  limit = 6,

}: {

  listingId: string;

  category?: string;

  region?: string;

  limit?: number;

}) {

  const {
    data: listings
  } =
    await supabase
      .from("listings")
      .select(`
        id,
        title,
        slug,
        category,
        region,
        views,
        trending_score,
        image_url,
        price
      `)
      .neq(
        "id",
        listingId
      )
      .limit(50);

  if (!listings) {
    return [];
  }

  const scored =
    listings.map(
      (listing: any) => {

        let score = 0;

        if (
          category &&
          listing.category ===
          category
        ) {

          score += 200;
        }

        if (
          region &&
          listing.region ===
          region
        ) {

          score += 120;
        }

        score +=
          (
            listing.trending_score || 0
          ) * 5;

        score +=
          Math.random() * 20;

        return {

          ...listing,

          recommendation_score:
            score,

        };
      }
    );

  scored.sort(
    (a, b) =>
      b.recommendation_score -
      a.recommendation_score
  );

  return scored.slice(
    0,
    limit
  );
}

// =====================================
// TRENDING ENGINE
// =====================================

export async function getTrendingListings(
  limit = 6
) {

  const {
    data
  } =
    await supabase
      .from("listings")
      .select(`
        id,
        title,
        slug,
        category,
        region,
        views,
        trending_score,
        image_url,
        price
      `)
      .order(
        "trending_score",
        {
          ascending: false,
        }
      )
      .limit(limit);

  return data ?? [];
}