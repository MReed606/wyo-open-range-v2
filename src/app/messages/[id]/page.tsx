"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ConversationPage() {

  const params = useParams();

  const id =
    params?.id as string;

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadMessages();

    window.dispatchEvent(
      new Event("message-read")
    );
  }, [id]);

  async function loadMessages() {

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq(
        "conversation_id",
        id
      )
      .order("created_at", {
        ascending: true,
      });

    setMessages(data ?? []);



    // MARK READ

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {

      await supabase
        .from("messages")
        .update({
          read: true,
          read_at:
            new Date()
        })
        .eq(
          "conversation_id",
          id
        )
        .neq(
          "sender_id",
          user.id
        );

    }

  }

  async function sendMessage() {

    if (!message.trim()) {
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("messages")
      .insert({
        conversation_id: id,
        sender_id: user.id,
        message,
      });

    setMessage("");

    loadMessages();

    window.dispatchEvent(
      new Event("message-read")
    );
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-4xl">

        <h1 className="mb-8 text-5xl font-black text-[#111827]">
          Conversation
        </h1>

        <div className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="space-y-5">

            {messages.map((msg) => (

              <div
                key={msg.id}
                className="rounded-2xl bg-[#F7F5F2] p-5"
              >

                <div className="text-sm text-gray-500">
                  {new Date(
                    msg.created_at
                  ).toLocaleString()}
                </div>

                <p className="mt-3 text-lg text-[#111827]">
                  {msg.message}
                </p>

              </div>

            ))}

          </div>

          <div className="mt-8 flex flex-col gap-4">

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              placeholder="Type your message..."
              className="min-h-32 rounded-2xl border border-gray-300 px-5 py-4 text-[#111827]"
            />

            <button
              onClick={sendMessage}
              className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-black text-white"
            >
              Send Message
            </button>

          </div>

        </div>

      </div>

    </main>
    </>
  );
}
