"use client";

import { useState } from "react";

export function ImageGallery({
  images,
}: {
  images: string[];
}) {

  const [selected, setSelected] =
    useState(
      images?.[0] ?? ""
    );

  if (!images?.length) {

    return (
      <div className="flex h-96 items-center justify-center rounded-3xl bg-gray-100 text-xl font-bold text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div>

      <img
        src={selected}
        alt=""
        className="h-[500px] w-full rounded-3xl object-cover"
      />

      <div className="mt-5 flex gap-3 overflow-x-auto">

        {images.map((img) => (

          <button
            key={img}
            onClick={() =>
              setSelected(img)
            }
            className={`overflow-hidden rounded-2xl border-4 ${
              selected === img
                ? "border-[#2F5D50]"
                : "border-transparent"
            }`}
          >

            <img
              src={img}
              alt=""
              className="h-24 w-24 object-cover"
            />

          </button>

        ))}

      </div>

    </div>
  );
}
