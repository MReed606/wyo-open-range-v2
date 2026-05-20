"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function ActivityTracker() {

  useEffect(() => {
    updateActivity();
  }, []);

  async function updateActivity() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        last_active:
          new Date().toISOString()
      })
      .eq("id", user.id);
  }

  return null;
}
