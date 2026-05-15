import Link from "next/link";

type ListingCardProps = {
  title: string;
  price: string;
  location: string;
  seller: string;
  slug: string;
  condition?: string;
};

export function ListingCard({
  title,
  price,
  location,
  seller,
  slug,
  condition,
}: ListingCardProps) {
  return (
    <Link
      href={`/listing/${slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-56 bg-gradient-to-br from-[#C2A878] to-[#2F5D50]">
        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-[#1F2933] shadow-sm">
          ♡
        </div>

        {condition && (
          <div className="absolute left-3 top-3 rounded-full bg-[#1F2933]/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {condition}
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-2xl font-bold text-[#1F2933]">{price}</p>

        <h2 className="mt-2 text-xl font-semibold text-[#1F2933] group-hover:text-[#2F5D50]">
          {title}
        </h2>

        <p className="mt-3 text-base text-[#52606D]">{location}</p>

        <p className="mt-3 text-sm font-bold text-[#2F5D50]">{seller}</p>
      </div>
    </Link>
  );
}
