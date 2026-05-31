import { supabase } from "@/lib/supabase";

// =====================================
// TYPES
// =====================================

export type RecommendationOptions = {
  userId?: string;
  limit?: number;
  categoryBoost?: string[];
  regionBoost?: string[];
};

export type ListingScore = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  region: string | null;
  views: number;
  trending_score: number;
  image_url: string | null;
  price: string;
  created_at: string;
  recommendation_score: number;
};

// =====================================
// CACHE
// =====================================

let trendingCache:
  | {
      data: any[];
      timestamp: number;
    }
  | null = null;

const recommendationCache: Record<
  string,
  { data: any[]; timestamp: number }
> = {};

// =====================================
// RECOMMENDED LISTINGS
// =====================================

export async function getRecommendedListings({
  userId,
  limit = 12,
  categoryBoost = [],
  regionBoost = [],
}: RecommendationOptions = {}) {
  const cacheKey = userId ?? "guest";
  const now = Date.now();

  const cached = recommendationCache[cacheKey];

  if (cached && now - cached.timestamp < 300000) {
    return cached.data.slice(0, limit);
  }

  const { data: listings, error } = await supabase
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
      price,
      created_at
    `)
    .or("status.is.null,status.neq.removed")
    .or("hidden_by_system.is.null,hidden_by_system.neq.true")
    .limit(48);

  if (error || !listings) {
    console.error("RECOMMENDATION ENGINE ERROR:", error);
    return [];
  }

  let preferredCategories: string[] = [];
  let preferredRegions: string[] = [];

  if (userId) {
    const { data: profile } = await supabase
      .from("user_preference_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    preferredCategories = profile?.favorite_categories ?? [];
    preferredRegions = profile?.favorite_regions ?? [];
  }

  preferredCategories = [
    ...new Set([...preferredCategories, ...categoryBoost]),
  ];

  preferredRegions = [
    ...new Set([...preferredRegions, ...regionBoost]),
  ];

  const scored = listings.map((listing: any) => {
    let score = 0;

    score += (listing.trending_score || 0) * 5;
    score += (listing.views || 0) * 0.25;

    if (
      listing.category &&
      preferredCategories.includes(listing.category)
    ) {
      score += 120;
    }

    if (
      listing.region &&
      preferredRegions.includes(listing.region)
    ) {
      score += 80;
    }

    const ageHours =
      (Date.now() -
        new Date(listing.created_at).getTime()) /
      1000 /
      60 /
      60;

    score += Math.min(72, Math.max(0, 72 - ageHours));

    return {
      ...listing,
      recommendation_score: score,
    };
  });

  scored.sort(
    (a, b) =>
      b.recommendation_score - a.recommendation_score
  );

  const result = scored.slice(0, limit);

  recommendationCache[cacheKey] = {
    data: result,
    timestamp: now,
  };

  return result;
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
  const { data: listings } = await supabase
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
      price,
      created_at
    `)
    .or("status.is.null,status.neq.removed")
    .or("hidden_by_system.is.null,hidden_by_system.neq.true")
    .neq("id", listingId)
    .limit(24);

  if (!listings) return [];

  const scored = listings.map((listing: any) => {
    let score = 0;

    if (category && listing.category === category) {
      score += 200;
    }

    if (region && listing.region === region) {
      score += 120;
    }

    score += (listing.trending_score || 0) * 5;

    const ageHours =
      (Date.now() -
        new Date(listing.created_at).getTime()) /
      1000 /
      60 /
      60;

    score += Math.min(24, Math.max(0, 48 - ageHours));

    return {
      ...listing,
      recommendation_score: score,
    };
  });

  scored.sort(
    (a, b) =>
      b.recommendation_score - a.recommendation_score
  );

  return scored.slice(0, limit);
}

// =====================================
// TRENDING LISTINGS
// =====================================

export async function getTrendingListings(limit = 6) {
  const now = Date.now();

  if (
    trendingCache &&
    now - trendingCache.timestamp < 300000
  ) {
    return trendingCache.data.slice(0, limit);
  }

  const { data } = await supabase
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
    .order("trending_score", { ascending: false })
    .limit(20);

  const result = data ?? [];

  trendingCache = {
    data: result,
    timestamp: now,
  };

  return result.slice(0, limit);
}