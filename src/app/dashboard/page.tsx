import { PageHeader } from "@/components/PageHeader";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/data/listings";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="User Dashboard"
        title="Your Marketplace"
        description="Manage listings, messages, saved items, offers, reviews, and account settings."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ["Active Listings", "4"],
            ["Saved Items", "12"],
            ["Messages", "3"],
            ["Completed Sales", "38"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">{label}</p>
              <p className="mt-3 text-4xl font-bold text-[#1F2933]">{value}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-3xl font-bold text-[#1F2933]">Your Listings</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.slug} {...listing} />
          ))}
        </div>
      </section>
    </main>
  );
}
