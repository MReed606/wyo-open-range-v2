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
          .select("full_name")
          .eq("id", user.id)
          .single();

      if (
        !profile?.full_name
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
