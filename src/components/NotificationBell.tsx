"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadCount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: conversations } = await supabase
        .from("conversations")
        .select("id,buyer_id,seller_id")
        .or(
          `buyer_id.eq.${user.id},seller_id.eq.${user.id}`
        );

      if (!conversations?.length) return;

      const ids = conversations.map((c) => c.id);

      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .in("conversation_id", ids)
        .neq("sender_id", user.id);

      if (!mounted) return;

      setCount(messages?.length ?? 0);
    }

    loadCount();

    const channel = supabase
      .channel("notification-bell")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          loadCount();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link
      href="/messages"
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-[#F3F4F6]"
    >
      <span className="text-xl">💬</span>

      {count > 0 && (
        <div className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
          {count > 99 ? "99+" : count}
        </div>
      )}
    </Link>
  );
}
