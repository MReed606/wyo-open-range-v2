import {
  supabase
} from "@/lib/supabase";

export async function saveSearch({
  search,
  category,
  region,
  minPrice,
  maxPrice,
}: {
  search: string;
  category: string | null;
  region: string;
  minPrice: string;
  maxPrice: string;
}) {
  const {
    data: { user }
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "LOGIN_REQUIRED"
    );
  }

  const { error } =
    await supabase
      .from("saved_searches")
      .insert({
        user_id: user.id,
        search: search || null,
        category: category || null,
        region: region || null,
        min_price: minPrice || null,
        max_price: maxPrice || null,
      });

  if (error) {
    throw error;
  }

  return true;
}
