import {
  supabase
} from "@/lib/supabase";

export async function loadFlaggedListings() {
  const { data } =
    await supabase
      .from("listings")
      .select("*")
      .eq("flagged", true)
      .order(
        "moderation_score",
        {
          ascending: false,
        }
      )
      .limit(10);

  return data ?? [];
}

export async function loadAdminAlerts() {
  const { data } =
    await supabase
      .from("admin_alerts")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(10);

  return data ?? [];
}
export async function removeAdminListing(
  id: string
) {

  const confirmed =
    confirm(
      "Remove listing?"
    );

  if (!confirmed) {
    return false;
  }

  await supabase
    .from("listings")
    .update({

      status:
        "removed",

    })
    .eq(
      "id",
      id
    );

  return true;
}