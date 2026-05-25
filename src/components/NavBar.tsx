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
        table:
          "user_notifications",
      },
      async () => {

        await loadNotifications();

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

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    setLoggedIn(!!user);

    setIsAdmin(
      await checkAdmin()
    );
  }

  // =====================================
  // LOAD MESSAGES
  // =====================================

  async function loadMessageCount() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .eq("read", false)
        .neq(
          "sender_id",
          user.id
        );

    setMessageCount(
      data?.length ?? 0
    );
  }

  // =====================================
  // LOAD NOTIFICATIONS
  // =====================================

  async function loadNotifications() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data, error } =
      await supabase
        .from(
          "user_notifications"
        )
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(10);

    if (error) {

      console.error(
        "NOTIFICATION ERROR:",
        error
      );

      return;
    }

    setNotifications(
      data ?? []
    );
  }

  // =====================================
  // MARK READ
  // =====================================

  async function markNotificationsRead() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    await supabase
      .from(
        "user_notifications"
      )
      .update({
        read: true,
      })
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "read",
        false
      );

    await loadNotifications();
  }

  // =====================================
  // LOGOUT
  // =====================================

  async function logout() {

    await supabase.auth.signOut();

    window.location.href = "/";
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

          {/* NOTIFICATIONS */}

          {loggedIn && (

            <div className="relative">

              <button
                onClick={async () => {

                  setShowNotifications(
                    !showNotifications
                  );

                  await markNotificationsRead();

                }}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white transition hover:bg-gray-50"
              >

                <Bell className="h-5 w-5 text-[#111827]" />

                {unreadCount > 0 && (

                  <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#2F5D50] px-1 text-[10px] font-black text-white">

                    {unreadCount}

                  </div>

                )}

              </button>

              {/* DROPDOWN */}

              {showNotifications && (

                <div className="absolute right-0 mt-3 w-[380px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">

                  <div className="border-b border-gray-100 px-6 py-5">

                    <h2 className="text-xl font-black text-[#111827]">

                      Notifications

                    </h2>

                  </div>

                  <div className="max-h-[500px] overflow-y-auto">

                    {!notifications.length && (

                      <div className="p-8 text-center text-sm font-semibold text-[#6B7280]">

                        No notifications yet.

                      </div>

                    )}

                    {notifications.map((n) => (

                      <Link
                        key={n.id}
                        href={n.link || "#"}
                        className={`block border-b border-gray-100 px-6 py-5 transition hover:bg-gray-50 ${
                          !n.read
                            ? "bg-[#2F5D50]/5"
                            : ""
                        }`}
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <div className="text-sm font-black text-[#111827]">

                              {n.title}

                            </div>

                            <div className="mt-2 text-sm leading-6 text-[#4B5563]">

                              {n.message}

                            </div>

                          </div>

                          {!n.read && (

                            <div className="mt-1 h-3 w-3 rounded-full bg-[#2F5D50]" />

                          )}

                        </div>

                      </Link>

                    ))}

                  </div>

                </div>

              )}

            </div>

          )}

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