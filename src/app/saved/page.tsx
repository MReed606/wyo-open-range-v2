import { ListingCard } from "@/components/ListingCard";
import { PageHeader } from "@/components/PageHeader";
import { listings } from "@/data/listings";

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Saved Items"
        title="Saved Listings"
        description="Listings, searches, sellers, and businesses you want to come back to later."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(0, 3).map((listing) => (
            <ListingCard key={listing.slug} {...listing} />
          ))}
        </div>
      </section>
    </main>
  );
}
