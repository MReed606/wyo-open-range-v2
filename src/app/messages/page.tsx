"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { notifyUser } from "@/lib/notify";
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

    if (!user) return;

    const { data } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `buyer_id.eq.${user.id},seller_id.eq.${user.id}`
      )
      .order("created_at", {
        ascending: false,
      });

    setConversations(data ?? []);
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-5xl font-black text-[#111827]">
          Messages
        </h1>

        {!conversations.length && (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <h2 className="text-3xl font-black text-[#111827]">
              No conversations yet
            </h2>

            <p className="mt-4 text-lg text-[#374151]">
              Start messaging sellers from listings.
            </p>

          </div>

        )}

        <div className="space-y-5">

          {conversations.map(
            (conversation) => (

            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="block rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-black text-[#111827]">
                    Conversation
                  </h2>

                  <div className="mt-2 text-sm text-gray-500">
                    {new Date(
                      conversation.created_at
                    ).toLocaleString()}
                  </div>

                </div>

                <div className="rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-bold text-[#2F5D50]">
                  Open
                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>
    </>
  );
}


async function deleteMessage(
  id: string
) {

  const confirmed =
    confirm(
      "Delete message?"
    );

  if (!confirmed) {
    return;
  }

  await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  window.location.reload();
}
