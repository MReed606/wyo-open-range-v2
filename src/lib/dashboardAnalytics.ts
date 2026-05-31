import {
  supabase
} from "@/lib/supabase";
import { getCurrentUser } from "@/lib/currentUser";

export async function loadDashboardAnalytics() {
  const user =
  await getCurrentUser();

  if (!user) {
    return null;
  }

  const {
    data: listings
  } =
    await supabase
  .from("listings")
  .select("*")
  .eq(
    "owner_id",
    user.id
  );

  const userListings =
    listings ?? [];

  const totalViews =
    userListings.reduce(
      (sum, listing) =>
        sum +
        (listing.views || 0),
      0
    );

  const averageTrending =
    userListings.length
      ? (
          userListings.reduce(
            (sum, listing) =>
              sum +
              (listing.trending_score || 0),
            0
          ) /
          userListings.length
        )
      : 0;

  const listingIds =
    userListings.map(
      (l) => l.id
    );

  let totalFavorites = 0;

  if (listingIds.length) {
    const {
      data: favorites
    } =
      await supabase
        .from("favorites")
        .select("id, listing_id")
        .in(
          "listing_id",
          listingIds
        );

    totalFavorites =
      favorites?.length ?? 0;
  }

  const {
    data: conversations
  } =
    await supabase
      .from("conversations")
      .select("*")
      .or(`
        buyer_id.eq.${user.id},
        seller_id.eq.${user.id}
      `);

  const totalMessages =
    conversations?.length ?? 0;

  const recommendationScore =
    Math.min(
      100,
      Math.round(
        (totalViews * 0.02) +
        (totalFavorites * 2) +
        (averageTrending * 5)
      )
    );

  const topListings =
    [...userListings]
      .sort(
        (a, b) =>
          (b.trending_score || 0) -
          (a.trending_score || 0)
      )
      .slice(0, 5);

  return {
    stats: {
      listings:
        userListings.length,
      totalViews,
      totalFavorites,
      totalMessages,
      recommendationScore,
      averageTrending:
        Number(
          averageTrending.toFixed(1)
        ),
    },
    topListings,
  };
}
