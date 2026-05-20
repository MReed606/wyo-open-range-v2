"use client";

import Link from "next/link";

export default function AdminPage() {

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Admin Dashboard
      </h1>

      {/* ANALYTICS */}
      <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <Link
          href="/admin/reports"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >

          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Reports
          </div>

          <div className="mt-4 text-5xl font-black text-[#111827]">
            →
          </div>

        </Link>

        <Link
          href="/admin/listings"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >

          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Listings
          </div>

          <div className="mt-4 text-5xl font-black text-[#2F5D50]">
            →
          </div>

        </Link>

        <Link
          href="/admin/users"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >

          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Users
          </div>

          <div className="mt-4 text-5xl font-black text-blue-600">
            →
          </div>

        </Link>

        <Link
          href="/admin/removed"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >

          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Removed
          </div>

          <div className="mt-4 text-5xl font-black text-red-600">
            →
          </div>

        </Link>

      </div>

      {/* ADMIN TOOLS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        <Link
          href="/admin/verification"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >

          <h2 className="text-2xl font-black text-[#111827]">
            Verification Queue
          </h2>

          <p className="mt-3 text-[#374151]">
            Review and verify marketplace users.
          </p>

        </Link>

        <Link
          href="/admin/messages"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >

          <h2 className="text-2xl font-black text-[#111827]">
            Admin Messages
          </h2>

          <p className="mt-3 text-[#374151]">
            Review user contact requests.
          </p>

        </Link>

      </div>

    </main>
  );
}
