"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PostPage() {

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const uploadedUrls: string[] = [];

    // =========================================
    // MULTI IMAGE UPLOAD
    // =========================================
    if (images) {

      for (const image of Array.from(images)) {

        const fileName = `${Date.now()}-${image.name}`;

        const { error } = await supabase.storage
          .from("listing-images")
          .upload(fileName, image);

        if (!error) {

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("listing-images")
            .getPublicUrl(fileName);

          uploadedUrls.push(publicUrl);

        }

      }

    }

    // =========================================
    // CREATE SLUG
    // =========================================
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now();

    // =========================================
    // INSERT LISTING
    // =========================================
    const { error } = await supabase
      .from("listings")
      .insert({
        owner_id: user.id,
        title,
        description,
        price: price || null,
        category,
        slug,

        image_url:
          uploadedUrls[0] ?? null,

        image_urls:
          uploadedUrls,
      });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to create listing");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-10">

      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="text-4xl font-black text-[#111827]">
          Post Listing
        </h1>

        <p className="mt-3 text-lg text-[#374151]">
          Create a new marketplace listing.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
            className="min-h-40 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#111827]"
          >
            <option value="">
              Select Category
            </option>

            <option value="Vehicles">
              Vehicles
            </option>

            <option value="Livestock">
              Livestock
            </option>

            <option value="Equipment">
              Equipment
            </option>

            <option value="Housing">
              Housing
            </option>

            <option value="Services">
              Services
            </option>

            <option value="Jobs">
              Jobs
            </option>

            <option value="Businesses">
              Businesses
            </option>

            <option value="Community">
              Community
            </option>
          </select>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setImages(e.target.files)
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#111827]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#24493f]"
          >
            {loading
              ? "Posting..."
              : "Post Listing"}
          </button>

        </form>

      </div>

    </main>
  );
}