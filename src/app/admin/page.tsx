"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [reports, setReports] = useState<any[]>([]);

  async function loadReports() {
    const { data } = await supabase
      .from("reports")
      .select(`
        id,
        reason,
        created_at,
        listings (
          id,
          title,
          status
        )
      `)
      .order("created_at", { ascending: false });

    setReports(data ?? []);
  }

  async function removeListing(listingId: string) {
    await supabase
      .from("listings")
      .update({ status: "removed" })
      .eq("id", listingId);

    loadReports();
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">
      <h1 className="text-4xl font-bold mb-6">
        Admin Reports
      </h1>

      <div className="grid gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-xl bg-white p-5 shadow"
          >
            <h2 className="font-bold text-lg">
              {report.listings?.title}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {report.reason}
            </p>

            <button
              onClick={() =>
                removeListing(report.listings.id)
              }
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white font-bold"
            >
              Remove Listing
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
