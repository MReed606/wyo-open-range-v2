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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");

  async function submitListing() {
    setStatus("Saving listing...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("You must be logged in.");
      return;
    }

    const baseSlug = createSlug(title);
    const uniqueSlug = `${baseSlug}-${Date.now()
      .toString()
      .slice(-5)}`;

    const uploadedUrls: string[] = [];

    for (const imageFile of imageFiles) {
      const imageName = `${Date.now()}-${Math.random()}-${imageFile.name}`;

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

      uploadedUrls.push(publicUrl);
    }

    const primaryImage = uploadedUrls[0] ?? "";

    const { data: listingData, error } = await supabase
      .from("listings")
      .insert({
        owner_id: user.id,
        title,
        slug: uniqueSlug,
        description,
        price,
        category,
        condition,
        city,
        region,
        image_url: primaryImage,
        seller_label: "Verified Seller",
        status: "active",
      })
      .select()
      .single();

    if (error || !listingData) {
      setStatus(error?.message ?? "Failed to create listing.");
      return;
    }

    if (uploadedUrls.length > 0) {
      const imageRows = uploadedUrls.map((url) => ({
        listing_id: listingData.id,
        image_url: url,
      }));

      await supabase
        .from("listing_images")
        .insert(imageRows);
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
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="grid gap-5">
            <input
              placeholder="Listing title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3"
            >
              <option>Vehicles</option>
              <option>Ranch & Ag</option>
              <option>Local Services</option>
              <option>General Marketplace</option>
            </select>

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3"
            >
              <option>New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Service</option>
            </select>

            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-40 rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setImageFiles(
                  e.target.files
                    ? Array.from(e.target.files)
                    : []
                )
              }
              className="rounded-xl border border-gray-300 px-4 py-3"
            />

            <button
              onClick={submitListing}
              className="rounded-xl bg-[#2F5D50] px-5 py-3 text-lg font-bold text-white"
            >
              Publish Listing
            </button>

            {status && (
              <div className="rounded-xl bg-[#F3F4F6] p-4 font-semibold">
                {status}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
