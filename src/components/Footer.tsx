import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-6 py-8 text-sm text-[#374151]">

        <Link href="/terms" className="hover:text-[#2F5D50]">
          Terms
        </Link>

        <Link href="/privacy" className="hover:text-[#2F5D50]">
          Privacy
        </Link>

        <Link href="/rules" className="hover:text-[#2F5D50]">
          Rules
        </Link>

        <Link href="/prohibited" className="hover:text-[#2F5D50]">
          Prohibited Items
        </Link>

      </div>
    </footer>
  );
}
