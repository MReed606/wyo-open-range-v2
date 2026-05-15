const businesses = [
  "Frontier Welding & Repair",
  "High Plains Outfitters",
  "Southeast WY Trailer Sales",
  "Range Line FFL Services",
];

export default function BusinessesPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold text-[#1F2933]">
          Verified Businesses
        </h1>

        <p className="mt-4 text-lg text-[#52606D]">
          Find trusted local businesses, dealers, outfitters,
          service providers, and Wyoming professionals.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {businesses.map((business) => (
            <div
              key={business}
              className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
                Verified Business
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#1F2933]">
                {business}
              </h2>

              <p className="mt-4 text-base text-[#52606D]">
                Serving Wyoming with trusted local service,
                marketplace support, and verified operations.
              </p>

              <button className="mt-6 rounded-xl bg-[#2F5D50] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24493f]">
                View Business
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}