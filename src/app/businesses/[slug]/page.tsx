import { businesses } from "@/data/businesses";

type BusinessPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BusinessDetailPage({
  params,
}: BusinessPageProps) {
  const { slug } = await params;

  const business = businesses.find((item) => item.slug === slug);

  if (!business) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-[#1F2933]">
            Business Not Found
          </h1>

          <p className="mt-4 text-lg text-[#52606D]">
            The business you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="bg-gradient-to-br from-[#1F2933] via-[#2F5D50] to-[#C2A878] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/80">
            {business.status}
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            {business.name}
          </h1>

          <p className="mt-4 text-xl text-white/85">
            {business.category}
          </p>

          <p className="mt-2 text-lg text-white/80">
            {business.location}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-3xl font-bold text-[#1F2933]">
            About This Business
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#52606D]">
            {business.description}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {Object.entries(business.stats).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-[#F7F5F2] p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">
                  {key}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#1F2933]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
          <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
            Business Contact
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#1F2933]">
            {business.name}
          </h2>

          <p className="mt-3 text-[#52606D]">
            Verified local business profile.
          </p>

          <button className="mt-6 w-full rounded-xl bg-[#2F5D50] px-5 py-3 font-semibold text-white transition hover:bg-[#24493f]">
            Message Business
          </button>

          <button className="mt-3 w-full rounded-xl border border-[#2F5D50] px-5 py-3 font-semibold text-[#2F5D50] transition hover:bg-[#F7F5F2]">
            Request Service
          </button>

          <button className="mt-3 w-full rounded-xl border border-black/10 px-5 py-3 font-semibold text-[#1F2933] transition hover:bg-[#F7F5F2]">
            Save Business
          </button>
        </aside>
      </section>
    </main>
  );
}
