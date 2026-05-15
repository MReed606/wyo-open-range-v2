import Link from "next/link";

type ListingCardProps = {
  title: string;
  price: string;
  location: string;
  seller: string;
  slug: string;
};

export function ListingCard({
  title,
  price,
  location,
  seller,
  slug,
}: ListingCardProps) {
  return (
    <Link
      href={`/listing/${slug}`}
      className="block overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="h-56 bg-gradient-to-br from-[#C2A878] to-[#2F5D50]" />

      <div className="p-5">
        <p className="text-2xl font-bold text-[#1F2933]">{price}</p>

        <h2 className="mt-2 text-xl font-semibold text-[#1F2933]">
          {title}
        </h2>

        <p className="mt-3 text-base text-[#52606D]">{location}</p>

        <p className="mt-3 text-sm font-bold text-[#2F5D50]">{seller}</p>
      </div>
    </Link>
  );
}