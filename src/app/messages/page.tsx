"use client";

import {
  useEffect,
  useState,
} from "react";

import Link
from "next/link";

import {
  MessageCircle,
  Circle,
  Trash2,
  Sparkles,
} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";

import {
  AuthGuard
} from "@/components/auth/AuthGuard";

export default function MessagesPage() {

  const [conversations,
    setConversations] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadConversations();

    subscribeToRealtime();

  }, []);

  // =====================================
  // REALTIME
  // =====================================

  function subscribeToRealtime() {

    const channel =
      supabase.channel(
        "messages-dashboard"
      );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      async () => {

        await loadConversations();

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
  // LOAD CONVERSATIONS
  // =====================================

  async function loadConversations() {

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      setLoading(false);

      return;
    }

    // =====================================
    // LOAD CONVERSATIONS
    // =====================================

    const { data } =
      await supabase
        .from("conversations")
        .select("*")
        .or(
          `buyer_id.eq.${user.id},seller_id.eq.${user.id}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (!data?.length) {

      setConversations([]);

      setLoading(false);

      return;
    }

    // =====================================
    // FILTER HIDDEN
    // =====================================

    const filtered =
      data.filter(
        (conversation) => {

          if (
            conversation.buyer_id === user.id &&
            conversation.hidden_by_buyer
          ) {
            return false;
          }

          if (
            conversation.seller_id === user.id &&
            conversation.hidden_by_seller
          ) {
            return false;
          }

          return true;
        }
      );

    // =====================================
    // ENHANCE
    // =====================================

    const enhanced =
      await Promise.all(

        filtered.map(
          async (
            conversation
          ) => {

            const otherUserId =
              conversation.buyer_id === user.id
                ? conversation.seller_id
                : conversation.buyer_id;

            // PROFILE

            const {
              data: profile
            } =
              await supabase
                .from("profiles")
                .select("*")
                .eq(
                  "id",
                  otherUserId
                )
                .maybeSingle();

            // LATEST MESSAGE

            const {
              data: latestMessages
            } =
              await supabase
                .from("messages")
                .select("*")
                .eq(
                  "conversation_id",
                  conversation.id
                )
                .order(
                  "created_at",
                  {
                    ascending: false,
                  }
                )
                .limit(1);

            const latest =
              latestMessages?.[0];

            // UNREAD COUNT

            const {
              data: unreadMessages
            } =
              await supabase
                .from("messages")
                .select("*")
                .eq(
                  "conversation_id",
                  conversation.id
                )
                .eq(
                  "read",
                  false
                )
                .neq(
                  "sender_id",
                  user.id
                );

            const unreadCount =
              unreadMessages?.length ?? 0;

            // ONLINE STATUS

            let online =
              false;

            if (
              profile?.last_seen
            ) {

              const lastSeen =
                new Date(
                  profile.last_seen
                ).getTime();

              const now =
                Date.now();

              const diffMinutes =
                (
                  now - lastSeen
                ) / 1000 / 60;

              online =
                diffMinutes <= 5;
            }

            return {

              ...conversation,

              profile,

              latest,

              unreadCount,

              online,

            };
          }
        )
      );

    // =====================================
    // SORT
    // =====================================

    enhanced.sort(
      (a, b) => {

        if (
          b.unreadCount !==
          a.unreadCount
        ) {

          return (
            b.unreadCount -
            a.unreadCount
          );
        }

        return (
          new Date(
            b.latest?.created_at ??
            b.created_at
          ).getTime()
          -
          new Date(
            a.latest?.created_at ??
            a.created_at
          ).getTime()
        );
      }
    );

    setConversations(
      enhanced
    );

    setLoading(false);
  }

  // =====================================
  // DELETE
  // =====================================

  async function deleteConversation(
    id: string
  ) {

    const confirmed =
      confirm(
        "Delete conversation?"
      );

    if (!confirmed) {
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const conversation =
      conversations.find(
        (c) => c.id === id
      );

    if (!conversation) {
      return;
    }

    if (
      conversation.buyer_id === user.id
    ) {

      await supabase
        .from("conversations")
        .update({
          hidden_by_buyer: true
        })
        .eq("id", id);

    } else {

      await supabase
        .from("conversations")
        .update({
          hidden_by_seller: true
        })
        .eq("id", id);

    }

    await loadConversations();
  }

  return (

    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <div className="mb-10 flex items-center justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-black text-[#2F5D50]">

                <Sparkles className="h-4 w-4" />

                Realtime Marketplace Messaging

              </div>

              <h1 className="text-5xl font-black text-[#111827]">

                Messages

              </h1>

            </div>

          </div>

          {/* EMPTY */}

          {!loading &&
            !conversations.length && (

            <div className="rounded-3xl bg-white p-16 text-center shadow-sm">

              <MessageCircle className="mx-auto h-14 w-14 text-gray-300" />

              <h2 className="mt-6 text-3xl font-black text-[#111827]">

                No conversations yet

              </h2>

              <p className="mt-4 text-lg text-[#6B7280]">

                Start messaging sellers to begin conversations.

              </p>

            </div>

          )}

          {/* LOADING */}

          {loading && (

            <div className="rounded-3xl bg-white p-16 text-center shadow-sm">

              Loading conversations...

            </div>

          )}

          {/* LIST */}

          <div className="space-y-5">

            {conversations.map(
              (conversation) => (

              <div
                key={conversation.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-lg"
              >

                <div className="flex flex-wrap items-center justify-between gap-6 p-6">

                  {/* LINK */}

                  <Link
                    href={`/messages/${conversation.id}`}
                    className="flex flex-1 items-center gap-5"
                  >

                    {/* AVATAR */}

                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#2F5D50] text-2xl font-black text-white">

                      {conversation
                        ?.profile
                        ?.full_name?.[0] ??
                        "U"}

                      {/* ONLINE */}

                      <div className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-4 border-white ${
                        conversation.online
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`} />

                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="truncate text-2xl font-black text-[#111827]">

                          {conversation
                            ?.profile
                            ?.full_name ??

                            conversation
                              ?.profile
                              ?.email ??

                            "Marketplace User"}

                        </h2>

                        {conversation.online && (

                          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">

                            <Circle className="h-2.5 w-2.5 fill-green-500 text-green-500" />

                            Online

                          </div>

                        )}

                        {conversation.unreadCount > 0 && (

                          <div className="rounded-full bg-[#2F5D50] px-3 py-1 text-xs font-black text-white">

                            {conversation.unreadCount}
                            {" "}
                            unread

                          </div>

                        )}

                      </div>

                      <div className="mt-2 text-sm text-gray-500">

                        {new Date(
                          conversation
                            ?.latest
                            ?.created_at ??

                          conversation.created_at
                        ).toLocaleString()}

                      </div>

                      <p className="mt-4 truncate text-lg text-[#374151]">

                        {conversation
                          ?.latest
                          ?.message ??

                          "No messages yet."}

                      </p>

                    </div>

                  </Link>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      deleteConversation(
                        conversation.id
                      )
                    }
                    className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700"
                  >

                    <Trash2 className="h-4 w-4" />

                    Delete

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

    </>
  );
}