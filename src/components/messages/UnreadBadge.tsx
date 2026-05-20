"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function UnreadBadge() {

  const [count, setCount] =
    useState(0);

  useEffect(() => {
    loadUnread();
  }, []);

  async function loadUnread() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .eq("receiver_id", user.id)
        .eq("read", false);

    setCount(
      data?.length ?? 0
    );
  }

  if (!count) {
    return null;
  }

  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">
      {count}
    </div>
  );
}
