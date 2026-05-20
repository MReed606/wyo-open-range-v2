"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {

    async function checkRole() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

      if (
        profile &&
        allowedRoles.includes(
          profile.role
        )
      ) {
        setAllowed(true);
      }

    }

    checkRole();

  }, [allowedRoles]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
