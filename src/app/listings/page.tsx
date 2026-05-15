import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/data/listings";

const categories = [
  "Vehicles",
  "Firearms & Outdoors",
  "Ranch & Ag",
  "Local Services",
  "Jobs",
  "General Marketplace",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1F2933]">
      <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#1F2933] via-[#2F5D50] to-[#C2A878] px-6 text-white">
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            Better reach. Better options. Less BS.
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Welcome to Wyoming’s Modern Marketplace
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">
            Buy, sell, trade, and connect across Wyoming with a cleaner,
            safer, community-driven marketplace.
          </p>

          <div className="mt-8 grid gap-3 rounded-2xl bg-white p-3 shadow-2xl md:grid-cols-[1fr_180px_160px_120px]">
            <input
              className="rounded-xl border px-4 py-3 text-black outline-none"
              placeholder="Search listings, businesses, or discussions..."
            />

            <select className="rounded-xl border px-4 py-3 text-black">
              <option>All Categories</option>
              <option>Vehicles</option>
              <option>Firearms & Outdoors</option>
              <option>Ranch & Ag</option>
            </select>

            <select className="rounded-xl border px-4 py-3 text-black">
              <option>Statewide</option>
              <option>Southeast</option>
              <option>Central</option>
              <option>Northwest</option>
            </select>

            <button className="rounded-xl bg-[#2F5D50] px-5 py-3 font-semibold text-white">
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold">
          Explore Categories
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category}
              className="flex h-40 items-end rounded-2xl bg-gradient-to-br from-[#2F5D50] to-[#1F2933] p-5 text-white shadow-sm"
            >
              <div>
                <h3 className="text-xl font-bold">
                  {category}
                </h3>

                <p className="text-sm text-white/75">
                  Browse local listings
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Recently Listed
          </h2>

          <Link
            href="/listings"
            className="text-sm font-semibold text-[#2F5D50] hover:text-[#24493f]"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.slug}
              title={listing.title}
              price={listing.price}
              location={listing.location}
              seller={listing.seller}
              slug={listing.slug}
            />
          ))}
        </div>
      </section>

      <section className="border-t bg-white px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-[#F7F5F2] p-6">
            <h2 className="text-2xl font-bold">
              Verified Businesses
            </h2>

            <p className="mt-2 text-[#52606D]">
              Discover trusted local dealers, FFLs, welders,
              outfitters, ranch suppliers, and service providers.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F7F5F2] p-6">
            <h2 className="text-2xl font-bold">
              Community Discussions
            </h2>

            <p className="mt-2 text-[#52606D]">
              Join statewide and regional conversations about
              outdoors, ranching, vehicles, alerts, and local
              recommendations.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}