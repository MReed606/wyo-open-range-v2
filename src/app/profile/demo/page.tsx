import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/data/listings";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#2F5D50] to-[#1F2933] text-3xl font-bold text-white">
                CR
              </div>

              <div>
                <h1 className="text-4xl font-bold text-[#1F2933]">
                  Cody R.
                </h1>

                <p className="mt-2 text-lg text-[#52606D]">
                  Verified Seller • Cheyenne, Wyoming
                </p>

                <p className="mt-2 text-[#52606D]">
                  ⭐ 4.9 • 38 completed sales
                </p>
              </div>
            </div>

            <button className="rounded-xl bg-[#2F5D50] px-6 py-3 font-semibold text-white">
              Message User
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              Active Listings
            </p>

            <p className="mt-3 text-4xl font-bold text-[#1F2933]">
              12
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              Completed Sales
            </p>

            <p className="mt-3 text-4xl font-bold text-[#1F2933]">
              38
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              Seller Rating
            </p>

            <p className="mt-3 text-4xl font-bold text-[#1F2933]">
              4.9
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
              Member Since
            </p>

            <p className="mt-3 text-4xl font-bold text-[#1F2933]">
              2026
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#1F2933]">
              Active Listings
            </h2>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>
    </main>
  );
}
