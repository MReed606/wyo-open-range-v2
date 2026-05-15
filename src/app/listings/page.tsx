import { ListingCard } from "@/components/ListingCard";

const listings = [
  {
    title: "2019 Ford F-350 Lariat",
    price: "$42,500",
    location: "Cheyenne • Southeast",
    seller: "Verified Seller",
    slug: "2019-ford-f350-lariat",
  },
  {
    title: "20ft Stock Trailer",
    price: "$8,900",
    location: "Torrington • East",
    seller: "Trusted Seller",
    slug: "20ft-stock-trailer",
  },
  {
    title: "Vortex Optics Bundle",
    price: "$650",
    location: "Laramie • South Central",
    seller: "Verified Seller",
    slug: "vortex-optics-bundle",
  },
  {
    title: "Ranch Welding Services",
    price: "Contact",
    location: "Southeast Wyoming",
    seller: "Verified Business",
    slug: "ranch-welding-services",
  },
];

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold text-[#1F2933]">
          Browse Listings
        </h1>

        <p className="mt-4 text-lg text-[#52606D]">
          Search vehicles, firearms, ranch equipment,
          services, and more across Wyoming.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.slug}
              title={listing.title}
              price={listing.price}
              location={listing.location}
              seller={listing.seller}
              slug={listing.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
}