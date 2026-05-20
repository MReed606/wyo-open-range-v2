"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationsPage() {

  const [notifications, setNotifications] =
    useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setNotifications(data ?? []);

    await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq("user_id", user.id);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Notifications
      </h1>

      {!notifications.length && (

        <div className="rounded-3xl bg-white p-10 shadow-sm">

          <h2 className="text-2xl font-black text-[#111827]">
            No notifications
          </h2>

          <p className="mt-3 text-[#374151]">
            You're all caught up.
          </p>

        </div>

      )}

      <div className="space-y-5">

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className={`rounded-3xl p-6 shadow-sm ${
              notification.read
                ? "bg-white"
                : "bg-[#2F5D50]/5"
            }`}
          >

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>

                <h2 className="text-2xl font-black text-[#111827]">
                  {notification.title}
                </h2>

                <div className="mt-2 text-sm text-gray-500">
                  {new Date(
                    notification.created_at
                  ).toLocaleString()}
                </div>

              </div>

              {!notification.read && (

                <div className="rounded-full bg-[#2F5D50] px-4 py-2 text-sm font-bold text-white">
                  New
                </div>

              )}

            </div>

            <p className="mt-5 text-lg text-[#374151]">
              {notification.message}
            </p>

          </div>

        ))}

      </div>

    </main>
  );
}
