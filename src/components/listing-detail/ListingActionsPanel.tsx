import Link from "next/link";

import FavoriteButton
from "@/components/listings/FavoriteButton";

type ListingActionsPanelProps = {
  listingId: string;
  ownerId: string;
  onContactSeller: () => void;
};

export function ListingActionsPanel({
  listingId,
  ownerId,
  onContactSeller,
}: ListingActionsPanelProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <FavoriteButton
          listingId={listingId}
        />

        <button
          onClick={onContactSeller}
          className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-lg font-black text-white transition hover:bg-blue-700"
        >
          Contact Seller
        </button>

        <Link
          href={`/seller/profile/${ownerId}`}
          className="block w-full rounded-2xl bg-[#2F5D50] px-6 py-5 text-center text-lg font-black text-white transition hover:bg-[#24473d]"
        >
          Seller Profile
        </Link>
      </div>
    </div>
  );
}
