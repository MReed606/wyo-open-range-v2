import { supabase } from "@/lib/supabase";

export async function loadHomePageStats() {

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const [
    listingsRes,
    todayListingsRes,
    conversationsRes,
  ] = await Promise.all([

    supabase
      .from("listings")
      .select(
        "id, trending_score"
      ),

    supabase
      .from("listings")
      .select("id")
      .gte(
        "created_at",
        today.toISOString()
      ),

    supabase
      .from("messages")
      .select("id"),

  ]);

  const listings =
    listingsRes.data ?? [];

  const trendingVelocity =
    listings.length

      ? Math.round(
          listings.reduce(
            (
              sum,
              listing
            ) =>

              sum +
              (
                listing.trending_score || 0
              ),

            0
          )
          /
          listings.length
        )

      : 0;

  return {

    activeUsers:
      listings.length,

    liveListings:
      listings.length,

    listingsToday:
      todayListingsRes
        .data?.length ?? 0,

    activeMessages:
      conversationsRes
        .data?.length ?? 0,

    trendingVelocity,

  };
}

export async function getSellingDestination() {

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  return user
    ? "/post"
    : "/login";
}