"use client";

import { useState } from "react";

type ListingGalleryProps = {
  title: string;
  images: string[];
};

export function ListingGallery({
  title,
  images,
}: ListingGalleryProps) {
  const fallback =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

  const allImages =
    images.length > 0 ? images : [fallback];

  const [activeImage, setActiveImage] = useState(allImages[0]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-[#D1D5DB]">
        <img
          src={activeImage}
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute bottom-5 left-5 rounded-xl bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
          {title}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {allImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            onClick={() => setActiveImage(image)}
            className={`overflow-hidden rounded-xl border-2 transition ${
              activeImage === image
                ? "border-[#2F5D50]"
                : "border-transparent"
            }`}
          >
            <img
              src={image}
              alt={`${title} ${index + 1}`}
              className="h-24 w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
