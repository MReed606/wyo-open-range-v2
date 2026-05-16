import { ListingCard } from "@/components/ListingCard";
import { supabase } from "@/lib/supabase";

export default async function ListingsPage() {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold text-[#1F2933]">
          Browse Listings
        </h1>

        <p className="mt-4 text-lg text-[#52606D]">
          Real listings from the Wyo Open Range database.
        </p>

        {error && (
          <div className="mt-8 rounded-2xl bg-white p-6 text-red-700 shadow-md">
            Database error: {error.message}
          </div>
        )}

        {!error && (!listings || listings.length === 0) && (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#1F2933]">
              No listings yet
            </h2>
            <p className="mt-3 text-[#52606D]">
              Post the first real listing to start building the marketplace.
            </p>
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings?.map((listing) => (
            <ListingCard
              key={listing.id}
              title={listing.title}
              price={listing.price ?? "Contact"}
              location={`${listing.city ?? "Wyoming"} • ${listing.region ?? "Statewide"}`}
              seller={listing.seller_label ?? "Seller"}
              slug={listing.slug}
              condition={listing.condition ?? "Used"}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
