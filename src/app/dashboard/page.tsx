"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SellerAnalytics } from "@/components/dashboard/SellerAnalytics";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardPage() {

  const [profile, setProfile] =
    useState<any>(null);

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
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-5xl">

          <div className="rounded-3xl bg-white p-8 shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-6">

              <div>

                <h1 className="text-5xl font-black text-[#111827]">

                  {profile?.full_name ??
                    "User"}

                </h1>

                <div className="mt-4 space-y-2 text-[#374151]">

                  <p>
                    {profile?.email}
                  </p>

                  <p>
                    {profile?.phone}
                  </p>

                </div>

                <div className="mt-5 flex flex-wrap gap-3">

                  {profile?.verified && (

                    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                      Verified
                    </div>

                  )}

                  {profile
                    ?.verification_submitted && (

                    <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
                      Verification Submitted
                    </div>

                  )}

                </div>

              </div>

              <div className="flex flex-wrap gap-4">

                <Link
                  href="/settings"
                  className="rounded-2xl border border-[#2F5D50] px-6 py-4 text-lg font-bold text-[#2F5D50]"
                >
                  Account Settings
                </Link>

                <Link
                  href="/saved"
                  className="rounded-2xl border border-[#2F5D50] px-6 py-4 text-lg font-bold text-[#2F5D50]"
                >
                  Saved Listings
                </Link>

                <Link
                  href="/post"
                  className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-bold text-white"
                >
                  Create Listing
                </Link>

              </div>

            </div>

          </div>

        </div>

                <SellerAnalytics />

      </main>
    </>
  );
}
