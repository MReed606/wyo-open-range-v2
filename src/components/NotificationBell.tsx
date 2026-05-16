"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function NotificationBell() {
  const [count, setCount] = useState(0);

  async function loadCount() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCount(0);
      return;
    }

    const { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

    const ids = conversations?.map((item) => item.id) ?? [];

    if (ids.length === 0) {
      setCount(0);
      return;
    }

    const { count, error } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .in("conversation_id", ids)
      .neq("sender_id", user.id)
      .is("read_at", null);

    if (!error) {
      setCount(count ?? 0);
    }
  }

  useEffect(() => {
    loadCount();

    const interval = window.setInterval(loadCount, 5000);

    const channel = supabase
      .channel("navbar-message-bell-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadCount();
        }
      )
      .subscribe();

    window.addEventListener("focus", loadCount);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", loadCount);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link
      href="/messages"
      title="Messages"
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#2F5D50] bg-white text-[#1F2933] shadow-sm transition hover:bg-[#F7F5F2]"
    >
      <span className="text-2xl leading-none">💬</span>

      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
