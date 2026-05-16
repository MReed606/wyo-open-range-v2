import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { supabase } from "@/lib/supabase";

type SellerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SellerPage({
  params,
}: SellerPageProps) {
  const { slug } = await params;

  const { data: seller } = await supabase
    .from("profiles")
    .select("*")
    .eq("public_slug", slug)
    .single();

  if (!seller) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-[#1F2933]">
            Seller Not Found
          </h1>
        </div>
      </main>
    );
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", seller.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#2F5D50] to-[#1F2933] text-4xl font-bold text-white">
              {(seller.first_name ?? "U")[0]}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-5xl font-bold text-[#1F2933]">
                  {seller.first_name ?? "Seller"} {seller.last_initial ?? ""}
                </h1>

                <div className="rounded-full bg-[#2F5D50] px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
                  {seller.account_type ?? "standard"}
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-lg text-[#52606D]">
                {seller.bio ??
                  "Wyoming marketplace member on Wyo Open Range."}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-xl bg-[#F3F4F6] px-4 py-3">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
                    Reputation
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#1F2933]">
                    {seller.reputation_score ?? 0}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F3F4F6] px-4 py-3">
                  <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
                    Active Listings
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#1F2933]">
                    {listings?.length ?? 0}
                  </p>
                </div>
              </div>

              <Link
                href="/messages"
                className="mt-6 inline-flex rounded-xl bg-[#2F5D50] px-5 py-3 font-bold text-white"
              >
                Contact Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#1F2933]">
            Seller Listings
          </h2>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings?.map((listing) => (
            <ListingCard
              key={listing.id}
              title={listing.title}
              price={listing.price ?? "Contact"}
              location={`${listing.city ?? "Wyoming"} • ${listing.region ?? "Statewide"}`}
              seller={listing.seller_label ?? "Seller"}
              sellerSlug={listing.owner_id ?? ""}
              slug={listing.slug}
              condition={listing.condition ?? "Used"}
              imageUrl={listing.image_url ?? ""}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
