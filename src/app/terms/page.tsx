import { PageHeader } from "@/components/PageHeader";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Prototype placeholder for future platform terms, marketplace rules, firearm compliance language, and community standards."
      />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <p className="text-lg leading-8 text-[#52606D]">
            This page is a placeholder. Before launch, this should be replaced
            with attorney-reviewed terms of service, marketplace rules,
            prohibited content policy, user conduct rules, and compliance language.
          </p>
        </div>
      </section>
    </main>
  );
}
