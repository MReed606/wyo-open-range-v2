import Link from "next/link";
import { ListingGallery } from "@/components/ListingGallery";
import { SaveListingButton } from "@/components/SaveListingButton";
import { ContactSellerButton } from "@/components/ContactSellerButton";
import { ReportListingButton } from "@/components/ReportListingButton";
import { supabase } from "@/lib/supabase";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ListingDetailPage({
  params,
}: ListingPageProps) {
  const { slug } = await params;

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("public_slug")
    .eq("id", listing.owner_id)
    .single();

  const { data: imagesData } = await supabase
    .from("listing_images")
    .select("image_url")
    .eq("listing_id", listing.id);

  const galleryImages =
    imagesData?.map((img) => img.image_url) ?? [];

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-[#1F2933]">
            Listing Not Found
          </h1>

          <p className="mt-4 text-lg text-[#52606D]">
            This listing may have been removed, expired, or does not exist.
          </p>

          <Link
            href="/listings"
            className="mt-6 inline-flex rounded-xl bg-[#2F5D50] px-5 py-3 font-semibold text-white"
          >
            Back to Listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <ListingGallery title={listing.title} images={galleryImages} />

            <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-[#1F2933]">
                    {listing.title}
                  </h1>

                  <p className="mt-3 text-lg text-[#52606D]">
                    {listing.city ?? "Wyoming"} • {listing.region ?? "Statewide"} • {listing.condition ?? "Used"}
                  </p>
                </div>

                <p className="text-3xl font-bold text-[#2F5D50]">
                  {listing.price ?? "Contact"}
                </p>
              </div>

              <div className="mt-6 border-t pt-6">
                <h2 className="text-2xl font-bold text-[#1F2933]">
                  Listing Details
                </h2>

                <p className="mt-4 text-lg leading-8 text-[#52606D]">
                  {listing.description}
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#F7F5F2] p-4">
                    <p className="text-sm font-bold text-[#52606D]">
                      Category
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#1F2933]">
                      {listing.category ?? "General"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7F5F2] p-4">
                    <p className="text-sm font-bold text-[#52606D]">
                      Status
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#1F2933]">
                      {listing.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ReportListingButton listingId={listing.id} />
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
            <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
              Seller Profile
            </p>

            <Link
              href={`/seller/${sellerProfile?.public_slug ?? ""}`}
              className="mt-3 inline-block text-2xl font-bold text-[#2F5D50] hover:underline"
            >
              {listing.seller_label ?? "Seller"}
            </Link>

            <p className="mt-2 text-[#52606D]">
              Real database listing
            </p>

            <Link
              href="/messages"
              className="mt-6 block w-full rounded-xl bg-[#2F5D50] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#24493f]"
            >
              Message Seller
            </Link>

            <ContactSellerButton
              listingId={listing.id}
              sellerId={listing.owner_id}
            />

            <div className="mt-3">
              <SaveListingButton listingId={listing.id} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
