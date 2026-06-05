"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  Send,
  Circle,
} from "lucide-react";

import {
  supabase,
} from "@/lib/supabase";

import {
  AuthGuard,
} from "@/components/auth/AuthGuard";

import {
  getCurrentUserId,
  loadConversationMessages,
  loadConversationParticipant,
  markConversationRead,
  sendConversationMessage,
} from "@/lib/messageThreadService";

import MessageComposer from "@/components/messages/MessageComposer";

export default function ConversationPage() {

  const params =
    useParams();

  const id =
    params?.id as string;

  const [messages,
    setMessages] =
    useState<any[]>([]);

  const [participant,
    setParticipant] =
    useState<any>(null);

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

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {

    loadUser();

    loadMessages();

    loadParticipant();

    const cleanup =
      subscribeToMessages();

    markMessagesRead();

    window.dispatchEvent(
      new Event("message-read")
    );

    return cleanup;

  }, [id]);

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  async function loadUser() {

    const userId =
      await getCurrentUserId();

    setCurrentUserId(
      userId
    );
  }

  async function loadMessages() {

    const data =
      await loadConversationMessages(
        id
      );

    setMessages(
      data
    );
  }

  async function loadParticipant() {

    const data =
      await loadConversationParticipant(
        id
      );

    setParticipant(
      data?.profile ?? null
    );
  }

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

        setMessages(
          (prev) => [

            ...prev,

            payload.new,

          ]
        );

        await markMessagesRead();

        window.dispatchEvent(
          new Event(
            "message-read"
          )
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

  async function markMessagesRead() {

    await markConversationRead(
      id
    );
  }

  async function sendMessage() {

    if (!message.trim()) {
      return;
    }

    setSending(true);

    const messageText =
      message;

    setMessage("");

    try {

      await sendConversationMessage(
        id,
        messageText
      );

      setTyping(false);

      window.dispatchEvent(
        new Event(
          "message-sent"
        )
      );

    } catch (error) {

      console.error(
        "SEND ERROR:",
        error
      );

    }

    setSending(false);
  }

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

  const participantName =
    participant?.full_name ??
    participant?.email ??
    "Marketplace User";

  return (

    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-5xl">

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h1 className="text-5xl font-black text-[#111827]">

                Messages

              </h1>

              <div className="mt-3 text-xl font-bold text-[#2F5D50]">

                {participantName}

              </div>

              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-green-600">

                <Circle className="h-3 w-3 fill-green-500 text-green-500" />

                Live Conversation

              </div>

            </div>

          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

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
                            : participantName}

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

                <div
                  ref={messagesEndRef}
                />

              </div>

            </div>

            <MessageComposer
              message={message}
              sending={sending}
              typing={typing}
              messageCount={messages.length}
              handleTyping={handleTyping}
              sendMessage={sendMessage}
            />

          </div>

        </div>

      </main>

    </>
  );
}