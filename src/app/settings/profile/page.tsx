"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfileSettingsPage() {

  const [profile, setProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
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

    await supabase
      .from("profiles")
      .update({
        username:
          profile.username,

        full_name:
          profile.full_name,

        phone:
          profile.phone,

        region:
          profile.region,

        bio:
          profile.bio,
      })
      .eq("id", user.id);

    alert("Profile updated.");

    setLoading(false);
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-10">

      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="text-4xl font-black text-[#111827]">
          Profile Settings
        </h1>

        <form
          onSubmit={saveProfile}
          className="mt-8 space-y-5"
        >

          <input
            value={profile.username ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                username:
                  e.target.value,
              })
            }
            placeholder="Username"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <input
            value={profile.full_name ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                full_name:
                  e.target.value,
              })
            }
            placeholder="Full Name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <input
            value={profile.phone ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                phone:
                  e.target.value,
              })
            }
            placeholder="Phone"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <input
            value={profile.region ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                region:
                  e.target.value,
              })
            }
            placeholder="Region"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <textarea
            value={profile.bio ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                bio:
                  e.target.value,
              })
            }
            placeholder="Bio"
            className="min-h-40 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-[#2F5D50] px-6 py-4 font-bold text-white"
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
