export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2933]">
            Wyo Open Range
          </h2>

          <p className="mt-4 text-[#52606D]">
            Wyoming’s modern marketplace for buying,
            selling, services, ranching, outdoors,
            and community discussions.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2933]">
            Marketplace
          </h3>

          <ul className="mt-4 space-y-3 text-[#52606D]">
            <li>Browse Listings</li>
            <li>Vehicles</li>
            <li>Ranch & Ag</li>
            <li>Services</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2933]">
            Community
          </h3>

          <ul className="mt-4 space-y-3 text-[#52606D]">
            <li>Forums</li>
            <li>Businesses</li>
            <li>Local Discussions</li>
            <li>Regional Groups</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2933]">
            Trust & Safety
          </h3>

          <ul className="mt-4 space-y-3 text-[#52606D]">
            <li>Verified Sellers</li>
            <li>Reporting System</li>
            <li>Community Standards</li>
            <li>Fraud Prevention</li>
          </ul>
        </div>
      </div>

      <div className="border-t px-6 py-5 text-center text-sm text-[#52606D]">
        © 2026 Wyo Open Range. All rights reserved.
      </div>
    </footer>
  );
}
