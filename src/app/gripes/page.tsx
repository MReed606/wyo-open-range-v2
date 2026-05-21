"use client";

import { useState } from "react";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function GripesPage() {

  const [message,
    setMessage] =
    useState("");

  async function submitGripe() {

    if (!message) {
      return;
    }

    window.location.href =
      `mailto:mathewrreed88@gmail.com?subject=Wyo Open Range Gripe Sheet&body=${encodeURIComponent(message)}`;
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

          <h1 className="mb-6 text-5xl font-black text-[#111827]">
            Gripe Sheet
          </h1>

          <p className="mb-8 text-lg text-[#374151]">
            Report bugs, issues, complaints,
            suggestions, or platform concerns
            directly to site administration.
          </p>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            rows={10}
            placeholder="Explain your issue..."
            className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
          />

          <button
            onClick={submitGripe}
            className="mt-6 w-full rounded-2xl bg-[#2F5D50] px-8 py-5 text-xl font-black text-white"
          >
            Submit Gripe
          </button>

        </div>

      </main>
    </>
  );
}
