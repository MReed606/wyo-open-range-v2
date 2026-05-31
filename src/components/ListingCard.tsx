import Link from "next/link";
import Image from "next/image";

type ListingCardProps = {
  title: string;
  price: string;
  location: string;
  seller: string;
  slug: string;
  condition: string;
  imageUrl?: string;
  sellerSlug?: string;
};

import { formatPrice } from "@/lib/formatPrice";

export function ListingCard({
  title,
  price,
  location,
  seller,
  slug,
  condition,
  imageUrl,
  sellerSlug,
}: ListingCardProps) {

  return (

    <Link
      href={`/listing/${slug}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >

      {/* IMAGE */}

      <div className="relative h-56 overflow-hidden bg-[#D1D5DB]">

        {imageUrl ? (

          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="
              (max-width: 768px) 100vw,
              (max-width: 1280px) 50vw,
              33vw
            "
            className="object-cover transition duration-300 group-hover:scale-105"
            priority={false}
          />

        ) : (

          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#2F5D50] to-[#1F2933] text-lg font-bold text-white">

            Wyo Open Range

          </div>

        )}

        {/* CONDITION BADGE */}

        <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1F2933] shadow-sm">

          {condition}

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-5">

        <h2 className="line-clamp-2 text-xl font-bold text-[#1F2933]">

          {title}

        </h2>

        <p className="mt-3 text-2xl font-bold text-[#2F5D50]">

          {formatPrice(price)}

        </p>

        <p className="mt-3 text-sm font-medium text-[#52606D]">

          {location}

        </p>

        {sellerSlug ? (

          <Link
            href={`/seller/${sellerSlug}`}
            className="mt-2 inline-block text-sm font-bold text-[#2F5D50] hover:underline"
          >

            {seller}

          </Link>

        ) : (

          <p className="mt-2 text-sm font-semibold text-[#1F2933]">

            {seller}

          </p>

        )}

      </div>

    </Link>
  );
}