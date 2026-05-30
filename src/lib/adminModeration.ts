import { supabase } from "@/lib/supabase";

export async function removeListingByAdmin(
  id: string
) {
  await supabase
    .from("listings")
    .update({
      status: "removed",
    })
    .eq(
      "id",
      id
    );
}