"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  Search,
  Sparkles,
  Brain,
} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";

import {
  ListingCard
} from "@/components/ListingCard";

import {
  getRecommendedListings,
} from "@/lib/recommendations";

import {
  saveSearch as saveSearchHelper
} from "@/lib/saveSearch";

import {
  searchListings
} from "@/lib/listingSearch";

const PAGE_SIZE = 12;

function ListingsContent() {

  const searchParams =
    useSearchParams();

  const category =
    searchParams.get(
      "category"
    );

  const observerRef =
    useRef<HTMLDivElement | null>(
      null
    );

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
    useState("recommended");

  const [savingSearch,
    setSavingSearch] =
    useState(false);

  // =====================================
  // FILTER KEY
  // =====================================

  const filterKey =
    useMemo(() => {

      return JSON.stringify({

        category,
        search,
        region,
        minPrice,
        maxPrice,
        sortBy,

      });

    }, [

      category,
      search,
      region,
      minPrice,
      maxPrice,
      sortBy,

    ]);

  // =====================================
  // RESET
  // =====================================

  useEffect(() => {

    resetAndReload();

  }, [filterKey]);

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
  try {
    setSavingSearch(true);

    await saveSearchHelper({
      search,
      category,
      region,
      minPrice,
      maxPrice,
    });

    alert(
      "Search saved successfully."
    );
  } catch (error: any) {
    if (
      error?.message ===
      "LOGIN_REQUIRED"
    ) {
      alert(
        "Please login first."
      );
    } else {
      console.error(
        "SAVE SEARCH ERROR:",
        error
      );

      alert(
        "Unable to save search."
      );
    }
  } finally {
    setSavingSearch(false);
  }
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

  const result =
    await searchListings({
      category,
      region,
      search,
      minPrice,
      maxPrice,
      sortBy,
      currentPage,
    });

  setHasMore(
    result.hasMore
  );

  if (replace) {
    setListings(
      result.listings
    );
  } else {
    setListings((prev) => [
      ...prev,
      ...result.listings,
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

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-black text-[#2F5D50]">

              <Brain className="h-4 w-4" />

              AI Marketplace Search

            </div>

            <h1 className="text-5xl font-black text-[#111827]">

              {category
                ? `${category} Listings`
                : "Marketplace Listings"}

            </h1>

            <p className="mt-4 text-lg text-[#6B7280]">

              Adaptive AI-powered discovery across Wyoming.

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

            <div className="relative xl:col-span-2">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search marketplace..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-5 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#2F5D50]"
              />

            </div>

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

              <option value="recommended">
                Recommended
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

          </div>

          {/* RESET */}

          <div className="mt-5 flex justify-end">

            <button
              onClick={() => {

                setSearch("");
                setRegion("");
                setMinPrice("");
                setMaxPrice("");
                setSortBy(
                  "recommended"
                );

              }}
              className="rounded-2xl bg-[#111827] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1F2937]"
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
              seller={
                listing.seller ??
                "Seller"
              }
              slug={listing.slug}
              condition={
                listing.condition ??
                "Used"
              }
              imageUrl={
                listing.image_url
              }
            />

          ))}

        </div>

        {/* EMPTY */}

        {!loading &&
          !listings.length && (

          <div className="mt-12 rounded-3xl bg-white p-12 text-center shadow-sm">

            <h2 className="text-3xl font-black text-[#111827]">

              No listings found

            </h2>

            <p className="mt-4 text-lg text-[#6B7280]">

              Try adjusting your filters or search terms.

            </p>

          </div>

        )}

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