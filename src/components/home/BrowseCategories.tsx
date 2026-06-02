import Link from "next/link";

import { categories } from "@/data/categories";

export function BrowseCategories() {
  return (
    <section className="mt-24">
      <div className="mb-8">
        <h2 className="text-4xl font-black text-[#111827]">
          Browse Categories
        </h2>

        <p className="mt-3 text-lg text-[#6B7280]">
          Explore listings across Wyoming by category.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/listings?category=${encodeURIComponent(category)}`}
            className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-xl font-black text-[#111827] group-hover:text-[#2F5D50]">
              {category}
            </h3>

            <p className="mt-2 text-sm text-[#6B7280]">
              Browse listings in this category
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
