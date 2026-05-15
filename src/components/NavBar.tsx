import Link from "next/link";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Wyo Open Range
        </Link>

        <div className="hidden gap-6 text-sm font-medium md:flex">
          <Link href="/listings">Browse</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/forums">Forums</Link>
          <Link href="/businesses">Businesses</Link>
        </div>

        <button className="rounded-xl bg-[#2F5D50] px-4 py-2 text-sm font-semibold text-white">
          Post Listing
        </button>
      </div>
    </nav>
  );
}