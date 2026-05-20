
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ContactAdminPage() {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("admin_messages")
      .insert({
        user_id: user.id,
        subject,
        message,
      });

    alert("Message sent to admin.");

    setSubject("");
    setMessage("");
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] px-6 py-10">

      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="text-4xl font-black text-[#111827]">
          Contact Admin
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <input
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            placeholder="Subject"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Message"
            className="min-h-40 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <button
            type="submit"
            className="rounded-2xl bg-[#2F5D50] px-6 py-4 font-bold text-white"
          >
            Send Message
          </button>

        </form>

      </div>

    </main>
    </>
  );
}
