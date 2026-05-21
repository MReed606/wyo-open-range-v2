"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { NotificationBell } from "@/components/NotificationBell";
import { AdminVerificationLink } from "@/components/AdminVerificationLink";
import { isAdmin as checkAdmin } from "@/lib/admin";

export default function NavBar() {

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [messageCount,
    setMessageCount] =
    useState(0);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {

    checkUser();

    loadMessageCount();

    const refreshMessages =
      () => loadMessageCount();

    window.addEventListener(
      "message-read",
      refreshMessages
    );

    window.addEventListener(
      "message-sent",
      refreshMessages
    );

    return () => {

      window.removeEventListener(
        "message-read",
        refreshMessages
      );

      window.removeEventListener(
        "message-sent",
        refreshMessages
      );

    };

  }, []);

  async function checkUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setLoggedIn(!!user);

    setIsAdmin(
      await checkAdmin()
    );
  }

  async function loadMessageCount() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .eq("read", false)
        .neq("sender_id", user.id);

    setMessageCount(
      data?.length ?? 0
    );
  }

  async function logout() {

    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <nav className="border-b border-black/5 bg-white">

      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-6 px-4 py-3">

        {/* LEFT */}

        <div className="flex items-center gap-8">

          <Link
            href="/"
            className="text-base font-bold text-[#1F2933]"
          >
            Home
          </Link>

          <Link
            href="/listings"
            className="text-base font-bold text-[#1F2933]"
          >
            Browse
          </Link>

          {loggedIn && (

            <>
              <Link
                href="/regions"
                className="text-base font-bold text-[#1F2933]"
              >
                Regions
              </Link>

              <Link
                href="/forums"
                className="text-base font-bold text-[#1F2933]"
              >
                Forums
              </Link>

              <Link
                href="/businesses"
                className="text-base font-bold text-[#1F2933]"
              >
                Businesses
              </Link>

              <Link
                href="/dashboard"
                className="text-base font-bold text-[#1F2933]"
              >
                Dashboard
              </Link>

              <Link
                href="/messages"
                className="relative text-base font-bold text-[#1F2933]"
              >
                Messages

                {messageCount > 0 && (

                  <span className="absolute -right-4 -top-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                    {messageCount}
                  </span>

                )}

              </Link>

              <Link
                href="/saved"
                className="text-base font-bold text-[#1F2933]"
              >
                Saved
              </Link>

              {isAdmin && (

                <>
                  <Link
                    href="/admin"
                    className="text-base font-bold text-[#1F2933]"
                  >
                    Admin
                  </Link>

                  <AdminVerificationLink />
                </>

              )}

            </>

          )}

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3">

          {loggedIn && (
            <NotificationBell />
          )}

          {loggedIn ? (

            <>
              <button
                onClick={logout}
                className="rounded-xl border border-[#2F5D50] px-5 py-2 text-base font-bold text-[#2F5D50]"
              >
                Log Out
              </button>

              <Link
                href="/post"
                className="flex items-center justify-center rounded-xl bg-[#2F5D50] px-5 py-2 text-base font-bold text-white"
              >
                Post Listing
              </Link>
            </>

          ) : (

            <>
              <Link
                href="/login"
                className="rounded-xl border border-[#2F5D50] px-5 py-2 text-base font-bold text-[#2F5D50]"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-[#2F5D50] px-5 py-2 text-base font-bold text-white"
              >
                Sign Up
              </Link>
            </>

          )}

        </div>

      </div>

    </nav>
  );
}