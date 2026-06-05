import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/currentUser";

export async function contactListingSeller(
  listing: any
) {

  const user =
    await getCurrentUser();

  if (!user) {

    alert(
      "Login required."
    );

    return;
  }

  const {
    data: existing
  } =
    await supabase
      .from("conversations")
      .select("*")
      .eq(
        "listing_id",
        listing.id
      )
      .eq(
        "buyer_id",
        user.id
      )
      .single();

  if (existing) {

    window.location.href =
      `/messages/${existing.id}`;

    return;
  }

  const {
    data
  } =
    await supabase
      .from("conversations")
      .insert({

        listing_id:
          listing.id,

        buyer_id:
          user.id,

        seller_id:
          listing.owner_id,

      })
      .select()
      .single();

  if (data) {

    await supabase
      .from(
        "user_notifications"
      )
      .insert({

        user_id:
          listing.owner_id,

        type:
          "message",

        title:
          "New Buyer Message",

        message:
          `"${listing.title}" received a new buyer message.`,

        link:
          `/messages/${data.id}`,

      });

    window.location.href =
      `/messages/${data.id}`;
  }
}

export async function submitListingReport(
  listingId: string,
  reason: string
) {

  if (!reason.trim()) {
    return false;
  }

  const user =
    await getCurrentUser();

  if (!user) {

    alert(
      "Login required."
    );

    return false;
  }

  const { data, error } =
  await supabase
    .from("reports")
    .insert({
      listing_id:
        listingId,

      reporter_id:
        user.id,

      reason,
    })
    .select();

console.log(
  "REPORT USER:",
  user
);

console.log(
  "REPORT DATA:",
  data
);

console.log(
  "REPORT ERROR:",
  error
);

  if (error) {

    console.error(
      "REPORT ERROR:",
      error
    );

    alert(
      "Unable to submit report."
    );

    return false;
  }

  return true;
}

export async function incrementListingView(
  listingId: string
) {

  const storageKey =
    `viewed_listing_${listingId}`;

  if (
    sessionStorage.getItem(
      storageKey
    )
  ) {
    return;
  }

  sessionStorage.setItem(
    storageKey,
    "true"
  );

  await supabase.rpc(
    "increment_listing_views",
    {
      listing_id:
        listingId,
    }
  );
}

export async function loadRelatedListings(
  currentListing: any
) {

  const {
    getRelatedListings
  } = await import(
    "@/lib/recommendations"
  );

  return await getRelatedListings({

    listingId:
      currentListing.id,

    category:
      currentListing.category,

    region:
      currentListing.region,

    limit: 6,

  });
}