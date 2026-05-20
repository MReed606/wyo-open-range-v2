"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SettingsPage() {

  const [loading,
    setLoading] =
    useState(true);

  const [fullName,
    setFullName] =
    useState("");

  const [phone,
    setPhone] =
    useState("");

  const [bio,
    setBio] =
    useState("");

  const [avatar,
    setAvatar] =
    useState("");

  // =====================================
  // PRIVACY
  // =====================================

  const [publicPhone,
    setPublicPhone] =
    useState(false);

  const [publicEmail,
    setPublicEmail] =
    useState(false);

  // =====================================
  // NOTIFICATIONS
  // =====================================

  const [emailNotifications,
    setEmailNotifications] =
    useState(true);

  const [smsNotifications,
    setSmsNotifications] =
    useState(false);

  const [messageNotifications,
    setMessageNotifications] =
    useState(true);

  const [forumNotifications,
    setForumNotifications] =
    useState(true);

  const [listingNotifications,
    setListingNotifications] =
    useState(true);

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

    setFullName(
      data?.full_name ?? ""
    );

    setPhone(
      data?.phone ?? ""
    );

    setBio(
      data?.bio ?? ""
    );

    setAvatar(
      data?.avatar_url ?? ""
    );

    // =====================================
    // PRIVACY
    // =====================================

    setPublicPhone(
      data?.public_phone ?? false
    );

    setPublicEmail(
      data?.public_email ?? false
    );

    // =====================================
    // NOTIFICATIONS
    // =====================================

    setEmailNotifications(
      data?.email_notifications ?? true
    );

    setSmsNotifications(
      data?.sms_notifications ?? false
    );

    setMessageNotifications(
      data?.message_notifications ?? true
    );

    setForumNotifications(
      data?.forum_notifications ?? true
    );

    setListingNotifications(
      data?.listing_notifications ?? true
    );

    setLoading(false);
  }

  async function saveProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        full_name:
          fullName,

        phone,

        bio,

        avatar_url:
          avatar,

        // =====================================
        // PRIVACY
        // =====================================

        public_phone:
          publicPhone,

        public_email:
          publicEmail,

        // =====================================
        // NOTIFICATIONS
        // =====================================

        email_notifications:
          emailNotifications,

        sms_notifications:
          smsNotifications,

        message_notifications:
          messageNotifications,

        forum_notifications:
          forumNotifications,

        listing_notifications:
          listingNotifications,
      })
      .eq("id", user.id);

    alert(
      "Settings saved"
    );
  }

  if (loading) {

    return (
      <>
        <AuthGuard />

        <main className="min-h-screen bg-[#F7F5F2] p-10">

          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-sm">

            <h1 className="text-4xl font-black text-[#111827]">
              Loading Settings...
            </h1>

          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">

          <h1 className="mb-10 text-5xl font-black text-[#111827]">
            Account Settings
          </h1>

          <div className="space-y-8">

            {/* PROFILE */}

            <div className="space-y-5">

              <h2 className="text-2xl font-black text-[#111827]">
                Profile Information
              </h2>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                placeholder="Full name"
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
              />

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="Phone number"
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
              />

              <input
                value={avatar}
                onChange={(e) =>
                  setAvatar(
                    e.target.value
                  )
                }
                placeholder="Avatar image URL"
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
              />

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(
                    e.target.value
                  )
                }
                placeholder="Bio"
                rows={6}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
              />

            </div>

            {/* PRIVACY */}

            <div className="rounded-3xl border border-gray-200 p-6">

              <h2 className="mb-6 text-2xl font-black text-[#111827]">
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

            {/* NOTIFICATIONS */}

            <div className="rounded-3xl border border-gray-200 p-6">

              <h2 className="mb-6 text-2xl font-black text-[#111827]">
                Notification Preferences
              </h2>

              <div className="space-y-5">

                <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) =>
                      setEmailNotifications(
                        e.target.checked
                      )
                    }
                  />

                  Email Notifications

                </label>

                <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) =>
                      setSmsNotifications(
                        e.target.checked
                      )
                    }
                  />

                  SMS Notifications

                </label>

                <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

                  <input
                    type="checkbox"
                    checked={messageNotifications}
                    onChange={(e) =>
                      setMessageNotifications(
                        e.target.checked
                      )
                    }
                  />

                  New Message Alerts

                </label>

                <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

                  <input
                    type="checkbox"
                    checked={forumNotifications}
                    onChange={(e) =>
                      setForumNotifications(
                        e.target.checked
                      )
                    }
                  />

                  Forum Reply Alerts

                </label>

                <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

                  <input
                    type="checkbox"
                    checked={listingNotifications}
                    onChange={(e) =>
                      setListingNotifications(
                        e.target.checked
                      )
                    }
                  />

                  Listing Activity Alerts

                </label>

              </div>

            </div>

            {/* SAVE */}

            <button
              onClick={saveProfile}
              className="w-full rounded-2xl bg-[#2F5D50] px-8 py-5 text-xl font-black text-white"
            >
              Save Settings
            </button>

          </div>

        </div>

      </main>
    </>
  );
}
