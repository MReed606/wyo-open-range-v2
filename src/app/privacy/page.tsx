import { PageHeader } from "@/components/PageHeader";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Prototype placeholder for future privacy, data retention, user controls, and account deactivation policy."
      />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <p className="text-lg leading-8 text-[#52606D]">
            This page is a placeholder. Before launch, this should define how
            Wyo Open Range handles account data, verification data, messages,
            moderation records, reviews, and user-controlled visibility settings.
          </p>
        </div>
      </section>
    </main>
  );
}
