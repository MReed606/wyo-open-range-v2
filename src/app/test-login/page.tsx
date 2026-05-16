"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function TestLoginPage() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");

  async function login() {
    if (!username.trim()) {
      setStatus("Enter a username.");
      return;
    }

    setStatus("Creating test account...");

    const email = `${createSlug(username)}@test.local`;
    const password = "testpassword123";

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (
      signUpError &&
      !signUpError.message.toLowerCase().includes("already")
    ) {
      setStatus(signUpError.message);
      return;
    }

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      setStatus(signInError.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5F2] px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#2F5D50]">
          Testing Access
        </p>

        <h1 className="mt-3 text-4xl font-bold text-[#1F2933]">
          Quick Test Login
        </h1>

        <p className="mt-4 text-[#52606D]">
          Enter any username to create or access a testing account.
        </p>

        <div className="mt-8 grid gap-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <button
            onClick={login}
            className="rounded-xl bg-[#2F5D50] px-5 py-3 text-lg font-bold text-white"
          >
            Enter Marketplace
          </button>

          {status && (
            <div className="rounded-xl bg-[#F3F4F6] p-4 font-semibold text-[#111827]">
              {status}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
