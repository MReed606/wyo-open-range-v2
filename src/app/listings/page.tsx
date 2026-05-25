"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ListingCard } from "@/components/ListingCard";

function ListingsContent() {

  const searchParams =
    useSearchParams();

  const category =
    searchParams.get("category");

  const [listings,
    setListings] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // =====================================
  // FILTER STATES
  // =====================================

  const [search,
    setSearch] =
    useState("");

  const [region,
    setRegion] =
    useState("");

  const [minPrice,
    setMinPrice] =
    useState("");

  const [maxPrice,
    setMaxPrice] =
    useState("");

  const [sortBy,
    setSortBy] =
    useState("newest");

  useEffect(() => {
    loadListings();
  }, [
    category,
    search,
    region,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  async function loadListings() {

    setLoading(true);

    let query =
      supabase
        .from("listings")
        .select("*")
        .neq("status", "removed");

    // =====================================
    // CATEGORY
    // =====================================

    if (category) {

      query =
        query.eq(
          "category",
          category
        );
    }

    // =====================================
    // SEARCH
    // =====================================

    if (search.trim()) {

      query =
        query.ilike(
          "title",
          `%${search}%`
        );
    }

    // =====================================
    // REGION
    // =====================================

    if (region.trim()) {

      query =
        query.ilike(
          "region",
          `%${region}%`
        );
    }

    // =====================================
    // PRICE RANGE
    // =====================================

    if (minPrice) {

      query =
        query.gte(
          "price",
          minPrice
        );
    }

    if (maxPrice) {

      query =
        query.lte(
          "price",
          maxPrice
        );
    }

    // =====================================
    // SORTING
    // =====================================

    switch (sortBy) {

      case "popular":

        query =
          query.order(
            "views",
            {
              ascending: false,
            }
          );

        break;

      case "trending":

        query =
          query.order(
            "trending_score",
            {
              ascending: false,
            }
          );

        break;

      case "price_low":

        query =
          query.order(
            "price",
            {
              ascending: true,
            }
          );

        break;

      case "price_high":

        query =
          query.order(
            "price",
            {
              ascending: false,
            }
          );

        break;

      default:

        query =
          query.order(
            "created_at",
            {
              ascending: false,
            }
          );
    }

    const { data, error } =
      await query;

    if (error) {

      console.error(
        "LISTINGS ERROR:",
        error
      );

      setLoading(false);
      return;
    }

    setListings(data ?? []);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-12">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-black text-[#111827]">

            {category
              ? `${category} Listings`
              : "Marketplace Listings"}

          </h1>

          <p className="mt-4 text-lg text-[#6B7280]">
            Discover listings across Wyoming.
          </p>

        </div>

        {/* FILTER BAR */}

        <div className="mb-10 rounded-3xl bg-white p-6 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">

            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#2F5D50]"
            />

            <input
              type="text"
              placeholder="Region"
              value={region}
              onChange={(e) =>
                setRegion(
                  e.target.value
                )
              }
              className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#2F5D50]"
            />

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(
                  e.target.value
                )
              }
              className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#2F5D50]"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  e.target.value
                )
              }
              className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#2F5D50]"
            />

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#2F5D50]"
            >

              <option value="newest">
                Newest
              </option>

              <option value="popular">
                Most Viewed
              </option>

              <option value="trending">
                Trending
              </option>

              <option value="price_low">
                Price: Low to High
              </option>

              <option value="price_high">
                Price: High to Low
              </option>

            </select>

            <button
              onClick={() => {

                setSearch("");
                setRegion("");
                setMinPrice("");
                setMaxPrice("");
                setSortBy("newest");

              }}
              className="rounded-2xl bg-[#2F5D50] px-5 py-4 text-sm font-black text-white transition hover:bg-[#24473d]"
            >
              Reset Filters
            </button>

          </div>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {Array.from({
              length: 6,
            }).map((_, i) => (

              <div
                key={i}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >

                <div className="h-[240px] animate-pulse bg-gray-200" />

                <div className="p-6">

                  <div className="h-8 animate-pulse rounded bg-gray-200" />

                  <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-gray-200" />

                </div>

              </div>

            ))}

          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          !listings.length && (

          <div className="rounded-3xl bg-white p-10 shadow-sm">

            <h2 className="text-2xl font-black text-[#111827]">
              No listings found
            </h2>

            <p className="mt-3 text-[#6B7280]">
              Try adjusting your filters.
            </p>

          </div>

        )}

        {/* GRID */}

        {!loading &&
          listings.length > 0 && (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {listings.map((listing) => (

              <ListingCard
                key={listing.id}
                title={listing.title}
                price={listing.price}
                location={listing.region}
                seller={listing.seller ?? "Seller"}
                slug={listing.slug}
                condition={listing.condition ?? "Used"}
                imageUrl={listing.image_url}
              />

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default function ListingsPage() {

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F7F5F2] px-6 py-12">

          <div className="mx-auto max-w-7xl">

            <div className="rounded-3xl bg-white p-10 shadow-sm">

              <h2 className="text-2xl font-black text-[#111827]">
                Loading listings...
              </h2>

            </div>

          </div>

        </main>
      }
    >

      <ListingsContent />

    </Suspense>
  );
}