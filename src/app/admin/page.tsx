"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ADMIN_EMAILS = [
        "mathewrreed88@gmail.com"
      ];

      if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
        router.push("/");
        return;
      }

      setAuthorized(true);

      loadReports();
    }

    checkAdmin();
  }, []);

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

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">
      <h1 className="mb-6 text-4xl font-bold text-[#111827]">
        Admin Reports
      </h1>

      <div className="grid gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow"
          >
            <h2 className="text-lg font-bold text-[#111827]">
              {report.listings?.title}
            </h2>

            <p className="mt-2 text-sm text-[#374151]">
              {report.reason}
            </p>

            <button
              onClick={() =>
                removeListing(report.listings.id)
              }
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
            >
              Remove Listing
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}