import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";

export type RelatedListing = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  price: string;
  region: string;
  category: string | null;
  trending_score: number;
};

type RelatedListingsProps = {
  listings: RelatedListing[];
};

export function RelatedListings({
  listings,
}: RelatedListingsProps) {
  if (!listings.length) {
    return null;
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-4xl font-black text-[#111827]">
          Similar Listings
        </h2>

        <p className="mt-3 text-lg text-[#6B7280]">
          AI-powered related marketplace discovery.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {listings.map((item) => (
          <Link
            key={item.id}
            href={`/listing/${item.slug}`}
            className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-[240px] overflow-hidden">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#E5E7EB]">
                  No Image
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="line-clamp-2 text-2xl font-black text-[#111827]">
                {item.title}
              </h3>

              <div className="mt-4 text-3xl font-black text-[#2F5D50]">
                {formatPrice(item.price)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
