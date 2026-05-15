const discussions = [
  "Best diesel shop in Cheyenne?",
  "Wyoming antelope season discussion",
  "Local welding recommendations",
  "Ranch fencing equipment advice",
];

export default function ForumsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-bold">Community Forums</h1>

      <p className="mt-4 text-lg text-[#52606D]">
        Join statewide and regional discussions across Wyoming.
      </p>

      <div className="mt-10 space-y-4">
        {discussions.map((discussion) => (
          <div
            key={discussion}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{discussion}</h2>

            <p className="mt-2 text-sm text-[#52606D]">
              Southeast Region • 14 replies
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}