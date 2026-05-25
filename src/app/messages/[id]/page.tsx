"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import {
  Send,
  Circle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ConversationPage() {

  const params = useParams();

  const id =
    params?.id as string;

  const [messages,
    setMessages] =
    useState<any[]>([]);

  const [currentUserId,
    setCurrentUserId] =
    useState("");

  const [message,
    setMessage] =
    useState("");

  const [sending,
    setSending] =
    useState(false);

  const [typing,
    setTyping] =
    useState(false);

  const [otherTyping,
    setOtherTyping] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadUser();

    loadMessages();

    subscribeToMessages();

    markMessagesRead();

    window.dispatchEvent(
      new Event("message-read")
    );

  }, [id]);

  // =====================================
  // AUTO SCROLL
  // =====================================

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  // =====================================
  // LOAD USER
  // =====================================

  async function loadUser() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    setCurrentUserId(
      user?.id ?? ""
    );
  }

  // =====================================
  // LOAD MESSAGES
  // =====================================

  async function loadMessages() {

    const { data, error } =
      await supabase
        .from("messages")
        .select("*")
        .eq(
          "conversation_id",
          id
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (error) {

      console.error(
        "MESSAGE LOAD ERROR:",
        error
      );

      return;
    }

    setMessages(data ?? []);
  }

  // =====================================
  // REALTIME SUBSCRIPTION
  // =====================================

  function subscribeToMessages() {

    const channel =
      supabase.channel(
        `conversation-${id}`
      );

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter:
          `conversation_id=eq.${id}`,
      },
      async (payload) => {

        setMessages((prev) => [

          ...prev,

          payload.new,

        ]);

        await markMessagesRead();

        window.dispatchEvent(
          new Event("message-read")
        );
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
  // MARK READ
  // =====================================

  async function markMessagesRead() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    await supabase
      .from("messages")
      .update({

        read: true,

        read_at:
          new Date(),

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

  // =====================================
  // SEND MESSAGE
  // =====================================

  async function sendMessage() {

    if (!message.trim()) {
      return;
    }

    setSending(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      setSending(false);

      return;
    }

    const messageText =
      message;

    setMessage("");

    const { error } =
      await supabase
        .from("messages")
        .insert({

          conversation_id:
            id,

          sender_id:
            user.id,

          message:
            messageText,

        });

    if (error) {

      console.error(
        "SEND ERROR:",
        error
      );

      setSending(false);

      return;
    }

    setSending(false);

    setTyping(false);

    window.dispatchEvent(
      new Event("message-sent")
    );
  }

  // =====================================
  // TYPING
  // =====================================

  function handleTyping(
    value: string
  ) {

    setMessage(value);

    if (!typing) {

      setTyping(true);

      setTimeout(() => {

        setTyping(false);

      }, 2000);
    }
  }

  return (

    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-5xl">

          {/* HEADER */}

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h1 className="text-5xl font-black text-[#111827]">

                Messages

              </h1>

              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-green-600">

                <Circle className="h-3 w-3 fill-green-500 text-green-500" />

                Live Conversation

              </div>

            </div>

          </div>

          {/* CHAT */}

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

            {/* MESSAGES */}

            <div className="h-[700px] overflow-y-auto p-6">

              <div className="space-y-5">

                {messages.map((msg) => {

                  const isMine =
                    msg.sender_id ===
                    currentUserId;

                  return (

                    <div
                      key={msg.id}
                      className={`flex ${
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`max-w-[80%] rounded-3xl px-6 py-5 shadow-sm ${
                          isMine
                            ? "bg-[#2F5D50] text-white"
                            : "bg-[#F3F4F6] text-[#111827]"
                        }`}
                      >

                        <div className="text-xs font-bold opacity-70">

                          {isMine
                            ? "You"
                            : "Marketplace User"}

                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-lg leading-7">

                          {msg.message}

                        </p>

                        <div className="mt-4 text-xs opacity-70">

                          {new Date(
                            msg.created_at
                          ).toLocaleString()}

                        </div>

                        {isMine &&
                          msg.read && (

                          <div className="mt-2 text-xs font-bold text-green-200">

                            Read

                          </div>

                        )}

                      </div>

                    </div>

                  );

                })}

                {/* TYPING */}

                {otherTyping && (

                  <div className="flex justify-start">

                    <div className="rounded-3xl bg-[#F3F4F6] px-6 py-5 shadow-sm">

                      <div className="flex gap-1">

                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />

                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:0.2s]" />

                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:0.4s]" />

                      </div>

                    </div>

                  </div>

                )}

                <div ref={messagesEndRef} />

              </div>

            </div>

            {/* INPUT */}

            <div className="border-t border-gray-200 bg-white p-6">

              <div className="flex gap-4">

                <textarea
                  value={message}
                  onChange={(e) =>
                    handleTyping(
                      e.target.value
                    )
                  }
                  placeholder="Type your message..."
                  className="min-h-[90px] flex-1 rounded-2xl border border-gray-300 px-5 py-4 text-[#111827] outline-none transition focus:border-[#2F5D50]"
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    sending ||
                    !message.trim()
                  }
                  className="flex w-20 items-center justify-center rounded-2xl bg-[#2F5D50] text-white transition hover:bg-[#24473d] disabled:opacity-50"
                >

                  <Send className="h-6 w-6" />

                </button>

              </div>

              {/* STATUS */}

              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#6B7280]">

                <div>

                  {typing
                    ? "Typing..."
                    : "Connected"}

                </div>

                <div>

                  {messages.length}
                  {" "}
                  messages

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </>
  );
}