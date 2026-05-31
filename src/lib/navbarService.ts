import { supabase } from "@/lib/supabase";
import { isAdmin as checkAdmin } from "@/lib/admin";

import { getCurrentUser } from "@/lib/currentUser";

export async function getNavbarUser() {
  const user =
  await getCurrentUser();

  return {
    loggedIn: !!user,
    isAdmin: await checkAdmin(),
  };
}

export async function getMessageCount() {
  const user =
  await getCurrentUser();

  if (!user) {
    return 0;
  }

  const { data } =
    await supabase
      .from("messages")
      .select("*")
      .eq("read", false)
      .neq(
        "sender_id",
        user.id
      );

  return data?.length ?? 0;
}

export async function getNotifications() {
  const user =
  await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } =
    await supabase
      .from("user_notifications")
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(10);

  if (error) {
    console.error(
      "NOTIFICATION ERROR:",
      error
    );

    return [];
  }

  return data ?? [];
}

export async function markNotificationsRead() {
  const user =
  await getCurrentUser();

  if (!user) {
    return;
  }

  await supabase
    .from("user_notifications")
    .update({
      read: true,
    })
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "read",
      false
    );
}

export async function logoutUser() {
  await supabase.auth.signOut();
  window.location.href = "/";
}
