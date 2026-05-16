"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  first_name: string | null;
  public_slug: string | null;
  account_type: string | null;
  reputation_score: number | null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listingCount, setListingCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email ?? null);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, public_slug, account_type, reputation_score")
        .eq("id", user.id)
        .single();

      const { count: myListingsCount } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user.id);

      const { count: mySavedCount } = await supabase
        .from("saved_listings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setProfile(profileData);
      setListingCount(myListingsCount ?? 0);
      setSavedCount(mySavedCount ?? 0);
      setLoading(false);
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-md">
          <h1 className="text-3xl font-bold text-[#1F2933]">
            Loading dashboard...
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
            Logged In
          </p>

          <h1 className="mt-4 text-5xl font-bold text-[#1F2933]">
            Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}
          </h1>

          <p className="mt-4 text-lg text-[#52606D]">{email}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              Account Type
            </p>
            <p className="mt-3 text-2xl font-bold text-[#1F2933]">
              {profile?.account_type ?? "standard"}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              My Listings
            </p>
            <p className="mt-3 text-2xl font-bold text-[#1F2933]">
              {listingCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              Saved Listings
            </p>
            <p className="mt-3 text-2xl font-bold text-[#1F2933]">
              {savedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              Status
            </p>
            <p className="mt-3 text-2xl font-bold text-[#2F5D50]">
              Active
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <Link
            href="/dashboard/listings"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-[#1F2933]">
              Manage Listings
            </h2>
            <p className="mt-3 text-[#52606D]">
              Edit, delete, or mark your listings as sold.
            </p>
          </Link>

          <Link
            href="/saved"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-[#1F2933]">
              Saved Listings
            </h2>
            <p className="mt-3 text-[#52606D]">
              View listings you saved for later.
            </p>
          </Link>

          <Link
            href="/post"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-[#1F2933]">
              Post New Listing
            </h2>
            <p className="mt-3 text-[#52606D]">
              Create a new marketplace listing with photos.
            </p>
          </Link>

          <Link
            href="/messages"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-[#1F2933]">
              Messages
            </h2>
            <p className="mt-3 text-[#52606D]">
              View buyer and seller conversations.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
