"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

export default function PostListingPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Vehicles");
  const [condition, setCondition] = useState("Good");
  const [city, setCity] = useState("Cheyenne");
  const [region, setRegion] = useState("Southeast");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function submitListing() {
    setStatus("Saving listing...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("You must be logged in to post a listing.");
      return;
    }

    let imageUrl = "";

    if (imageFile) {
      const imageName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(imageName, imageFile);

      if (uploadError) {
        setStatus(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("listing-images")
        .getPublicUrl(imageName);

      imageUrl = publicUrl;
    }

    const baseSlug = createSlug(title);
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

    const { error } = await supabase.from("listings").insert({
      owner_id: user.id,
      title,
      slug: uniqueSlug,
      description,
      price,
      category,
      condition,
      city,
      region,
      image_url: imageUrl,
      seller_label: "Verified Seller",
      status: "active",
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    window.location.href = `/listing/${uniqueSlug}`;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1F2933]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#2F5D50]">
            Create Listing
          </p>

          <h1 className="mt-3 text-5xl font-bold text-[#1F2933]">
            Post a Real Listing
          </h1>

          <p className="mt-4 max-w-3xl text-lg font-medium text-[#374151]">
            Listings now support real image uploads using Supabase Storage.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-3xl font-bold text-[#1F2933]">
            Listing Details
          </h2>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                Title
              </span>

              <input
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-[#111827]"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: 2019 Ford F-350 Lariat"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                Price
              </span>

              <input
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-[#111827]"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="$42,500"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  Category
                </span>

                <select
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-[#111827]"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option>Vehicles</option>
                  <option>Firearms & Outdoors</option>
                  <option>Ranch & Ag</option>
                  <option>Local Services</option>
                  <option>General Marketplace</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  Condition
                </span>

                <select
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-[#111827]"
                  value={condition}
                  onChange={(event) => setCondition(event.target.value)}
                >
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Parts/Repair</option>
                  <option>Service</option>
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  City
                </span>

                <input
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-[#111827]"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  Region
                </span>

                <input
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-[#111827]"
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
                className="min-h-40 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-[#111827]"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the item, condition, location, and details..."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                Listing Image
              </span>

              <input
                type="file"
                accept="image/*"
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-[#111827]"
                onChange={(event) => {
                  if (event.target.files?.[0]) {
                    setImageFile(event.target.files[0]);
                  }
                }}
              />
            </label>

            <button
              onClick={submitListing}
              className="rounded-xl bg-[#2F5D50] px-5 py-3 text-lg font-bold text-white transition hover:bg-[#24493f]"
            >
              Publish Listing
            </button>

            {status && (
              <div className="rounded-xl bg-[#F3F4F6] p-4 font-semibold text-[#111827]">
                {status}
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold text-[#1F2933]">
            Image Upload Enabled
          </h2>

          <p className="mt-4 text-base font-medium leading-7 text-[#374151]">
            Uploaded images are now stored in Supabase Storage and attached to listings automatically.
          </p>
        </aside>
      </section>
    </main>
  );
}
