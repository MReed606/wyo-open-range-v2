import {
  supabase
} from "@/lib/supabase";

import {
  getRecommendedListings
} from "@/lib/recommendations";

const PAGE_SIZE = 12;

export async function searchListings({
  category,
  region,
  search,
  minPrice,
  maxPrice,
  sortBy,
  currentPage,
}: {
  category: string | null;
  region: string;
  search: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  currentPage: number;
}) {
  const {
    data: { user }
  } =
    await supabase.auth.getUser();

  let results =
    await getRecommendedListings({
      userId: user?.id,
      limit: 100,
      categoryBoost: category ? [category] : [],
      regionBoost: region ? [region] : [],
    });

  if (search.trim()) {
    const searchLower =
      search.toLowerCase();

    results =
      results.filter(
        (listing: any) =>
          listing.title?.toLowerCase().includes(searchLower) ||
          listing.category?.toLowerCase().includes(searchLower) ||
          listing.region?.toLowerCase().includes(searchLower)
      );
  }

  if (category) {
    results =
      results.filter(
        (listing: any) =>
          listing.category === category
      );
  }

  if (region.trim()) {
    results =
      results.filter(
        (listing: any) =>
          listing.region
            ?.toLowerCase()
            .includes(region.toLowerCase())
      );
  }

  if (minPrice) {
    results =
      results.filter(
        (listing: any) =>
          Number(
            listing.price?.replace(
              /[^0-9.]/g,
              ""
            )
          ) >= Number(minPrice)
      );
  }

  if (maxPrice) {
    results =
      results.filter(
        (listing: any) =>
          Number(
            listing.price?.replace(
              /[^0-9.]/g,
              ""
            )
          ) <= Number(maxPrice)
      );
  }

  switch (sortBy) {
    case "popular":
      results.sort(
        (a: any, b: any) =>
          (b.views || 0) -
          (a.views || 0)
      );
      break;

    case "trending":
      results.sort(
        (a: any, b: any) =>
          (b.trending_score || 0) -
          (a.trending_score || 0)
      );
      break;

    case "price_low":
      results.sort(
        (a: any, b: any) =>
          Number(
            a.price?.replace(
              /[^0-9.]/g,
              ""
            ) || 0
          ) -
          Number(
            b.price?.replace(
              /[^0-9.]/g,
              ""
            ) || 0
          )
      );
      break;

    case "price_high":
      results.sort(
        (a: any, b: any) =>
          Number(
            b.price?.replace(
              /[^0-9.]/g,
              ""
            ) || 0
          ) -
          Number(
            a.price?.replace(
              /[^0-9.]/g,
              ""
            ) || 0
          )
      );
      break;
  }

  const from =
    currentPage * PAGE_SIZE;

  const to =
    from + PAGE_SIZE;

  const paginated =
    results.slice(from, to);

  return {
    listings: paginated,
    hasMore:
      paginated.length >=
      PAGE_SIZE,
  };
}
