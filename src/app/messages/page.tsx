"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Conversation = {
  id: string;
  created_at: string;
  listings: {
    title: string;
  } | null;
};

type Message = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("Loading conversations...");

  useEffect(() => {
    async function loadConversations() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          created_at,
          listings (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setStatus(error.message);
        return;
      }

      setConversations((data as any) ?? []);
      setStatus("");
    }

    loadConversations();
  }, []);

  async function openConversation(id: string) {
    setSelectedConversation(id);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    setMessages(data ?? []);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#2F5D50]">
            Messaging
          </p>

          <h1 className="mt-3 text-5xl font-bold text-[#1F2933]">
            Inbox
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[340px_1fr]">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-[#1F2933]">
            Conversations
          </h2>

          {status && (
            <div className="rounded-xl bg-[#F3F4F6] p-4 font-semibold">
              {status}
            </div>
          )}

          <div className="grid gap-3">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() =>
                  openConversation(conversation.id)
                }
                className={`rounded-xl border p-4 text-left transition ${
                  selectedConversation === conversation.id
                    ? "border-[#2F5D50] bg-[#F0FDF4]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-bold text-[#1F2933]">
                  {conversation.listings?.title ??
                    "Marketplace Listing"}
                </p>

                <p className="mt-2 text-sm text-[#52606D]">
                  Open conversation
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold text-[#1F2933]">
            Messages
          </h2>

          <div className="mt-6 grid gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="rounded-2xl bg-[#F3F4F6] p-4"
              >
                <p className="text-[#1F2933]">
                  {message.message}
                </p>

                <p className="mt-2 text-sm text-[#52606D]">
                  {new Date(
                    message.created_at
                  ).toLocaleString()}
                </p>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="rounded-2xl bg-[#F8FAFC] p-10 text-center">
                <p className="text-lg font-semibold text-[#52606D]">
                  Select a conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
