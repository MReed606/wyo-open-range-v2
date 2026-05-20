"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminMessagesPage() {

  const [messages, setMessages] =
    useState<any[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {

    const { data } = await supabase
      .from("admin_messages")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setMessages(data ?? []);
  }

  async function resolveMessage(
    id: string
  ) {

    await supabase
      .from("admin_messages")
      .update({
        resolved: true,
      })
      .eq("id", id);

    loadMessages();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Admin Messages
      </h1>

      <div className="space-y-5">

        {messages.map((message) => (

          <div
            key={message.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-[#111827]">
                  {message.subject}
                </h2>

                <div className="mt-2 text-sm text-gray-500">
                  {new Date(
                    message.created_at
                  ).toLocaleString()}
                </div>

              </div>

              {message.resolved ? (

                <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  Resolved
                </div>

              ) : (

                <button
                  onClick={() =>
                    resolveMessage(
                      message.id
                    )
                  }
                  className="rounded-xl bg-[#2F5D50] px-5 py-3 font-bold text-white"
                >
                  Resolve
                </button>

              )}

            </div>

            <p className="mt-5 text-lg text-[#374151]">
              {message.message}
            </p>

          </div>

        ))}

      </div>

    </main>
  );
}
