import {
  Sparkles
} from "lucide-react";

import {
  ImageUploader
} from "@/components/post/ImageUploader";

import type React from "react";

type PostListingFormProps = {
  title: string;
  description: string;
  price: string;
  category: string;
  region: string;
  images: string[];
  categories: string[];
  regions: string[];
  loading: boolean;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setPrice: (value: string) => void;
  setCategory: (value: string) => void;
  setRegion: (value: string) => void;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  onCreateListing: () => void;
};

export function PostListingForm({
  title,
  description,
  price,
  category,
  region,
  images,
  categories,
  regions,
  loading,
  setTitle,
  setDescription,
  setPrice,
  setCategory,
  setRegion,
  setImages,
  onCreateListing,
}: PostListingFormProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <Sparkles className="h-7 w-7 text-[#2F5D50]" />

        <h2 className="text-3xl font-black text-[#111827]">
          Listing Details
        </h2>
      </div>

      <div className="space-y-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Listing Title"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="min-h-40 w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          onChange={(e) => setRegion(e.target.value)}
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

        <ImageUploader
          images={images}
          setImages={setImages}
        />

        <button
          onClick={onCreateListing}
          disabled={loading}
          className="w-full rounded-2xl bg-[#2F5D50] px-6 py-5 text-lg font-black text-white transition hover:bg-[#24473d] disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Create Listing"}
        </button>
      </div>
    </div>
  );
}
