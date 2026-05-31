"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { AdminVerificationLink } from "@/components/AdminVerificationLink";

import { isAdmin as checkAdmin }
from "@/lib/admin";

import {
  getNavbarUser,
  getMessageCount,
  getNotifications,
  markNotificationsRead as markNotificationsReadService,
  logoutUser,
} from "@/lib/navbarService";

import NavNotifications from "@/components/navbar/NavNotifications";

export default function NavBar() {

  
  const [loggedIn,
    setLoggedIn] =
    useState(false);

  const [messageCount,
    setMessageCount] =
    useState(0);

  const [notifications,
    setNotifications] =
    useState<any[]>([]);

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  const [isAdmin,
    setIsAdmin] =
    useState(false);

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

  checkUser();

  loadMessageCount();

  loadNotifications();

  const cleanupRealtime =
    subscribeToNotifications();

  const refreshMessages =
    () => {

      loadMessageCount();

      loadNotifications();

    };

  window.addEventListener(
    "message-read",
    refreshMessages
  );

  window.addEventListener(
    "message-sent",
    refreshMessages
  );

  return () => {

    cleanupRealtime();

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

  // =====================================
  // REALTIME NOTIFICATIONS
  // =====================================

  function subscribeToNotifications() {

  const channel =
    supabase.channel(
      "live-notifications"
    );

  channel.on(
  "postgres_changes",
  {
    event: "INSERT",
    schema: "public",
    table: "messages",
  },
  async () => {

  const count =
    await getMessageCount();

  

  setMessageCount(
    count
  );

}
);

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
    },
    async () => {

      await loadMessageCount();

    }
  );

  channel.subscribe();

  return () => {

    supabase.removeChannel(
      channel
    );

  };
}

  // =====================================
  // CHECK USER
  // =====================================

  async function checkUser() {

  const result =
    await getNavbarUser();

  setLoggedIn(
    result.loggedIn
  );

  setIsAdmin(
    result.isAdmin
  );
}

  // =====================================
  // LOAD MESSAGES
  // =====================================

  async function loadMessageCount() {

  const count =
    await getMessageCount();

  setMessageCount(
    count
  );
}

  // =====================================
  // LOAD NOTIFICATIONS
  // =====================================

  async function loadNotifications() {

  const data =
    await getNotifications();

  setNotifications(
    data
  );
}

  // =====================================
  // MARK READ
  // =====================================

  async function markNotificationsRead() {

  await markNotificationsReadService();

  await loadNotifications();
}

  // =====================================
  // LOGOUT
  // =====================================

  async function logout() {

  await logoutUser();
}

  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  return (

    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">

      <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between gap-4 overflow-visible px-4 py-3">

        {/* LEFT */}

        <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto">

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-black text-[#111827]"
          >

            <Sparkles className="h-4 w-4 text-[#2F5D50]" />

            WYO Open Range

          </Link>

          <Link
            href="/listings"
            className="shrink-0 text-sm font-bold text-[#1F2933]"
          >
            Browse
          </Link>

          {loggedIn && (

            <>

              <Link
                href="/regions"
                className="shrink-0 text-sm font-bold text-[#1F2933]"
              >
                Regions
              </Link>

              <Link
                href="/forums"
                className="shrink-0 text-sm font-bold text-[#1F2933]"
              >
                Forums
              </Link>

              <Link
                href="/businesses"
                className="shrink-0 text-sm font-bold text-[#1F2933]"
              >
                Businesses
              </Link>

              <Link
                href="/dashboard"
                className="shrink-0 text-sm font-bold text-[#1F2933]"
              >
                Dashboard
              </Link>

              <Link
                href="/saved"
                className="shrink-0 text-sm font-bold text-[#1F2933]"
              >
                Saved
              </Link>

              {isAdmin && (

                <>

                  <Link
                    href="/admin"
                    className="shrink-0 text-sm font-bold text-[#1F2933]"
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

        <div className="flex shrink-0 items-center gap-3">

          {/* MESSAGES */}

          {loggedIn && (

            <Link
              href="/messages"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white transition hover:bg-gray-50"
            >

              <MessageCircle className="h-5 w-5 text-[#111827]" />

              {messageCount > 0 && (

                <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">

                  {messageCount}

                </div>

              )}

            </Link>

          )}

          <NavNotifications
  loggedIn={loggedIn}
  unreadCount={unreadCount}
  showNotifications={showNotifications}
  notifications={notifications}
  setShowNotifications={setShowNotifications}
  markNotificationsRead={markNotificationsRead}
/>

          {/* AUTH */}

          {loggedIn ? (

            <>

              <button
                onClick={logout}
                className="rounded-2xl border border-[#2F5D50] px-5 py-3 text-sm font-black text-[#2F5D50]"
              >

                Log Out

              </button>

              <Link
                href="/post"
                className="rounded-2xl bg-[#2F5D50] px-5 py-3 text-sm font-black text-white transition hover:bg-[#24473d]"
              >

                Post Listing

              </Link>

            </>

          ) : (

            <>

              <Link
                href="/login"
                className="rounded-2xl border border-[#2F5D50] px-5 py-3 text-sm font-black text-[#2F5D50]"
              >

                Login

              </Link>

              <Link
                href="/login"
                className="rounded-2xl bg-[#2F5D50] px-5 py-3 text-sm font-black text-white transition hover:bg-[#24473d]"
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