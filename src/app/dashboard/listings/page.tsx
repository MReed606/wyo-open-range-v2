"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string;
  slug: string;
  price: string | null;
  city: string | null;
  region: string | null;
  status: string | null;
  image_url: string | null;
};

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [status, setStatus] = useState("Loading your listings...");

  async function loadListings() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("listings")
      .select("id,title,slug,price,city,region,status,image_url")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    setListings(data ?? []);
    setStatus("");
  }

  async function markSold(id: string) {
    const { error } = await supabase
      .from("listings")
      .update({ status: "sold" })
      .eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    loadListings();
  }

  async function deleteListing(id: string) {
    const confirmed = window.confirm("Delete this listing?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    loadListings();
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#2F5D50]">
            Seller Tools
          </p>

          <h1 className="mt-3 text-5xl font-bold text-[#1F2933]">
            My Listings
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-[#52606D]">
            Manage your active, sold, and removed marketplace listings.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {status && (
          <div className="rounded-2xl bg-white p-6 font-semibold text-[#1F2933] shadow-md">
            {status}
          </div>
        )}

        {!status && listings.length === 0 && (
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#1F2933]">
              No listings yet
            </h2>

            <p className="mt-3 text-[#52606D]">
              Post your first listing to start selling on Wyo Open Range.
            </p>

            <Link
              href="/post"
              className="mt-6 inline-flex rounded-xl bg-[#2F5D50] px-5 py-3 font-semibold text-white"
            >
              Post Listing
            </Link>
          </div>
        )}

        <div className="grid gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="grid gap-5 rounded-2xl bg-white p-5 shadow-md md:grid-cols-[180px_1fr_auto]"
            >
              <div className="h-36 overflow-hidden rounded-xl bg-gradient-to-br from-[#2F5D50] to-[#1F2933]">
                {listing.image_url && (
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
                  {listing.status}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#1F2933]">
                  {listing.title}
                </h2>

                <p className="mt-2 text-lg font-bold text-[#2F5D50]">
                  {listing.price ?? "Contact"}
                </p>

                <p className="mt-2 text-[#52606D]">
                  {listing.city ?? "Wyoming"} • {listing.region ?? "Statewide"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 md:flex-col">
                <Link
                  href={`/listing/${listing.slug}`}
                  className="rounded-xl border border-[#2F5D50] px-4 py-2 text-center text-sm font-bold text-[#2F5D50]"
                >
                  View
                </Link>

                <Link
                  href={`/listing/${listing.slug}/edit`}
                  className="rounded-xl bg-[#2F5D50] px-4 py-2 text-center text-sm font-bold text-white"
                >
                  Edit
                </Link>

                <button
                  onClick={() => markSold(listing.id)}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-[#1F2933]"
                >
                  Mark Sold
                </button>

                <button
                  onClick={() => deleteListing(listing.id)}
                  className="rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
