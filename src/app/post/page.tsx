"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PostPage() {

  const [title, setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [price,
    setPrice] =
    useState("");

  const [category,
    setCategory] =
    useState("");

  const [region,
    setRegion] =
    useState("");

  const [categories,
    setCategories] =
    useState<string[]>([]);

  const [regions,
    setRegions] =
    useState<string[]>([]);

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {
    loadFilters();
  }, []);

  async function loadFilters() {

    const {
      data: listings
    } = await supabase
      .from("listings")
      .select("category, region");

    if (!listings) return;

    const uniqueCategories =
      Array.from(
        new Set(
          listings
            .map(
              (x) => x.category
            )
            .filter(Boolean)
        )
      );

    const uniqueRegions =
      Array.from(
        new Set(
          listings
            .map(
              (x) => x.region
            )
            .filter(Boolean)
        )
      );

    setCategories(
      uniqueCategories as string[]
    );

    setRegions(
      uniqueRegions as string[]
    );
  }

  async function createListing() {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      alert(
        "Login required."
      );

      setLoading(false);

      return;
    }

    const slug =
      title
        .toLowerCase()
        .replaceAll(" ", "-")
        .replace(
          /[^a-z0-9-]/g,
          ""
        ) +
      "-" +
      Date.now();

    const { error } =
      await supabase
        .from("listings")
        .insert({
          title,
          description,
          price,
          category,
          region,
          slug,
          owner_id: user.id,
        });

    setLoading(false);

    if (error) {

      console.log(error);

      alert(
        "Failed to create listing."
      );

      return;
    }

    window.location.href =
      "/dashboard/listings";
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-12">

      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="mb-8 text-4xl font-black text-[#111827]">
          Create Listing
        </h1>

        <div className="space-y-6">

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Listing Title"
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Description"
            className="min-h-40 w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
          />

          <input
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="Price"
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
          >

            <option value="">
              Select Category
            </option>

            {categories.map((cat) => (

              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>

            ))}

          </select>

          <select
            value={region}
            onChange={(e) =>
              setRegion(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
          >

            <option value="">
              Select Region
            </option>

            {regions.map((reg) => (

              <option
                key={reg}
                value={reg}
              >
                {reg}
              </option>

            ))}

          </select>

          <button
            onClick={createListing}
            disabled={loading}
            className="w-full rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-black text-white transition hover:bg-[#24473d]"
          >
            {loading
              ? "Creating..."
              : "Create Listing"}
          </button>

        </div>

      </div>

    </main>
  );
}