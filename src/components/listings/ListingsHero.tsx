import {
  Brain,
} from "lucide-react";

type ListingsHeroProps = {
  category: string | null;
  savingSearch: boolean;
  onSaveSearch: () => void;
};

export function ListingsHero({
  category,
  savingSearch,
  onSaveSearch,
}: ListingsHeroProps) {

  return (

    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

      <div className="w-full md:w-auto">

        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-black text-[#2F5D50]">

          <Brain className="h-4 w-4" />

          AI Marketplace Search

        </div>

        <h1 className="text-3xl font-black text-[#111827] md:text-5xl">

          {category
            ? `${category} Listings`
            : "Marketplace Listings"}

        </h1>

        <p className="mt-4 text-base text-[#6B7280] md:text-lg">

          Adaptive AI-powered discovery across Wyoming.

        </p>

      </div>

      <button
        onClick={onSaveSearch}
        disabled={savingSearch}
        className="w-full rounded-2xl bg-[#2F5D50] px-6 py-4 text-sm font-black text-white transition hover:bg-[#24473d] disabled:opacity-50 md:w-auto"
      >

        {savingSearch
          ? "Saving..."
          : "Save Search"}

      </button>

    </div>

  );
}