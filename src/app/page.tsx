import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function HomePage() {

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  const { count: listingCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <main className="min-h-screen bg-[#F7F5F2]">

      {/* HERO */}
      <section className="border-b border-black/10 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex rounded-full border border-[#2F5D50]/20 bg-[#2F5D50]/10 px-4 py-2 text-sm font-semibold text-[#2F5D50]">
              Wyoming Marketplace • Businesses • Community
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight text-[#111827] sm:text-6xl">
              Better reach.
              <br />
              Better options.
              <br />
              Less BS.
            </h1>

            <p className="mt-6 max-w-2xl text-xl text-[#374151]">
              Wyoming’s modern marketplace for buying, selling,
              businesses, services, jobs, and community.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/listings"
                className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-bold text-white shadow transition hover:bg-[#24493f]"
              >
                Browse Marketplace
              </Link>

              <Link
                href="/post"
                className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-lg font-bold text-[#111827] shadow-sm transition hover:bg-gray-50"
              >
                Post Listing
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Listings
            </div>

            <div className="mt-2 text-4xl font-black text-[#111827]">
              {listingCount ?? 0}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Members
            </div>

            <div className="mt-2 text-4xl font-black text-[#111827]">
              {userCount ?? 0}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Marketplace
            </div>

            <div className="mt-2 text-4xl font-black text-[#2F5D50]">
              Live
            </div>
          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 pb-12">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-black text-[#111827]">
            Browse Categories
          </h2>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            "Vehicles",
            "Livestock",
            "Equipment",
            "Housing",
            "Services",
            "Jobs",
            "Businesses",
            "Community",
          ].map((category) => (

            <Link
              key={category}
              href={`/listings?category=${category}`}
              className="rounded-2xl bg-white p-6 text-lg font-bold text-[#111827] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {category}
            </Link>

          ))}

        </div>

      </section>

      {/* FEATURED LISTINGS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-black text-[#111827]">
            Latest Listings
          </h2>

          <Link
            href="/listings"
            className="font-bold text-[#2F5D50]"
          >
            View All →
          </Link>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {listings?.map((listing) => (

            <Link
              key={listing.id}
              href={`/listing/${listing.slug}`}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {listing.image_url && (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-5">

                <h3 className="line-clamp-1 text-xl font-bold text-[#111827]">
                  {listing.title}
                </h3>

                <p className="mt-2 text-lg font-bold text-[#2F5D50]">
                  ${listing.price ?? "Contact"}
                </p>

                <p className="mt-2 line-clamp-2 text-sm text-[#374151]">
                  {listing.description}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}
