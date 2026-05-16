"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/data/listings";

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

      const { data } = await supabase
        .from("profiles")
        .select("first_name, public_slug, account_type, reputation_score")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      }

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

          <p className="mt-4 text-lg text-[#52606D]">
            {email}
          </p>
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
              Reputation
            </p>

            <p className="mt-3 text-2xl font-bold text-[#1F2933]">
              {profile?.reputation_score ?? 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              Public Profile
            </p>

            <p className="mt-3 text-xl font-bold text-[#1F2933] break-all">
              {profile?.public_slug ?? "not-set"}
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

        <h2 className="mt-12 text-3xl font-bold text-[#1F2933]">
          Suggested Listings
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(0, 3).map((listing) => (
            <ListingCard
              key={listing.slug}
              title={listing.title}
              price={listing.price}
              location={listing.location}
              seller={listing.seller}
              slug={listing.slug}
              condition={listing.condition}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
