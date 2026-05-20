"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function ProfileCompletionGuard() {

  const router = useRouter();

  useEffect(() => {

    async function checkProfile() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

      if (
        !profile?.username ||
        profile.username === "New U"
      ) {
        router.push(
          "/complete-profile"
        );
      }

    }

    checkProfile();

  }, [router]);

  return null;
}
