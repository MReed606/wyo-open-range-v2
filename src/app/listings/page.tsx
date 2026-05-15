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
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-56 bg-gradient-to-br from-[#C2A878] to-[#2F5D50]" />

              <div className="p-5">
                <p className="text-2xl font-bold text-[#1F2933]">
                  $12,500
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#1F2933]">
                  Example Listing #{item}
                </h2>

                <p className="mt-3 text-base text-[#52606D]">
                  Cheyenne • Southeast
                </p>

                <p className="mt-3 text-sm font-bold text-[#2F5D50]">
                  Verified Seller
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}