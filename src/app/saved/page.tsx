"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

type SavedListingRow = {
  listing_id: string;
  listings: {
    id: string;
    title: string;
    slug: string;
    price: string | null;
    city: string | null;
    region: string | null;
    seller_label: string | null;
    condition: string | null;
    image_url: string | null;
  } | null;
};

export default function SavedPage() {
  const [savedListings, setSavedListings] = useState<SavedListingRow[]>([]);
  const [status, setStatus] = useState("Loading saved listings...");

  useEffect(() => {
    async function loadSaved() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("saved_listings")
        .select(`
          listing_id,
          listings (
            id,
            title,
            slug,
            price,
            city,
            region,
            seller_label,
            condition,
            image_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setStatus(error.message);
        return;
      }

      setSavedListings((data as SavedListingRow[]) ?? []);
      setStatus("");
    }

    loadSaved();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Saved Items"
        title="Saved Listings"
        description="Listings you saved for later."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        {status && (
          <div className="rounded-2xl bg-white p-6 font-semibold text-[#1F2933] shadow-md">
            {status}
          </div>
        )}

        {!status && savedListings.length === 0 && (
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#1F2933]">
              No saved listings yet
            </h2>

            <p className="mt-3 text-[#52606D]">
              Save listings from any listing detail page and they will appear here.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((row) => {
            const listing = row.listings;
            if (!listing) return null;

            return (
              <ListingCard
                key={row.listing_id}
                title={listing.title}
                price={listing.price ?? "Contact"}
                location={`${listing.city ?? "Wyoming"} • ${listing.region ?? "Statewide"}`}
                seller={listing.seller_label ?? "Seller"}
                slug={listing.slug}
                condition={listing.condition ?? "Used"}
                imageUrl={listing.image_url ?? ""}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
