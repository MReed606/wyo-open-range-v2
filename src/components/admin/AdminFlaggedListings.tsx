import Link from "next/link";

import {
  AlertTriangle
} from "lucide-react";

type Props = {
  flaggedListings: any[];
  onRemoveListing: (
    listingId: string
  ) => void;
};

export function AdminFlaggedListings({
  flaggedListings,
  onRemoveListing,
}: Props) {
  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <AlertTriangle className="h-7 w-7 text-red-500" />

        <h2 className="text-3xl font-black text-[#111827]">
          High Risk Listings
        </h2>
      </div>

      {!flaggedListings.length && (
        <div className="rounded-2xl bg-[#F7F5F2] p-8 text-center text-[#6B7280]">
          No high-risk listings detected.
        </div>
      )}

      <div className="space-y-5">
        {flaggedListings.map(
          (listing) => (
            <div
              key={listing.id}
              className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-red-50 p-6"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-black text-[#111827]">
                    {listing.title}
                  </h3>

                  <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">
                    Risk:{" "}
                    {listing.moderation_score ?? 0}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {(listing.moderation_flags ?? [])
                    .map(
                      (
                        flag: string,
                        i: number
                      ) => (
                        <div
                          key={i}
                          className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-black text-yellow-700"
                        >
                          {flag}
                        </div>
                      )
                    )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/listing/${listing.slug}`}
                  className="rounded-2xl bg-[#111827] px-5 py-3 font-black text-white"
                >
                  View
                </Link>

                <button
                  onClick={() =>
                    onRemoveListing(
                      listing.id
                    )
                  }
                  className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
