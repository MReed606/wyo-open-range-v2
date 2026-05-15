import { PageHeader } from "@/components/PageHeader";

const queues = [
  ["Flagged Listings", "7"],
  ["User Reports", "12"],
  ["Business Verifications", "4"],
  ["Forum Reports", "5"],
  ["Appeals", "2"],
  ["Risk Alerts", "9"],
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Admin Control Center"
        title="Platform Operations"
        description="Prototype dashboard for moderation queues, trust systems, reports, business verification, and regional platform health."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {queues.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-bold uppercase tracking-wide text-[#52606D]">{label}</p>
              <p className="mt-3 text-4xl font-bold text-[#1F2933]">{value}</p>
              <button className="mt-5 rounded-xl bg-[#2F5D50] px-4 py-2 text-sm font-semibold text-white">
                Review Queue
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
