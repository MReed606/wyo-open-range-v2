"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setEmail(null);
    window.location.href = "/";
  }

  if (email) {
    return (
      <button
        onClick={signOut}
        className="rounded-xl border border-[#2F5D50] px-4 py-2 text-sm font-bold text-[#2F5D50]"
      >
        Log Out
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-xl border border-[#2F5D50] px-4 py-2 text-sm font-bold text-[#2F5D50]"
    >
      Log In
    </Link>
  );
}
