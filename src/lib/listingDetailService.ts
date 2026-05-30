import { supabase } from "@/lib/supabase";

export async function contactListingSeller(
  listing: any
) {

  const {
    data: { user }
  } =
    await supabase.auth.getUser();

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

  await supabase
    .from("reports")
    .insert({

      listing_id:
        listingId,

      reason,

    });

  return true;
}
