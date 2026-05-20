"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin";

export default function VerificationPage() {

  const router = useRouter();

  const [profiles, setProfiles] =
    useState<any[]>([]);

  useEffect(() => {

    checkAdmin();

    loadProfiles();

  }, []);

  async function checkAdmin() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !isAdminEmail(
        user?.email
      )
    ) {

      router.push("/");

    }

  }

  async function loadProfiles() {

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "verification_submitted",
          true
        )
        .eq(
          "verified",
          false
        );

    // =====================================
    // REMOVE ADMINS FROM QUEUE
    // =====================================
    const filtered =
      (data ?? []).filter(
        (profile) =>
          !isAdminEmail(
            profile.email
          )
      );

    setProfiles(filtered);
  }

  async function verifyUser(
    userId: string
  ) {

    const confirmed =
      confirm(
        "Verify this user?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from("profiles")
        .update({
          verified: true
        })
        .eq("id", userId);

    console.log(error);

    if (error) {

      alert(
        "Verification failed."
      );

      return;
    }

    alert(
      "User verified."
    );

    loadProfiles();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Verification Queue
      </h1>

      {!profiles.length && (

        <div className="rounded-3xl bg-white p-10 shadow-sm">

          <h2 className="text-2xl font-black text-[#111827]">
            No pending verifications
          </h2>

        </div>

      )}

      <div className="space-y-6">

        {profiles.map((profile) => (

          <div
            key={profile.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >

            <div className="flex flex-wrap items-start justify-between gap-6">

              <div>

                <h2 className="text-3xl font-black text-[#111827]">

                  {profile.full_name ??
                    "Unnamed User"}

                </h2>

                <div className="mt-4 space-y-2 text-[#374151]">

                  <p>
                    {profile.email ??
                      "No email"}
                  </p>

                  <p>
                    {profile.phone ??
                      "No phone"}
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  verifyUser(
                    profile.id
                  )
                }
                className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-black text-white"
              >
                Verify User
              </button>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
