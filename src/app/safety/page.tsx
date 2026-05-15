import { PageHeader } from "@/components/PageHeader";

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Trust & Safety"
        title="Marketplace Safety"
        description="Wyo Open Range is built around verified users, reporting tools, moderation, seller reputation, and safer local transactions."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Verified Identity", "Phone verification and trust badges help reduce anonymous scam behavior."],
            ["Report System", "Users can report listings, messages, businesses, profiles, reviews, and forum posts."],
            ["Reputation", "Reviews, completed sales, account age, and moderation history help build trusted profiles."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-2xl font-bold text-[#1F2933]">{title}</h2>
              <p className="mt-4 text-[#52606D]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
