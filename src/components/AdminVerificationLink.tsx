"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin";

export function AdminVerificationLink() {

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setIsAdmin(
      isAdminEmail(
        user?.email
      )
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin/verification"
      className="text-sm font-bold text-red-700 hover:text-red-800"
    >
      Verification Queue
    </Link>
  );
}
