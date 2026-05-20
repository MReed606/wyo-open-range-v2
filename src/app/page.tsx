import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function HomePage() {

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .neq("status", "removed")
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  const categories = [
    "Vehicles",
    "Livestock",
    "Equipment",
    "Housing",
    "Services",
    "Jobs",
  ];

  return (
    <main className="min-h-screen bg-[#F7F5F2]">

      {/* HERO */}
      <section className="border-b border-black/5 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-[#111827] md:text-7xl">
            Wyoming's Marketplace for Ranch, Land, Livestock & Local Trade
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-[#374151]">
            Buy, sell, trade, and connect across Wyoming with a marketplace built for rural communities.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/listings"
              className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-bold text-white shadow transition hover:bg-[#24493f]"
            >
              Browse Listings
            </Link>

            <Link
              href="/post"
              className="rounded-2xl border border-[#2F5D50] bg-white px-6 py-4 text-lg font-bold text-[#2F5D50] transition hover:bg-[#F3F7F5]"
            >
              Post Listing
            </Link>

          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h2 className="text-4xl font-black text-[#111827]">
              Browse Categories
            </h2>

            <p className="mt-3 text-lg text-[#374151]">
              Explore Wyoming marketplace categories.
            </p>

          </div>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (

            <Link
              key={category}
              href={`/listings?category=${category}`}
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <h3 className="text-2xl font-black text-[#111827]">
                {category}
              </h3>

            </Link>

          ))}

        </div>

      </section>

      {/* RECENT LISTINGS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h2 className="text-4xl font-black text-[#111827]">
              Recent Listings
            </h2>

            <p className="mt-3 text-lg text-[#374151]">
              Fresh marketplace activity from across Wyoming.
            </p>

          </div>

          <Link
            href="/listings"
            className="font-bold text-[#2F5D50]"
          >
            View All →
          </Link>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {listings?.map((listing) => (

            <Link
              key={listing.id}
              href={`/listing/${listing.slug}`}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {listing.image_url && (

                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="h-56 w-full object-cover"
                />

              )}

              <div className="p-6">

                <h3 className="text-2xl font-black text-[#111827]">
                  {listing.title}
                </h3>

                {listing.category && (

                  <div className="mt-3 inline-flex rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-bold text-[#2F5D50]">
                    {listing.category}
                  </div>

                )}

                <p className="mt-4 text-xl font-bold text-[#2F5D50]">
                  ${listing.price ?? "Contact"}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}
