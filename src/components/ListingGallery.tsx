"use client";

import { useState } from "react";

export function ListingGallery({
  images,
}: {
  images: string[];
}) {
  const [selected, setSelected] = useState(
    images?.[0] ?? ""
  );

  if (!images?.length) {
    return null;
  }

  return (
    <div>

      {/* MAIN IMAGE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black/5">

        <img
          src={selected}
          alt="Listing"
          className="h-[420px] w-full object-contain"
        />

      </div>

      {/* THUMBNAILS */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">

        {images.map((image, index) => (

          <button
            key={index}
            onClick={() => setSelected(image)}
            className={`overflow-hidden rounded-xl border-2 transition ${
              selected === image
                ? "border-[#2F5D50]"
                : "border-transparent"
            }`}
          >

            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="h-20 w-20 object-cover"
            />

          </button>

        ))}

      </div>

    </div>
  );
}
