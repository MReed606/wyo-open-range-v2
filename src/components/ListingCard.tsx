import Link from "next/link";

type ListingCardProps = {
  title: string;
  price: string;
  location: string;
  seller: string;
  slug: string;
  condition: string;
  imageUrl?: string;
};

export function ListingCard({
  title,
  price,
  location,
  seller,
  slug,
  condition,
  imageUrl,
}: ListingCardProps) {
  return (
    <Link
      href={`/listing/${slug}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-56 overflow-hidden bg-[#D1D5DB]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#2F5D50] to-[#1F2933] text-lg font-bold text-white">
            Wyo Open Range
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1F2933] shadow-sm">
          {condition}
        </div>
      </div>

      <div className="p-5">
        <h2 className="line-clamp-2 text-xl font-bold text-[#1F2933]">
          {title}
        </h2>

        <p className="mt-3 text-2xl font-bold text-[#2F5D50]">
          {price}
        </p>

        <p className="mt-3 text-sm font-medium text-[#52606D]">
          {location}
        </p>

        <p className="mt-2 text-sm font-semibold text-[#1F2933]">
          {seller}
        </p>
      </div>
    </Link>
  );
}
