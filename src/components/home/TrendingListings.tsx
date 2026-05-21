"use client";

import Link from "next/link";

const categories = [
  {
    name: "Vehicles",
    emoji: "🚘",
  },
  {
    name: "Livestock",
    emoji: "🐄",
  },
  {
    name: "Equipment",
    emoji: "🚜",
  },
  {
    name: "Land",
    emoji: "🌾",
  },
  {
    name: "Services",
    emoji: "🛠️",
  },
  {
    name: "Firearms",
    emoji: "🎯",
  },
  {
    name: "Trailers",
    emoji: "🚛",
  },
  {
    name: "Horses",
    emoji: "🐎",
  },
];

export function TrendingListings() {

  return (
    <section>

      <h2 className="text-4xl font-black text-[#111827]">
        Browse Categories
      </h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {categories.map((category) => (

          <Link
            key={category.name}
            href={`/listings?category=${encodeURIComponent(category.name)}`}
            className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="text-5xl">
              {category.emoji}
            </div>

            <h3 className="mt-5 text-2xl font-black text-[#111827]">
              {category.name}
            </h3>

            <p className="mt-3 text-gray-500">
              Browse {category.name.toLowerCase()} listings
            </p>

          </Link>

        ))}

      </div>

    </section>
  );
}