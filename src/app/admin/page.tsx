"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [reports, setReports] = useState<any[]>([]);

  const [restrictionDays, setRestrictionDays] = useState<Record<string, string>>({});
  const [suspensionDays, setSuspensionDays] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    reports: 0,
    removed: 0,
  });

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

      loadStats();
      loadReports();
    }

    checkAdmin();
  }, []);

  async function loadStats() {
    const [{ count: users }, { count: listings }, { count: reports }, { count: removed }] =
      await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("listings").select("*", { count: "exact", head: true }),
        supabase.from("reports").select("*", { count: "exact", head: true }),
        supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("status", "removed"),
      ]);

    setStats({
      users: users ?? 0,
      listings: listings ?? 0,
      reports: reports ?? 0,
      removed: removed ?? 0,
    });
  }

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
          status,
          owner_id
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
    loadStats();
  }

  async function restrictPosting(userId: string, days: number) {
    const until = new Date();

    until.setDate(until.getDate() + days);

    await supabase
      .from("user_moderation")
      .upsert({
        user_id: userId,
        posting_restricted_until: until.toISOString(),
      });

    alert(`Posting restricted for ${days} day(s)`);
  }

  async function suspendUser(userId: string, days: number) {
    const until = new Date();

    until.setDate(until.getDate() + days);

    await supabase
      .from("user_moderation")
      .upsert({
        user_id: userId,
        suspended_until: until.toISOString(),
      });

    alert(`User suspended for ${days} day(s)`);
  }

  async function saveAdminNotes(userId: string) {
    await supabase
      .from("user_moderation")
      .upsert({
        user_id: userId,
        admin_notes: notes[userId] ?? "",
      });

    alert("Admin notes saved");
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-6 text-4xl font-bold text-[#111827]">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Users
          </div>

          <div className="mt-2 text-4xl font-bold text-[#111827]">
            {stats.users}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Listings
          </div>

          <div className="mt-2 text-4xl font-bold text-[#111827]">
            {stats.listings}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Reports
          </div>

          <div className="mt-2 text-4xl font-bold text-[#111827]">
            {stats.reports}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="text-sm font-bold uppercase tracking-wide text-red-600">
            Removed
          </div>

          <div className="mt-2 text-4xl font-bold text-red-600">
            {stats.removed}
          </div>
        </div>

      </div>

      {/* REPORTS */}
      <div className="grid gap-5">

        {reports.map((report) => (

          <div
            key={report.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow"
          >

            <h2 className="text-xl font-bold text-[#111827]">
              {report.listings?.title}
            </h2>

            <p className="mt-2 text-sm text-[#374151]">
              {report.reason}
            </p>

            {/* ACTIONS */}
            <div className="mt-5 flex flex-wrap gap-3">

              <button
                onClick={() =>
                  removeListing(report.listings.id)
                }
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
              >
                Remove Listing
              </button>

              {/* RESTRICT */}
              <div className="flex items-center gap-2">

                <select
                  value={restrictionDays[report.listings.owner_id] ?? "7"}
                  onChange={(e) =>
                    setRestrictionDays({
                      ...restrictionDays,
                      [report.listings.owner_id]: e.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="9999">Permanent</option>
                </select>

                <button
                  onClick={() =>
                    restrictPosting(
                      report.listings.owner_id,
                      Number(
                        restrictionDays[report.listings.owner_id] ?? "7"
                      )
                    )
                  }
                  className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-white"
                >
                  Restrict Posting
                </button>

              </div>

              {/* SUSPEND */}
              <div className="flex items-center gap-2">

                <select
                  value={suspensionDays[report.listings.owner_id] ?? "7"}
                  onChange={(e) =>
                    setSuspensionDays({
                      ...suspensionDays,
                      [report.listings.owner_id]: e.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="9999">Permanent</option>
                </select>

                <button
                  onClick={() =>
                    suspendUser(
                      report.listings.owner_id,
                      Number(
                        suspensionDays[report.listings.owner_id] ?? "7"
                      )
                    )
                  }
                  className="rounded-lg bg-black px-4 py-2 font-bold text-white"
                >
                  Suspend User
                </button>

              </div>

            </div>

            {/* NOTES */}
            <div className="mt-5">

              <textarea
                placeholder="Admin notes..."
                value={notes[report.listings.owner_id] ?? ""}
                onChange={(e) =>
                  setNotes({
                    ...notes,
                    [report.listings.owner_id]: e.target.value,
                  })
                }
                className="min-h-24 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
              />

              <button
                onClick={() =>
                  saveAdminNotes(report.listings.owner_id)
                }
                className="mt-3 rounded-lg bg-[#1F2933] px-4 py-2 font-bold text-white"
              >
                Save Notes
              </button>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
