"use client";

type Props = {
  category: string;
  region: string;
  setCategory: (v: string) => void;
  setRegion: (v: string) => void;
};

const categories = [
  "Livestock",
  "Equipment",
  "Vehicles",
  "Hay",
  "Land",
  "Housing",
  "Services",
  "Firearms",
  "Misc",
];

const regions = [
  "Cheyenne",
  "Laramie",
  "Casper",
  "Gillette",
  "Sheridan",
  "Rock Springs",
  "Jackson",
  "Rawlins",
  "Other",
];

export function MarketplaceFilters({
  category,
  region,
  setCategory,
  setRegion,
}: Props) {

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <h2 className="text-3xl font-black text-[#111827]">
        Filters
      </h2>

      {/* CATEGORY */}

      <div className="mt-8">

        <h3 className="mb-4 text-xl font-black text-[#111827]">
          Category
        </h3>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() =>
              setCategory("")
            }
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              !category
                ? "bg-[#2F5D50] text-white"
                : "bg-gray-100 text-[#111827]"
            }`}
          >
            All
          </button>

          {categories.map((c) => (

            <button
              key={c}
              onClick={() =>
                setCategory(c)
              }
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                category === c
                  ? "bg-[#2F5D50] text-white"
                  : "bg-gray-100 text-[#111827]"
              }`}
            >
              {c}
            </button>

          ))}

        </div>

      </div>

      {/* REGION */}

      <div className="mt-10">

        <h3 className="mb-4 text-xl font-black text-[#111827]">
          Region
        </h3>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() =>
              setRegion("")
            }
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              !region
                ? "bg-[#2F5D50] text-white"
                : "bg-gray-100 text-[#111827]"
            }`}
          >
            All
          </button>

          {regions.map((r) => (

            <button
              key={r}
              onClick={() =>
                setRegion(r)
              }
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                region === r
                  ? "bg-[#2F5D50] text-white"
                  : "bg-gray-100 text-[#111827]"
              }`}
            >
              {r}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}
