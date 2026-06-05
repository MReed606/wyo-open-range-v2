import {
  SellerRating
} from "@/components/reviews/SellerRating";

type ListingHeaderProps = {
  title: string;
  category: string | null;
  sellerId: string;
  price: string | null;
  views: number | null;
  region: string | null;
  description: string | null;
};
import { formatPrice } from "@/lib/formatPrice";

export function ListingHeader({
  title,
  category,
  sellerId,
  price,
  views,
  region,
  description,
}: ListingHeaderProps) {
  return (
    <div className="rounded-3xl bg-white p-5 md:p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#111827]">
            {title}
          </h1>

          {category && (
            <div className="mt-3 inline-flex rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-black text-[#2F5D50]">
              {category}
            </div>
          )}

          <div className="mt-4">
            <SellerRating sellerId={sellerId} />
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="text-4xl md:text-5xl font-black text-[#2F5D50]">
            {formatPrice(price)}
          </div>

          <div className="mt-3 flex flex-wrap gap-3 md:justify-end">
            <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-black text-[#111827]">
              👁 {views ?? 0} views
            </div>

            <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-black text-[#111827]">
              📍 {region ?? "Wyoming"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <h2 className="text-3xl font-black text-[#111827]">
          Description
        </h2>

        <p className="mt-6 whitespace-pre-wrap text-lg leading-8 text-[#374151]">
          {description}
        </p>
      </div>
    </div>
  );
}
