"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { containsProfanity } from "@/lib/safety";

export default function PostPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [category,
    setCategory] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [images, setImages] =
    useState<string[]>([]);

  async function uploadImages(
    files: FileList | null
  ) {

    if (!files) return;

    const uploaded: string[] = [];

    for (const file of Array.from(files)) {

      const filename =
        `${Date.now()}-${file.name}`;

      const { error } =
        await supabase.storage
          .from("listing-images")
          .upload(
            filename,
            file
          );

      if (error) {

        console.log(error);

        continue;
      }

      const {
        data: publicUrl
      } = supabase.storage
        .from("listing-images")
        .getPublicUrl(
          filename
        );

      uploaded.push(
        publicUrl.publicUrl
      );
    }

    setImages(uploaded);
  }

  async function createListing(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // =====================================
    // PROFANITY FILTER
    // =====================================
    if (
      containsProfanity(title) ||
      containsProfanity(description)
    ) {

      alert(
        "Listing contains blocked words."
      );

      setLoading(false);

      return;
    }

    const slug =
      title
        .toLowerCase()
        .replaceAll(" ", "-")
        + "-"
        + Date.now();

    await supabase
      .from("listings")
      .insert({
        owner_id: user.id,

        title,
        description,

        price:
          Number(price),

        category,
        region,

        status: "active",

        image_url:
          images?.[0] ?? null,

        images,

        slug,
      });

    router.push(
      "/dashboard"
    );
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">

          <h1 className="text-5xl font-black text-[#111827]">
            Create Listing
          </h1>

          <form
            onSubmit={createListing}
            className="mt-8 space-y-5"
          >

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Listing Title"
              required
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg text-[#111827]"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Description"
              required
              className="min-h-40 w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg text-[#111827]"
            />

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              placeholder="Price"
              required
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg text-[#111827]"
            />

            <input
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              placeholder="Category"
              required
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg text-[#111827]"
            />

            <input
              value={region}
              onChange={(e) =>
                setRegion(
                  e.target.value
                )
              }
              placeholder="Region"
              required
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg text-[#111827]"
            />

            {/* IMAGE UPLOAD */}

            <div className="rounded-3xl border border-dashed border-gray-300 p-6">

              <h2 className="mb-4 text-2xl font-black text-[#111827]">
                Listing Images
              </h2>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  uploadImages(
                    e.target.files
                  )
                }
              />

              {!!images.length && (

                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

                  {images.map((img) => (

                    <img
                      key={img}
                      src={img}
                      alt=""
                      className="h-32 w-full rounded-2xl object-cover"
                    />

                  ))}

                </div>

              )}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#2F5D50] px-6 py-4 text-xl font-black text-white"
            >
              {loading
                ? "Creating..."
                : "Create Listing"}
            </button>

          </form>

        </div>

      </main>
    </>
  );
}
