import {
  supabase
} from "@/lib/supabase";

type TriggerSavedSearchNotificationsParams = {
  listingId: string;
  listingSlug: string;
  title: string;
  category: string;
  region: string;
  price: string;
};

export async function triggerSavedSearchNotifications({
  listingId,
  listingSlug,
  title,
  category,
  region,
  price,
}: TriggerSavedSearchNotificationsParams) {
  const {
    data: savedSearches
  } =
    await supabase
      .from("saved_searches")
      .select(`
        user_id,
        search,
        category,
        region,
        min_price,
        max_price
      `);

  if (!savedSearches?.length) {
    return;
  }

  const matchingSearches =
    savedSearches.filter((searchItem) => {
      if (
        searchItem.search &&
        !title
          .toLowerCase()
          .includes(
            searchItem.search.toLowerCase()
          )
      ) {
        return false;
      }

      if (
        searchItem.category &&
        searchItem.category !== category
      ) {
        return false;
      }

      if (
        searchItem.region &&
        searchItem.region !== region
      ) {
        return false;
      }

      if (
        searchItem.min_price &&
        Number(price) <
          Number(searchItem.min_price)
      ) {
        return false;
      }

      if (
        searchItem.max_price &&
        Number(price) >
          Number(searchItem.max_price)
      ) {
        return false;
      }

      return true;
    });

  if (!matchingSearches.length) {
    return;
  }

  const notifications =
    matchingSearches.map((searchItem) => ({
      user_id: searchItem.user_id,
      type: "saved_search_match",
      title: "New Matching Listing",
      message: `"${title}" matches one of your saved searches.`,
      link: `/listing/${listingSlug}`,
    }));

  await supabase
    .from("user_notifications")
    .insert(notifications);
}
