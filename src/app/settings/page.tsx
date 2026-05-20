"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SettingsPage() {

  const [loading, setLoading] =
    useState(false);

  const [profile, setProfile] =
    useState<any>(null);

  const [bio, setBio] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [avatar, setAvatar] =
    useState("");

  const [publicPhone,
    setPublicPhone] =
    useState(false);

  const [publicEmail,
    setPublicEmail] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    setProfile(data);

    setBio(data?.bio ?? "");

    setPhone(data?.phone ?? "");

    setAvatar(
      data?.avatar_url ?? ""
    );

    setPublicPhone(
      data?.public_phone ?? false
    );

    setPublicEmail(
      data?.public_email ?? false
    );
  }

  async function uploadAvatar(
    file: File
  ) {

    const filename =
      `${Date.now()}-${file.name}`;

    const { error } =
      await supabase.storage
        .from("avatars")
        .upload(
          filename,
          file
        );

    if (error) {

      console.log(error);

      return;
    }

    const {
      data: publicUrl
    } = supabase.storage
      .from("avatars")
      .getPublicUrl(
        filename
      );

    setAvatar(
      publicUrl.publicUrl
    );
  }

  async function saveSettings() {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        bio,
        phone,
        avatar_url: avatar,

        public_phone:
          publicPhone,

        public_email:
          publicEmail,
      })
      .eq("id", user.id);

    alert(
      "Profile updated."
    );

    setLoading(false);
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

          <h1 className="text-5xl font-black text-[#111827]">
            Account Settings
          </h1>

          <div className="mt-8 space-y-6">

            {/* AVATAR */}

            <div>

              <h2 className="mb-4 text-2xl font-black tracking-tight text-[#111827]">
                Profile Photo
              </h2>

              {avatar && (

                <img
                  src={avatar}
                  alt=""
                  className="mb-5 h-40 w-40 rounded-full object-cover"
                />

              )}

              <input
                type="file"
                className="block w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827] file:mr-4 file:rounded-xl file:border-0 file:bg-[#2F5D50] file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-[#24473d]"
                accept="image/*"
                onChange={(e) => {

                  const file =
                    e.target.files?.[0];

                  if (file) {

                    uploadAvatar(
                      file
                    );

                  }

                }}
              />

            </div>

            {/* BIO */}

            <div>

              <h2 className="mb-4 text-2xl font-black tracking-tight text-[#111827]">
                Seller Bio
              </h2>

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(
                    e.target.value
                  )
                }
                placeholder="Tell people about yourself..."
                className="min-h-40 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827] placeholder:text-gray-500"
              />

            </div>

            {/* PHONE */}

            <div>

              <h2 className="mb-4 text-2xl font-black tracking-tight text-[#111827]">
                Contact Number
              </h2>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="Phone Number"
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827] placeholder:text-gray-500"
              />

            </div>

            
            {/* PRIVACY */}

            <div className="rounded-3xl border border-gray-200 p-6">

              <h2 className="mb-6 text-2xl font-black tracking-tight text-[#111827]">
                Public Contact Settings
              </h2>

              <div className="space-y-5">

                <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

                  <input
                    type="checkbox"
                    checked={publicPhone}
                    onChange={(e) =>
                      setPublicPhone(
                        e.target.checked
                      )
                    }
                  />

                  Show phone number publicly

                </label>

                <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

                  <input
                    type="checkbox"
                    checked={publicEmail}
                    onChange={(e) =>
                      setPublicEmail(
                        e.target.checked
                      )
                    }
                  />

                  Show email publicly

                </label>

              </div>

            </div>


            <button
              onClick={saveSettings}
              disabled={loading}
              className="w-full rounded-2xl bg-[#2F5D50] px-6 py-4 text-xl font-black text-white"
            >
              {loading
                ? "Saving..."
                : "Save Settings"}
            </button>

          </div>

        </div>

      </main>
    </>
  );
}
