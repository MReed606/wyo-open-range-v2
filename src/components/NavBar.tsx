"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { NotificationBell } from "@/components/NotificationBell";
import { AdminVerificationLink } from "@/components/AdminVerificationLink";
import { isAdminEmail } from "@/lib/admin";

export default function NavBar() {

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setLoggedIn(!!user);

    setIsAdmin(
      isAdminEmail(
        user?.email
      )
    );
  }

  async function logout() {

    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <nav className="border-b border-black/5 bg-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <div className="flex items-center gap-8">

          <Link
            href="/listings"
            className="text-lg font-bold text-[#1F2933]"
          >
            Browse
          </Link>

          <Link
            href="/regions"
            className="text-lg font-bold text-[#1F2933]"
          >
            Regions
          </Link>

          <Link
            href="/forums"
            className="text-lg font-bold text-[#1F2933]"
          >
            Forums
          </Link>

          <Link
            href="/businesses"
            className="text-lg font-bold text-[#1F2933]"
          >
            Businesses
          </Link>

          {loggedIn && (

            <Link
              href="/dashboard"
              className="text-lg font-bold text-[#1F2933]"
            >
              Dashboard
            </Link>

          )}

          {isAdmin && (

            <>
              <Link
                href="/admin"
                className="text-lg font-bold text-[#1F2933]"
              >
                Admin
              </Link>

              <AdminVerificationLink />
            </>

          )}

          {loggedIn && (

            <Link
              href="/messages"
              className="text-lg font-bold text-[#1F2933]"
            >
              Messages
            </Link>

          )}

        </div>

        <div className="flex items-center gap-4">

          {loggedIn && (
            <NotificationBell />
          )}

          {loggedIn ? (

            <>
              <button
                onClick={logout}
                className="rounded-2xl border border-[#2F5D50] px-6 py-3 text-lg font-bold text-[#2F5D50]"
              >
                Log Out
              </button>

              <Link
                href="/post"
                className="rounded-2xl bg-[#2F5D50] px-6 py-3 text-lg font-bold text-white"
              >
                Post Listing
              </Link>
            </>

          ) : (

            <>
              <Link
                href="/login"
                className="rounded-2xl border border-[#2F5D50] px-6 py-3 text-lg font-bold text-[#2F5D50]"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-2xl bg-[#2F5D50] px-6 py-3 text-lg font-bold text-white"
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
