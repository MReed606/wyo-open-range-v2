"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CompleteProfilePage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSave(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        username,
        onboarding_complete: true,
      })
      .eq("id", user.id);

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-10">

      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="text-4xl font-black text-[#111827]">
          Complete Your Profile
        </h1>

        <p className="mt-3 text-lg text-[#374151]">
          Create your marketplace identity before posting or messaging.
        </p>

        <form
          onSubmit={handleSave}
          className="mt-8 space-y-5"
        >

          <input
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Choose Username"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-bold text-white"
          >
            {loading
              ? "Saving..."
              : "Save Profile"}
          </button>

        </form>

      </div>

    </main>
  );
}
