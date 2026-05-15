import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2933]">Wyo Open Range</h2>
          <p className="mt-4 text-[#52606D]">
            Wyoming’s modern marketplace for local commerce, business discovery,
            ranching, outdoors, services, and community discussion.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2933]">Marketplace</h3>
          <ul className="mt-4 space-y-3 text-[#52606D]">
            <li><Link href="/listings">Browse Listings</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/regions">Regions</Link></li>
            <li><Link href="/post">Post Listing</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2933]">Platform</h3>
          <ul className="mt-4 space-y-3 text-[#52606D]">
            <li><Link href="/businesses">Businesses</Link></li>
            <li><Link href="/forums">Forums</Link></li>
            <li><Link href="/messages">Messages</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#1F2933]">Trust & Legal</h3>
          <ul className="mt-4 space-y-3 text-[#52606D]">
            <li><Link href="/safety">Safety</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/admin">Admin Prototype</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t px-6 py-5 text-center text-sm text-[#52606D]">
        © 2026 Wyo Open Range. Prototype platform shell.
      </div>
    </footer>
  );
}
