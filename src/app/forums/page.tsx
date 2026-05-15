const discussions = [
  "Best diesel shop in Cheyenne?",
  "Wyoming antelope season discussion",
  "Local welding recommendations",
  "Ranch fencing equipment advice",
];

export default function ForumsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold text-[#1F2933]">
          Community Forums
        </h1>

        <p className="mt-4 text-lg text-[#52606D]">
          Join statewide and regional discussions across Wyoming.
        </p>

        <div className="mt-10 space-y-5">
          {discussions.map((discussion) => (
            <div
              key={discussion}
              className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-[#1F2933]">
                {discussion}
              </h2>

              <p className="mt-3 text-base text-[#52606D]">
                Southeast Region • 14 replies
              </p>

              <button className="mt-5 rounded-xl bg-[#2F5D50] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24493f]">
                Open Discussion
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}