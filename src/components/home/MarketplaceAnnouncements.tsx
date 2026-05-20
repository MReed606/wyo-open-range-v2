"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function MarketplaceAnnouncements() {

  const [announcements,
    setAnnouncements] =
    useState<any[]>([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {

    const { data } =
      await supabase
        .from("announcements")
        .select("*")
        .order("created_at", {
          ascending: false,
        })
        .limit(3);

    setAnnouncements(data ?? []);
  }

  if (!announcements.length) {
    return null;
  }

  return (
    <section className="mb-10 space-y-4">

      {announcements.map((a) => (

        <div
          key={a.id}
          className="rounded-3xl border border-[#2F5D50]/20 bg-[#2F5D50]/5 p-6"
        >

          <h2 className="text-2xl font-black text-[#111827]">
            {a.title}
          </h2>

          <p className="mt-3 text-lg text-[#374151]">
            {a.message}
          </p>

        </div>

      ))}

    </section>
  );
}
