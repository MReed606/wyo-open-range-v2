export default function ListingDetailPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-md">
              <div className="h-[420px] bg-gradient-to-br from-[#C2A878] to-[#2F5D50]" />
            </div>

            <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
              <h1 className="text-4xl font-bold text-[#1F2933]">
                2019 Ford F-350 Lariat
              </h1>

              <p className="mt-3 text-3xl font-bold text-[#2F5D50]">
                $42,500
              </p>

              <p className="mt-3 text-lg text-[#52606D]">
                Cheyenne • Southeast Wyoming • Good Condition
              </p>

              <div className="mt-6 border-t pt-6">
                <h2 className="text-2xl font-bold text-[#1F2933]">
                  Listing Details
                </h2>

                <p className="mt-4 text-[#52606D]">
                  Clean 2019 Ford F-350 Lariat with diesel power, strong towing
                  capability, and excellent ranch/trailer use potential. This is
                  sample content for the Wyo Open Range prototype.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#F7F5F2] p-4">
                    <p className="text-sm font-bold text-[#52606D]">Mileage</p>
                    <p className="mt-1 text-lg font-semibold text-[#1F2933]">
                      82,000
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7F5F2] p-4">
                    <p className="text-sm font-bold text-[#52606D]">Fuel</p>
                    <p className="mt-1 text-lg font-semibold text-[#1F2933]">
                      Diesel
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7F5F2] p-4">
                    <p className="text-sm font-bold text-[#52606D]">
                      Drivetrain
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#1F2933]">
                      4WD
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7F5F2] p-4">
                    <p className="text-sm font-bold text-[#52606D]">Seller</p>
                    <p className="mt-1 text-lg font-semibold text-[#1F2933]">
                      Verified Seller
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-md lg:sticky lg:top-24">
            <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
              Seller Profile
            </p>

            <h2 className="mt-3 text-2xl font-bold text-[#1F2933]">
              Cody R.
            </h2>

            <p className="mt-2 text-[#52606D]">
              ⭐ 4.9 • 38 completed sales
            </p>

            <p className="mt-2 text-[#52606D]">
              Member since 2026
            </p>

            <div className="mt-5 rounded-xl bg-[#F7F5F2] p-4">
              <p className="font-bold text-[#1F2933]">Verified User</p>
              <p className="mt-1 text-sm text-[#52606D]">
                Phone verified • Trusted seller history
              </p>
            </div>

            <button className="mt-6 w-full rounded-xl bg-[#2F5D50] px-5 py-3 font-semibold text-white transition hover:bg-[#24493f]">
              Message Seller
            </button>

            <button className="mt-3 w-full rounded-xl border border-[#2F5D50] px-5 py-3 font-semibold text-[#2F5D50] transition hover:bg-[#F7F5F2]">
              Make Offer
            </button>

            <button className="mt-3 w-full rounded-xl border border-black/10 px-5 py-3 font-semibold text-[#1F2933] transition hover:bg-[#F7F5F2]">
              Save Listing
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}