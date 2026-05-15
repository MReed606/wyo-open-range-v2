import Link from "next/link";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#1F2933]"
        >
          Wyo Open Range
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/listings"
            className="text-sm font-bold text-[#1F2933] transition hover:text-[#2F5D50]"
          >
            Browse
          </Link>

          <Link
            href="/categories"
            className="text-sm font-bold text-[#1F2933] transition hover:text-[#2F5D50]"
          >
            Categories
          </Link>

          <Link
            href="/forums"
            className="text-sm font-bold text-[#1F2933] transition hover:text-[#2F5D50]"
          >
            Forums
          </Link>

          <Link
            href="/businesses"
            className="text-sm font-bold text-[#1F2933] transition hover:text-[#2F5D50]"
          >
            Businesses
          </Link>
        </div>

        <button className="rounded-xl bg-[#2F5D50] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24493f]">
          Post Listing
        </button>
      </div>
    </nav>
  );
}