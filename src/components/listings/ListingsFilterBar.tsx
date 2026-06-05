import {
  Search,
} from "lucide-react";

type ListingsFilterBarProps = {
  search: string;
  region: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;

  setSearch: (
    value: string
  ) => void;

  setRegion: (
    value: string
  ) => void;

  setMinPrice: (
    value: string
  ) => void;

  setMaxPrice: (
    value: string
  ) => void;

  setSortBy: (
    value: string
  ) => void;
};

const REGIONS = [
  "Central Wyoming",
  "Northeast Wyoming",
  "Northwest Wyoming",
  "South Central Wyoming",
  "Southeast Wyoming",
  "Southwest Wyoming",
];

export function ListingsFilterBar({
  search,
  region,
  minPrice,
  maxPrice,
  sortBy,
  setSearch,
  setRegion,
  setMinPrice,
  setMaxPrice,
  setSortBy,
}: ListingsFilterBarProps) {

  return (

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

        <select
          value={region}
          onChange={(e) =>
            setRegion(
              e.target.value
            )
          }
          className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#2F5D50]"
        >

          <option value="">
            All Regions
          </option>

          {REGIONS.map((regionName) => (

            <option
              key={regionName}
              value={regionName}
            >
              {regionName}
            </option>

          ))}

        </select>

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

  );
}