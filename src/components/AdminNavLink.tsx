"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ADMIN_EMAILS = [
        "mathewrreed88@gmail.com"
      ];

      if (
        user &&
        ADMIN_EMAILS.includes(user.email ?? "")
      ) {
        setIsAdmin(true);
      }
    }

    checkAdmin();
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="text-sm font-bold text-[#1F2933] hover:text-[#2F5D50]"
    >
      Admin
    </Link>
  );
}
