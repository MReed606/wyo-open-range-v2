import {
  LeaveReviewForm
} from "@/components/reviews/LeaveReviewForm";

type ListingReviewPanelProps = {
  sellerId: string;
  listingId: string;
};

export function ListingReviewPanel({
  sellerId,
  listingId,
}: ListingReviewPanelProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <LeaveReviewForm
        sellerId={sellerId}
        listingId={listingId}
      />
    </div>
  );
}
