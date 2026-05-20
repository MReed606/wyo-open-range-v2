import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { regions } from "@/data/regions";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function RegionsPage() {
  return (
    <>
      <AuthGuard />
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Wyoming Regional Network"
        title="Browse by Region"
        description="Wyo Open Range is built around a 3x3 Wyoming regional system so users can browse locally first while still searching statewide."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/search?region=${region.slug}`}
              className="block rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
                Region
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#1F2933]">
                {region.name}
              </h2>

              <p className="mt-3 text-[#52606D]">
                {region.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {region.cities.map((city) => (
                  <span
                    key={city}
                    className="rounded-full bg-[#F7F5F2] px-3 py-1 text-sm font-semibold text-[#52606D]"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
      </>
  );
}