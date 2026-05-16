"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string;
  slug: string;
  price: string | null;
  city: string | null;
  region: string | null;
  seller_label: string | null;
  condition: string | null;
  image_url: string | null;
  category: string | null;
  description: string | null;
  created_at: string;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sort, setSort] = useState("newest");
  const [status, setStatus] = useState("Loading listings...");

  useEffect(() => {
    async function loadListings() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        setStatus(error.message);
        return;
      }

      setListings(data ?? []);
      setFiltered(data ?? []);
      setStatus("");
    }

    loadListings();
  }, []);

  useEffect(() => {
    let results = [...listings];

    if (search) {
      results = results.filter((listing) =>
        `${listing.title} ${listing.description ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      results = results.filter(
        (listing) => listing.category === category
      );
    }

    if (region !== "All") {
      results = results.filter(
        (listing) => listing.region === region
      );
    }

    if (condition !== "All") {
      results = results.filter(
        (listing) => listing.condition === condition
      );
    }

    if (sort === "newest") {
      results.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
    }

    if (sort === "oldest") {
      results.sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );
    }

    setFiltered(results);
  }, [search, category, region, condition, sort, listings]);

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#2F5D50]">
            Marketplace
          </p>

          <h1 className="mt-3 text-5xl font-bold text-[#1F2933]">
            Browse Listings
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-[#52606D]">
            Search, filter, and discover listings across Wyoming.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-md lg:grid-cols-5">
          <input
            placeholder="Search listings..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
          >
            <option>All</option>
            <option>Vehicles</option>
            <option>Ranch & Ag</option>
            <option>Local Services</option>
            <option>General Marketplace</option>
          </select>

          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
          >
            <option>All</option>
            <option>Southeast</option>
            <option>South Central</option>
            <option>Northeast</option>
            <option>Northwest</option>
          </select>

          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
          >
            <option>All</option>
            <option>New</option>
            <option>Like New</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Service</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {status && (
          <div className="mt-6 rounded-2xl bg-white p-6 font-semibold text-[#1F2933] shadow-md">
            {status}
          </div>
        )}

        {!status && (
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1F2933]">
              {filtered.length} Listings Found
            </h2>
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              title={listing.title}
              price={listing.price ?? "Contact"}
              location={`${listing.city ?? "Wyoming"} • ${listing.region ?? "Statewide"}`}
              seller={listing.seller_label ?? "Seller"}
              slug={listing.slug}
              condition={listing.condition ?? "Used"}
              imageUrl={listing.image_url ?? ""}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
