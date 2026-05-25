"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ListingCard } from "@/components/ListingCard";

const PAGE_SIZE = 12;

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

  const [loadingMore,
    setLoadingMore] =
    useState(false);

  const [hasMore,
    setHasMore] =
    useState(true);

  const [page,
    setPage] =
    useState(0);

  const observerRef =
    useRef<HTMLDivElement | null>(
      null
    );

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

  const [savingSearch,
    setSavingSearch] =
    useState(false);

  // =====================================
  // RESET WHEN FILTERS CHANGE
  // =====================================

  useEffect(() => {

    resetAndReload();

  }, [
    category,
    search,
    region,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  async function resetAndReload() {

    setListings([]);
    setPage(0);
    setHasMore(true);

    await loadListings(
      0,
      true
    );
  }

  // =====================================
  // SAVE SEARCH
  // =====================================

  async function saveSearch() {

    setSavingSearch(true);

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    if (!user) {

      alert(
        "Please login first."
      );

      setSavingSearch(false);

      return;
    }

    const { error } =
      await supabase
        .from("saved_searches")
        .insert({

          user_id:
            user.id,

          search:
            search || null,

          category:
            category || null,

          region:
            region || null,

          min_price:
            minPrice || null,

          max_price:
            maxPrice || null,

        });

    setSavingSearch(false);

    if (error) {

      console.error(
        "SAVE SEARCH ERROR:",
        error
      );

      alert(
        "Unable to save search."
      );

      return;
    }

    alert(
      "Search saved successfully."
    );
  }

  // =====================================
  // INFINITE SCROLL
  // =====================================

  useEffect(() => {

    if (!observerRef.current) {
      return;
    }

    const observer =
      new IntersectionObserver(
        async (entries) => {

          const first =
            entries[0];

          if (
            first.isIntersecting &&
            hasMore &&
            !loadingMore &&
            !loading
          ) {

            const nextPage =
              page + 1;

            setPage(nextPage);

            await loadListings(
              nextPage,
              false
            );
          }

        },
        {
          threshold: 0.25,
        }
      );

    observer.observe(
      observerRef.current
    );

    return () => {
      observer.disconnect();
    };

  }, [
    page,
    hasMore,
    loadingMore,
    loading,
  ]);

  // =====================================
  // LOAD LISTINGS
  // =====================================

  async function loadListings(
    currentPage: number,
    replace: boolean
  ) {

    if (replace) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const from =
      currentPage * PAGE_SIZE;

    const to =
      from + PAGE_SIZE - 1;

    let query =
      supabase
        .from("listings")
        .select("*")
        .neq("status", "removed")
        .range(from, to);

    // CATEGORY

    if (category) {

      query =
        query.eq(
          "category",
          category
        );
    }

    // SEARCH

    if (search.trim()) {

      query =
        query.ilike(
          "title",
          `%${search}%`
        );
    }

    // REGION

    if (region.trim()) {

      query =
        query.ilike(
          "region",
          `%${region}%`
        );
    }

    // PRICE FILTERS

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

    // SORTING

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
      setLoadingMore(false);

      return;
    }

    const newListings =
      data ?? [];

    if (
      newListings.length <
      PAGE_SIZE
    ) {

      setHasMore(false);
    }

    if (replace) {

      setListings(
        newListings
      );

    } else {

      setListings((prev) => [
        ...prev,
        ...newListings,
      ]);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-12">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">

          <div>

            <h1 className="text-5xl font-black text-[#111827]">

              {category
                ? `${category} Listings`
                : "Marketplace Listings"}

            </h1>

            <p className="mt-4 text-lg text-[#6B7280]">
              Discover listings across Wyoming.
            </p>

          </div>

          <button
            onClick={saveSearch}
            disabled={savingSearch}
            className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-sm font-black text-white transition hover:bg-[#24473d] disabled:opacity-50"
          >

            {savingSearch
              ? "Saving..."
              : "Save Search"}

          </button>

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

        {/* GRID */}

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

        {/* LOADING */}

        {loadingMore && (

          <div className="mt-10 text-center">

            <p className="text-lg font-bold text-[#6B7280]">
              Loading more listings...
            </p>

          </div>

        )}

        {/* OBSERVER */}

        <div
          ref={observerRef}
          className="h-20"
        />

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