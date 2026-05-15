import { PageHeader } from "@/components/PageHeader";

export default function PostListingPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Create Listing"
        title="Post a Listing"
        description="This prototype shows the future guided posting flow for marketplace listings, services, jobs, and business inventory."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-3xl font-bold text-[#1F2933]">
            Listing Details
          </h2>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="font-bold text-[#1F2933]">Title</span>
              <input className="rounded-xl border px-4 py-3" placeholder="Example: 2019 Ford F-350 Lariat" />
            </label>

            <label className="grid gap-2">
              <span className="font-bold text-[#1F2933]">Category</span>
              <select className="rounded-xl border px-4 py-3">
                <option>Vehicles</option>
                <option>Firearms & Outdoors</option>
                <option>Ranch & Ag</option>
                <option>Local Services</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="font-bold text-[#1F2933]">Price</span>
              <input className="rounded-xl border px-4 py-3" placeholder="$42,500 / OBO / Trade / Contact" />
            </label>

            <label className="grid gap-2">
              <span className="font-bold text-[#1F2933]">Description</span>
              <textarea className="min-h-40 rounded-xl border px-4 py-3" placeholder="Describe the item, condition, location, and details..." />
            </label>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold text-[#1F2933]">
            Posting Flow
          </h2>

          <div className="mt-5 space-y-4">
            {["Photos", "Details", "Location", "Contact", "Review"].map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5D50] text-sm font-bold text-white">
                  {index + 1}
                </div>

                <p className="font-semibold text-[#1F2933]">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full rounded-xl bg-[#2F5D50] px-5 py-3 font-semibold text-white">
            Save Draft
          </button>
        </aside>
      </section>
    </main>
  );
}
