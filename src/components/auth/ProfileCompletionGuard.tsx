"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function ProfileCompletionGuard() {

  const router = useRouter();

  useEffect(() => {
    checkProfile();
  }, []);

  async function checkProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    // =====================================
    // ONLY REDIRECT IF TRULY INCOMPLETE
    // =====================================
    if (
      !profile ||
      !profile.full_name ||
      !profile.email
    ) {

      router.push(
        "/complete-profile"
      );

    }

  }

  return null;
}
