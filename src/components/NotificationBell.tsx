"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function NotificationBell() {

  const [unread, setUnread] =
    useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", user.id)
      .eq("read", false);

    setUnread(data?.length ?? 0);
  }

  return (
    <Link
      href="/notifications"
      className="relative rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg transition hover:bg-gray-50"
    >

      🔔

      {unread > 0 && (

        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">
          {unread}
        </div>

      )}

    </Link>
  );
}
