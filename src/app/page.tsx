import { MarketplaceAnnouncements } from "@/components/home/MarketplaceAnnouncements";
import { MarketplaceStats } from "@/components/dashboard/MarketplaceStats";
import { TrendingListings } from "@/components/home/TrendingListings";

import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function HomePage() {

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .neq("hidden_by_system", true)
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  return (
    <main className="min-h-screen bg-[#F7F5F2]">

      <section className="border-b border-black/5 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-[#111827] md:text-7xl">
            Wyoming Open Range
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-[#374151]">
            Wyoming's marketplace for livestock, ranch, equipment, housing, and local trade.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/listings"
              className="rounded-2xl bg-[#2F5D50] px-6 py-4 text-lg font-bold text-white"
            >
              Browse Listings
            </Link>

            <Link
              href="/post"
              className="rounded-2xl border border-[#2F5D50] bg-white px-6 py-4 text-lg font-bold text-[#2F5D50]"
            >
              Post Listing
            </Link>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h2 className="text-4xl font-black text-[#111827]">
              Recent Listings
            </h2>

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

                <p className="mt-4 text-xl font-bold text-[#2F5D50]">
                  ${listing.price ?? "Contact"}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </section>

    
      {/* FEATURED */}

      <section className="mt-16">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-4xl font-black text-[#111827]">
              Featured Listings
            </h2>

            <p className="mt-3 text-lg text-[#374151]">
              Popular marketplace listings.
            </p>

          </div>

        </div>

      </section>



      
      <MarketplaceAnnouncements />


      <MarketplaceStats />

      <TrendingListings />


</main>
  );
}
