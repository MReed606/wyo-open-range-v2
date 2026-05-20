"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function MarketplaceFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(
    params.get("search") ?? ""
  );

  const [region, setRegion] = useState(
    params.get("region") ?? ""
  );

  const [sort, setSort] = useState(
    params.get("sort") ?? "newest"
  );

  function applyFilters() {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (region) query.set("region", region);
    if (sort) query.set("sort", sort);

    router.push(`/listings?${query.toString()}`);
  }

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="grid gap-3 md:grid-cols-4">

        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
        />

        <select
          value={region}
          onChange={(e) =>
            setRegion(e.target.value)
          }
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#111827]"
        >
          <option value="">All Regions</option>
          <option value="Cheyenne">Cheyenne</option>
          <option value="Casper">Casper</option>
          <option value="Laramie">Laramie</option>
          <option value="Gillette">Gillette</option>
          <option value="Rock Springs">Rock Springs</option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#111827]"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button
          onClick={applyFilters}
          className="rounded-xl bg-[#2F5D50] px-4 py-3 font-bold text-white"
        >
          Apply Filters
        </button>

      </div>

    </div>
  );
}
