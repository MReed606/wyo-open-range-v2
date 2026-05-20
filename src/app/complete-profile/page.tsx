"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CompleteProfilePage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  useEffect(() => {
    loadExisting();
  }, []);

  async function loadExisting() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email ?? "");

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (data) {

      setFullName(
        data.full_name ?? ""
      );

      setPhone(
        data.phone ?? ""
      );

    }

  }

  async function saveProfile(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const split =
      fullName.trim().split(" ");

    const firstName =
      split[0] ?? "";

    const lastInitial =
      split.length > 1
        ? split[
            split.length - 1
          ][0]
        : "";

    await supabase
      .from("profiles")
      .upsert({
        id: user.id,

        full_name: fullName,

        first_name: firstName,

        last_initial:
          lastInitial,

        phone,

        email,

        onboarding_complete:
          true,

        verification_submitted:
          true,
      });

    router.push(
      "/dashboard"
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="text-5xl font-black text-[#111827]">
          Complete Profile
        </h1>

        <p className="mt-4 text-lg text-[#374151]">
          Verify your account identity before using the marketplace.
        </p>

        <form
          onSubmit={saveProfile}
          className="mt-8 space-y-5"
        >

          <input
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            placeholder="First Name + Last Initial"
            required
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg text-[#111827]"
          />

          <input
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Email"
            required
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg text-[#111827]"
          />

          <input
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            placeholder="Phone Number"
            required
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg text-[#111827]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#2F5D50] px-6 py-4 text-xl font-black text-white"
          >
            {loading
              ? "Saving..."
              : "Complete Profile"}
          </button>

        </form>

      </div>

    </main>
  );
}
