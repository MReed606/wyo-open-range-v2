"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [reports, setReports] = useState<any[]>([]);

  const [restrictionDays, setRestrictionDays] = useState<Record<string, string>>({});
  const [suspensionDays, setSuspensionDays] = useState<Record<string, string>>({});

  const [internalNotes, setInternalNotes] = useState<Record<string, string>>({});
  const [publicReasons, setPublicReasons] = useState<Record<string, string>>({});

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
        reporter_id,
        listings (
          id,
          title,
          status,
          owner_id,
          image_url,
          created_at,
          slug
        )
      `)
      .order("created_at", { ascending: false });

    setReports(data ?? []);
  }

  async function createModerationNote(
    targetUserId: string,
    noteType: string
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!internalNotes[targetUserId]?.trim()) {
      alert("Internal admin note required.");
      return false;
    }

    await supabase
      .from("moderation_notes")
      .insert({
        target_user_id: targetUserId,
        admin_user_id: user?.id,
        note_type: noteType,
        internal_note: internalNotes[targetUserId],
        public_reason: publicReasons[targetUserId] ?? "",
      });

    return true;
  }

  async function removeListing(
    listingId: string,
    ownerId: string
  ) {
    const success = await createModerationNote(
      ownerId,
      "listing_removed"
    );

    if (!success) return;

    await supabase
      .from("listings")
      .update({
        status: "removed",
        removal_reason:
          publicReasons[ownerId] ?? "",
      })
      .eq("id", listingId);

    loadReports();
    loadStats();

    alert("Listing removed");
  }

  async function restrictPosting(
    userId: string,
    days: number
  ) {
    const success = await createModerationNote(
      userId,
      "posting_restricted"
    );

    if (!success) return;

    const until = new Date();

    until.setDate(until.getDate() + days);

    await supabase
      .from("user_moderation")
      .upsert({
        user_id: userId,
        posting_restricted_until:
          until.toISOString(),
        public_reason:
          publicReasons[userId] ?? "",
      });

    alert(`Posting restricted for ${days} day(s)`);
  }

  async function suspendUser(
    userId: string,
    days: number
  ) {
    const success = await createModerationNote(
      userId,
      "user_suspended"
    );

    if (!success) return;

    const until = new Date();

    until.setDate(until.getDate() + days);

    await supabase
      .from("user_moderation")
      .upsert({
        user_id: userId,
        suspended_until:
          until.toISOString(),
        public_reason:
          publicReasons[userId] ?? "",
      });

    alert(`User suspended for ${days} day(s)`);
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-6 text-4xl font-bold text-[#111827]">
        Admin Dashboard
      </h1>

      {/* STAT CARDS */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">

        <Link
          href="/admin/users"
          className="rounded-2xl bg-white p-5 shadow transition hover:scale-[1.02]"
        >
          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Users
          </div>

          <div className="mt-2 text-4xl font-bold text-[#111827]">
            {stats.users}
          </div>
        </Link>

        <Link
          href="/admin/listings"
          className="rounded-2xl bg-white p-5 shadow transition hover:scale-[1.02]"
        >
          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Listings
          </div>

          <div className="mt-2 text-4xl font-bold text-[#111827]">
            {stats.listings}
          </div>
        </Link>

        <Link
          href="/admin/reports"
          className="rounded-2xl bg-white p-5 shadow transition hover:scale-[1.02]"
        >
          <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Reports
          </div>

          <div className="mt-2 text-4xl font-bold text-[#111827]">
            {stats.reports}
          </div>
        </Link>

        <Link
          href="/admin/removed"
          className="rounded-2xl bg-white p-5 shadow transition hover:scale-[1.02]"
        >
          <div className="text-sm font-bold uppercase tracking-wide text-red-600">
            Removed
          </div>

          <div className="mt-2 text-4xl font-bold text-red-600">
            {stats.removed}
          </div>
        </Link>

      </div>

      {/* REPORTS */}
      <div className="grid gap-5">

        {reports.map((report) => (

          <div
            key={report.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow"
          >

            {report.listings?.image_url && (
              <img
                src={report.listings.image_url}
                alt={report.listings.title}
                className="mb-5 h-48 w-full rounded-xl object-cover"
              />
            )}

            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>

                <h2 className="text-xl font-bold text-[#111827]">
                  {report.listings?.title}
                </h2>

                <div className="mt-2 space-y-1 text-sm text-[#374151]">

                  <p>
                    <span className="font-bold">Listing ID:</span>{" "}
                    {report.listings?.id}
                  </p>

                  <p>
                    <span className="font-bold">Status:</span>{" "}
                    {report.listings?.status ?? "active"}
                  </p>

                  <p>
                    <span className="font-bold">Created:</span>{" "}
                    {new Date(
                      report.listings?.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <a
                href={`/listing/${report.listings?.slug}`}
                target="_blank"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-[#111827] shadow-sm hover:bg-gray-50"
              >
                Open Listing
              </a>

            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              <div className="rounded-xl bg-red-50 p-4">

                <div className="text-sm font-bold uppercase tracking-wide text-red-600">
                  Report Reason
                </div>

                <p className="mt-2 text-sm text-[#374151]">
                  {report.reason}
                </p>

              </div>

              <div className="rounded-xl bg-[#F7F5F2] p-4 border border-gray-200">

                <div className="text-sm font-bold uppercase tracking-wide text-[#1F2933]">
                  Reporter Information
                </div>

                <div className="mt-2 space-y-1 text-sm text-[#374151]">

                  <p>
                    <span className="font-bold">Reporter ID:</span>{" "}
                    {report.reporter_id}
                  </p>

                </div>

              </div>

            </div>

            {/* INTERNAL NOTES */}
            <div className="mt-5">

              <label className="mb-2 block text-sm font-bold text-[#111827]">
                Internal Admin Note
              </label>

              <textarea
                placeholder="Required internal moderation note..."
                value={internalNotes[report.listings.owner_id] ?? ""}
                onChange={(e) =>
                  setInternalNotes({
                    ...internalNotes,
                    [report.listings.owner_id]:
                      e.target.value,
                  })
                }
                className="min-h-24 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
              />

            </div>

            {/* USER REASON */}
            <div className="mt-5">

              <label className="mb-2 block text-sm font-bold text-[#111827]">
                User-Facing Reason
              </label>

              <textarea
                placeholder="Reason visible to the affected user..."
                value={publicReasons[report.listings.owner_id] ?? ""}
                onChange={(e) =>
                  setPublicReasons({
                    ...publicReasons,
                    [report.listings.owner_id]:
                      e.target.value,
                  })
                }
                className="min-h-24 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827]"
              />

            </div>

            {/* ACTIONS */}
            <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:flex-wrap">

              <button
                onClick={() =>
                  removeListing(
                    report.listings.id,
                    report.listings.owner_id
                  )
                }
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
              >
                Remove Listing
              </button>

              {/* RESTRICT */}
              <div className="flex flex-wrap items-center gap-2">

                <select
                  value={
                    restrictionDays[
                      report.listings.owner_id
                    ] ?? "7"
                  }
                  onChange={(e) =>
                    setRestrictionDays({
                      ...restrictionDays,
                      [report.listings.owner_id]:
                        e.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-semibold text-[#111827] shadow-sm"
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
                        restrictionDays[
                          report.listings.owner_id
                        ] ?? "7"
                      )
                    )
                  }
                  className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-white"
                >
                  Restrict Posting
                </button>

              </div>

              {/* SUSPEND */}
              <div className="flex flex-wrap items-center gap-2">

                <select
                  value={
                    suspensionDays[
                      report.listings.owner_id
                    ] ?? "7"
                  }
                  onChange={(e) =>
                    setSuspensionDays({
                      ...suspensionDays,
                      [report.listings.owner_id]:
                        e.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-semibold text-[#111827] shadow-sm"
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
                        suspensionDays[
                          report.listings.owner_id
                        ] ?? "7"
                      )
                    )
                  }
                  className="rounded-lg bg-black px-4 py-2 font-bold text-white"
                >
                  Suspend User
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
