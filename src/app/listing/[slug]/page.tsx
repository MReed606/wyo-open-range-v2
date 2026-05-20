import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SaveListingButton } from "@/components/SaveListingButton";
import { ContactSellerButton } from "@/components/ContactSellerButton";
import { ReportListingButton } from "@/components/ReportListingButton";
import { ListingGallery } from "@/components/ListingGallery";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ListingPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!listing) {
    return <div className="p-10">Listing not found</div>;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[2fr_1fr]">

        {/* LEFT SIDE */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-4xl font-bold text-[#111827]">
            {listing.title}
          </h1>

          <p className="mt-4 text-lg text-[#374151]">
            {listing.description ?? "No description"}
          </p>
        </div>

        {/* RIGHT SIDE / SIDEBAR */}
        <aside className="rounded-2xl bg-white p-6 shadow">

          <p className="text-3xl font-bold text-[#111827]">
            ${listing.price ?? "Contact"}
          </p>

          <p className="mt-2 text-[#374151]">
            {listing.city ?? "Wyoming"} • {listing.region ?? "Statewide"}
          </p>

          {/* ACTIONS BLOCK */}
          <div className="mt-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

            <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Actions
            </div>

            <ContactSellerButton
              listingId={listing.id}
              sellerId={listing.owner_id}
            />

            <SaveListingButton listingId={listing.id} />

            <ReportListingButton listingId={listing.id} />

          </div>

        </aside>

      </div>
    </main>
  );
}
