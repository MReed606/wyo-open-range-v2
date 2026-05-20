import Link from "next/link";

export default function AdminReportsPage() {

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="text-4xl font-black text-[#111827]">
        Admin Reports
      </h1>

      <p className="mt-4 text-lg text-[#374151]">
        Main moderation dashboard available on the primary admin page.
      </p>

      <Link
        href="/admin"
        className="mt-6 inline-flex rounded-xl bg-[#2F5D50] px-5 py-3 font-bold text-white"
      >
        Open Moderation Dashboard
      </Link>

    </main>
  );
}
