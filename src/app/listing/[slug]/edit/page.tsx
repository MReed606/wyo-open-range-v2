"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EditListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function EditListingPage({ params }: EditListingPageProps) {
  const [listingId, setListingId] = useState("");
  const [originalSlug, setOriginalSlug] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Loading listing...");

  useEffect(() => {
    async function loadListing() {
      const { slug } = await params;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("slug", slug)
        .eq("owner_id", user.id)
        .single();

      if (error || !data) {
        setStatus("Listing not found or you do not own this listing.");
        return;
      }

      setListingId(data.id);
      setOriginalSlug(data.slug);
      setTitle(data.title ?? "");
      setPrice(data.price ?? "");
      setCategory(data.category ?? "Vehicles");
      setCondition(data.condition ?? "Good");
      setCity(data.city ?? "Cheyenne");
      setRegion(data.region ?? "Southeast");
      setDescription(data.description ?? "");
      setStatus("");
    }

    loadListing();
  }, [params]);

  async function saveListing() {
    setStatus("Saving changes...");

    const { error } = await supabase
      .from("listings")
      .update({
        title,
        price,
        category,
        condition,
        city,
        region,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId);

    if (error) {
      setStatus(error.message);
      return;
    }

    window.location.href = `/listing/${originalSlug}`;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1F2933]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#2F5D50]">
            Edit Listing
          </p>

          <h1 className="mt-3 text-5xl font-bold text-[#1F2933]">
            Update Your Listing
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {status && (
          <div className="mb-6 rounded-2xl bg-white p-5 font-semibold text-[#1F2933] shadow-md">
            {status}
          </div>
        )}

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                Title
              </span>
              <input
                className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                Price
              </span>
              <input
                className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  Category
                </span>
                <input
                  className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  Condition
                </span>
                <input
                  className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
                  value={condition}
                  onChange={(event) => setCondition(event.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  City
                </span>
                <input
                  className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  Region
                </span>
                <input
                  className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                Description
              </span>
              <textarea
                className="min-h-40 rounded-xl border border-gray-300 px-4 py-3 font-medium text-[#111827]"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>

            <button
              onClick={saveListing}
              className="rounded-xl bg-[#2F5D50] px-5 py-3 text-lg font-bold text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
