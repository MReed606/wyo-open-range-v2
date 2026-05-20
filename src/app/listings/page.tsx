"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ListingsPage() {

  const [listings, setListings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [sort, setSort] =
    useState("newest");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  useEffect(() => {
    loadListings();
  }, [
    search,
    category,
    region,
    sort,
    minPrice,
    maxPrice,
  ]);

  async function loadListings() {

    setLoading(true);

    let query = supabase
      .from("listings")
      .select("*")
      .neq("status", "removed")
      .neq("hidden_by_system", true);

    // =====================================
    // SEARCH
    // =====================================
    if (search.trim()) {

      query = query.ilike(
        "title",
        `%${search}%`
      );

    }

    // =====================================
    // CATEGORY
    // =====================================
    if (category) {

      query = query.eq(
        "category",
        category
      );

    }

    // =====================================
    // REGION
    // =====================================
    if (region.trim()) {

      query = query.ilike(
        "region",
        `%${region}%`
      );

    }

    // =====================================
    // MIN PRICE
    // =====================================
    if (minPrice) {

      query = query.gte(
        "price",
        Number(minPrice)
      );

    }

    // =====================================
    // MAX PRICE
    // =====================================
    if (maxPrice) {

      query = query.lte(
        "price",
        Number(maxPrice)
      );

    }

    // =====================================
    // SORTING
    // =====================================
    if (sort === "price_low") {

      query = query.order(
        "price",
        {
          ascending: true,
        }
      );

    } else if (
      sort === "price_high"
    ) {

      query = query.order(
        "price",
        {
          ascending: false,
        }
      );

    } else {

      query = query.order(
        "created_at",
        {
          ascending: false,
        }
      );

    }

    const { data } =
      await query;

    setListings(data ?? []);

    setLoading(false);
  }

  const categories = [
    "Vehicles",
    "Livestock",
    "Equipment",
    "Housing",
    "Services",
    "Jobs",
  ];

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-black text-[#111827]">
            Marketplace Listings
          </h1>

          <p className="mt-4 text-xl text-[#374151]">
            Discover listings across Wyoming.
          </p>

        </div>

        {/* FILTERS */}
        <div className="mb-10 rounded-3xl bg-white p-6 shadow-sm">

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search listings..."
              className="rounded-2xl border border-gray-300 px-5 py-4 text-[#111827]"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="rounded-2xl border border-gray-300 bg-white px-5 py-4 text-[#111827]"
            >

              <option value="">
                All Categories
              </option>

              {categories.map(
                (cat) => (

                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>

              ))}

            </select>

            <input
              value={region}
              onChange={(e) =>
                setRegion(
                  e.target.value
                )
              }
              placeholder="Region"
              className="rounded-2xl border border-gray-300 px-5 py-4 text-[#111827]"
            />

            <input
              type="number"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(
                  e.target.value
                )
              }
              placeholder="Min Price"
              className="rounded-2xl border border-gray-300 px-5 py-4 text-[#111827]"
            />

            <input
              type="number"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  e.target.value
                )
              }
              placeholder="Max Price"
              className="rounded-2xl border border-gray-300 px-5 py-4 text-[#111827]"
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
              className="rounded-2xl border border-gray-300 bg-white px-5 py-4 text-[#111827]"
            >

              <option value="newest">
                Newest
              </option>

              <option value="price_low">
                Price: Low to High
              </option>

              <option value="price_high">
                Price: High to Low
              </option>

            </select>

          </div>

        </div>

        {/* LOADING */}
        {loading && (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <h2 className="text-2xl font-black text-[#111827]">
              Loading listings...
            </h2>

          </div>

        )}

        {/* EMPTY */}
        {!loading &&
          !listings.length && (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <h2 className="text-3xl font-black text-[#111827]">
              No listings found
            </h2>

            <p className="mt-4 text-lg text-[#374151]">
              Try adjusting your filters or search terms.
            </p>

          </div>

        )}

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {listings.map((listing) => (

            <Link
              key={listing.id}
              href={`/listing/${listing.slug}`}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {listing.image_url && (

                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="h-56 w-full object-cover"
                />

              )}

              <div className="p-6">

                <h2 className="text-2xl font-black text-[#111827]">
                  {listing.title}
                </h2>

                {listing.category && (

                  <div className="mt-3 inline-flex rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-bold text-[#2F5D50]">
                    {listing.category}
                  </div>

                )}

                {listing.region && (

                  <div className="mt-3 text-sm font-semibold text-gray-500">
                    {listing.region}
                  </div>

                )}

                <p className="mt-5 text-3xl font-black text-[#2F5D50]">
                  ${listing.price ?? "Contact"}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}
