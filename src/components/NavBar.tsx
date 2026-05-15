import Link from "next/link";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white text-[#1F2933] shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#1F2933]"
        >
          Wyo Open Range
        </Link>

        <div className="hidden gap-6 text-sm font-semibold text-[#1F2933] md:flex">
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