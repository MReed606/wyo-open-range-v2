import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/data/listings";

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold text-[#1F2933]">
          Browse Listings
        </h1>

        <p className="mt-4 text-lg text-[#52606D]">
          Search vehicles, firearms, ranch equipment, services, and more across Wyoming.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_140px]">
            <input
              className="rounded-xl border px-4 py-3 text-[#1F2933] outline-none"
              placeholder="Search listings..."
            />

            <select className="rounded-xl border px-4 py-3 text-[#1F2933]">
              <option>All Categories</option>
              <option>Vehicles</option>
              <option>Ranch & Ag</option>
              <option>Firearms & Outdoors</option>
            </select>

            <select className="rounded-xl border px-4 py-3 text-[#1F2933]">
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.slug}
              title={listing.title}
              price={listing.price}
              location={listing.location}
              seller={listing.seller}
              slug={listing.slug}
              condition={listing.condition}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
