import { PageHeader } from "@/components/PageHeader";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Account Settings"
        title="Profile & Preferences"
        description="Manage profile identity, verification, privacy, notifications, and trusted seller settings."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-3xl font-bold text-[#1F2933]">Public Profile</h2>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="font-bold text-[#1F2933]">Display Name</span>
              <input className="rounded-xl border px-4 py-3" defaultValue="Cody R." />
            </label>

            <label className="grid gap-2">
              <span className="font-bold text-[#1F2933]">Region Activity</span>
              <select className="rounded-xl border px-4 py-3">
                <option>Southeast Wyoming</option>
                <option>Statewide</option>
                <option>Central Wyoming</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="font-bold text-[#1F2933]">Bio</span>
              <textarea
                className="min-h-32 rounded-xl border px-4 py-3"
                defaultValue="Verified seller and Wyoming marketplace member."
              />
            </label>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold text-[#1F2933]">Verification</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-[#F7F5F2] p-4">
              <p className="font-bold text-[#1F2933]">Phone Verified</p>
              <p className="text-sm text-[#52606D]">Required for posting.</p>
            </div>
            <div className="rounded-xl bg-[#F7F5F2] p-4">
              <p className="font-bold text-[#1F2933]">Trusted Seller</p>
              <p className="text-sm text-[#52606D]">Based on reviews, sales, and account age.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
