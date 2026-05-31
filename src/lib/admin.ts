import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/currentUser";
export async function isAdmin() {

  const user =
  await getCurrentUser();

  if (!user) {
    return false;
  }

  const { data } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

  return (
    data?.role === "admin"
  );
}
