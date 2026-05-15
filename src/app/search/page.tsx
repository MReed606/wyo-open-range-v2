import { ListingCard } from "@/components/ListingCard";
import { PageHeader } from "@/components/PageHeader";
import { businesses } from "@/data/businesses";
import { forumThreads } from "@/data/forums";
import { listings } from "@/data/listings";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Unified Discovery"
        title="Search Wyo Open Range"
        description="Search listings, businesses, and community discussions from one regional marketplace system."
      />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_140px]">
            <input
              className="rounded-xl border px-4 py-3 text-[#1F2933] outline-none"
              placeholder="Search trucks, trailers, optics, services..."
            />

            <select className="rounded-xl border px-4 py-3 text-[#1F2933]">
              <option>All Types</option>
              <option>Listings</option>
              <option>Businesses</option>
              <option>Forums</option>
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

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-[#1F2933]">
            Listing Results
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#1F2933]">
              Business Results
            </h2>

            <div className="mt-6 space-y-4">
              {businesses.slice(0, 3).map((business) => (
                <div key={business.slug} className="rounded-2xl bg-white p-5 shadow-md">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
                    {business.status}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-[#1F2933]">
                    {business.name}
                  </h3>

                  <p className="mt-2 text-[#52606D]">
                    {business.category} • {business.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#1F2933]">
              Discussion Results
            </h2>

            <div className="mt-6 space-y-4">
              {forumThreads.slice(0, 3).map((thread) => (
                <div key={thread.slug} className="rounded-2xl bg-white p-5 shadow-md">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
                    {thread.category}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-[#1F2933]">
                    {thread.title}
                  </h3>

                  <p className="mt-2 text-[#52606D]">
                    {thread.region} • {thread.replies} replies
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
