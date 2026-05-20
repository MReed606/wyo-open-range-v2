"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthGuard() {

  const router = useRouter();

  const [checking, setChecking] =
    useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;
    }

    setChecking(false);
  }

  if (checking) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F2]">

        <div className="rounded-3xl bg-white p-10 shadow-sm">

          <h1 className="text-3xl font-black text-[#111827]">
            Checking Account...
          </h1>

        </div>

      </div>
    );
  }

  return null;
}
