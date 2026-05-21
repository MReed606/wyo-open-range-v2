"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function MessagesPage() {

  const [conversations,
    setConversations] =
    useState<any[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
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
        
        .neq("hidden_by_buyer", true)
        .neq("hidden_by_seller", true)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (!data?.length) {

      setConversations([]);

      return;
    }

    // =====================================
    // ENHANCE
    // =====================================

    const enhanced =
      await Promise.all(

        data.map(
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
            } = await supabase
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
            } = await supabase
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

            return {
              ...conversation,
              profile,
              latest,
            };
          }
        )
      );

    setConversations(
      enhanced
    );
  }

  
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
    } = await supabase.auth.getUser();

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

    // =====================================
    // HIDE FOR CURRENT USER ONLY
    // =====================================

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

    loadConversations();
  }


  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-10 text-5xl font-black text-[#111827]">
            Messages
          </h1>

          {!conversations.length && (

            <div className="rounded-3xl bg-white p-10 text-xl font-bold text-[#6B7280] shadow-sm">
              No conversations yet.
            </div>

          )}

          <div className="space-y-6">

            {conversations.map(
              (conversation) => (

              <div
                key={conversation.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >

                <div className="flex flex-wrap items-start justify-between gap-6">

                  <Link
                    href={`/messages/${conversation.id}`}
                    className="flex-1"
                  >

                    <h2 className="text-2xl font-black text-[#111827]">

                      {conversation
                        ?.profile
                        ?.full_name ??

                        conversation
                          ?.profile
                          ?.email ??

                        "User"}

                    </h2>

                    <div className="mt-2 text-sm text-gray-500">

                      {new Date(
                        conversation.created_at
                      ).toLocaleString()}

                    </div>

                    <p className="mt-4 text-lg text-[#374151]">

                      {conversation
                        ?.latest
                        ?.message ??

                        "No messages yet."}

                    </p>

                  </Link>

                  <button
                    onClick={() =>
                      deleteConversation(
                        conversation.id
                      )
                    }
                    className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white"
                  >
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
