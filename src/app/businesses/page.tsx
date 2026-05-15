const businesses = [
  "Frontier Welding & Repair",
  "High Plains Outfitters",
  "Southeast WY Trailer Sales",
  "Range Line FFL Services",
];

export default function BusinessesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-bold">Verified Businesses</h1>

      <p className="mt-4 text-lg text-[#52606D]">
        Find trusted local businesses, dealers, FFLs, outfitters, and service providers.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {businesses.map((business) => (
          <div key={business} className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#2F5D50]">
              Verified Business
            </p>

            <h2 className="mt-2 text-2xl font-bold">{business}</h2>

            <p className="mt-3 text-[#52606D]">
              Serving Wyoming with trusted local service and marketplace support.
            </p>

            <button className="mt-5 rounded-xl border border-[#2F5D50] px-4 py-2 text-sm font-semibold text-[#2F5D50]">
              View Business
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}