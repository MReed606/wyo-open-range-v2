"use client";

import { useEffect, useRef, useState } from "react";
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
  read_at: string | null;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("Loading conversations...");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadConversations() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);

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

  async function markConversationRead(conversationId: string, currentUserId: string) {
    if (!conversationId || !currentUserId) return;

    const { error } = await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", currentUserId)
      .is("read_at", null);

    if (!error) {
      window.dispatchEvent(new Event("wyo-messages-read"));
    }
  }

  async function openConversation(id: string) {
    setSelectedConversation(id);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    await markConversationRead(id, user.id);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    setMessages((data as Message[]) ?? []);

    window.dispatchEvent(new Event("wyo-messages-read"));

    setTimeout(() => {
      window.dispatchEvent(new Event("wyo-messages-read"));
      messagesContainerRef.current?.scrollTo({
              top: messagesContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
    }, 500);
  }

  useEffect(() => {
    if (!selectedConversation || !userId) return;

    const channel = supabase
      .channel(`messages-${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          if (newMessage.sender_id !== userId) {
            await markConversationRead(selectedConversation, userId);
            newMessage.read_at = new Date().toISOString();
            window.dispatchEvent(new Event("wyo-messages-read"));
          }

          setMessages((current) => [...current, newMessage]);

          setTimeout(() => {
            window.dispatchEvent(new Event("wyo-messages-read"));
            messagesContainerRef.current?.scrollTo({
              top: messagesContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, userId]);

  async function sendReply() {
    if (!reply.trim()) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation,
      sender_id: userId,
      message: reply,
      read_at: null,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setReply("");
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
                onClick={() => openConversation(conversation.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedConversation === conversation.id
                    ? "border-[#2F5D50] bg-[#F0FDF4]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-bold text-[#1F2933]">
                  {conversation.listings?.title ?? "Marketplace Listing"}
                </p>

                <p className="mt-2 text-sm text-[#52606D]">
                  Open conversation
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-[75vh] flex-col rounded-2xl bg-white shadow-md">
          <div className="border-b px-6 py-5">
            <h2 className="text-2xl font-bold text-[#1F2933]">
              Messages
            </h2>
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-6 py-6"
          >
            <div className="grid gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                    message.sender_id === userId
                      ? "ml-auto bg-[#2F5D50] text-white"
                      : "bg-[#F3F4F6] text-[#1F2933]"
                  }`}
                >
                  <p>{message.message}</p>

                  <p
                    className={`mt-2 text-xs ${
                      message.sender_id === userId
                        ? "text-white/70"
                        : "text-[#52606D]"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              ))}

              <div ref={bottomRef} />

              {messages.length === 0 && (
                <div className="rounded-2xl bg-[#F8FAFC] p-10 text-center">
                  <p className="text-lg font-semibold text-[#52606D]">
                    Select a conversation
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedConversation && (
            <div className="border-t p-5">
              <div className="flex gap-3">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type a message..."
                  className="min-h-14 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-[#111827] placeholder:text-gray-500"
                />

                <button
                  onClick={sendReply}
                  className="rounded-xl bg-[#2F5D50] px-6 py-3 font-bold text-white"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
