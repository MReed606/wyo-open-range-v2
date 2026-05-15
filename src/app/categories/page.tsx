const categories = [
  "Vehicles",
  "Firearms & Outdoors",
  "Ranch & Ag",
  "Local Services",
  "Jobs",
  "General Marketplace",
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold text-[#1F2933]">
          Categories
        </h1>

        <p className="mt-4 text-lg text-[#52606D]">
          Explore marketplace categories across Wyoming.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category}
              className="flex h-48 items-end rounded-2xl bg-gradient-to-br from-[#2F5D50] to-[#1F2933] p-6 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <h2 className="text-3xl font-bold">
                  {category}
                </h2>

                <p className="mt-3 text-base text-white/80">
                  Browse local listings
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}