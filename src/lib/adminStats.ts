import {
  supabase
} from "@/lib/supabase";

export async function loadAdminStats() {
  const [
    usersRes,
    listingsRes,
    flaggedRes,
    removedRes,
    verificationRes,
    reportsRes,
    conversationsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id"),
    supabase.from("listings").select("id"),
    supabase
  .from("listings")
  .select("id")
  .gte("moderation_score", 50),
    supabase.from("listings").select("id").eq("status", "removed"),
    supabase
      .from("profiles")
      .select("id")
      .eq("verification_submitted", true)
      .neq("verified", true),
    supabase.from("reports").select("id"),
    supabase.from("conversations").select("id"),
  ]);

  return {
    totalUsers:
      usersRes.data?.length ?? 0,

    totalListings:
      listingsRes.data?.length ?? 0,

    flaggedListings:
      flaggedRes.data?.length ?? 0,

    flaggedUsers: 0,

    removedListings:
      removedRes.data?.length ?? 0,

    pendingVerifications:
      verificationRes.data?.length ?? 0,

    reports:
      reportsRes.data?.length ?? 0,

    activeConversations:
      conversationsRes.data?.length ?? 0,
  };
}
