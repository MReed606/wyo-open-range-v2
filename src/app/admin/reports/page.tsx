"use client";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminReportsPage() {


  const [reports, setReports] =
    useState<any[]>([]);

  const [notes, setNotes] =
    useState<Record<string, string>>({});

    const [viewMode, setViewMode] =
  useState<
    "open" |
    "reviewed" |
    "all"
  >("open");

  useEffect(() => {

  loadReports();

}, []);

  

  async function loadReports() {

    const { data } =
      await supabase
        .from("reports")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!data) {

      setReports([]);

      return;
    }

    const enhanced =
      await Promise.all(
        data.map(async (report) => {

          const {
  data: listing
} = await supabase
  .from("listings")
  .select("*")
  .eq(
    "id",
    report.listing_id
  )
  .maybeSingle();

const {
  data: reporter
} = await supabase
  .from("profiles")
  .select(
    "full_name,email"
  )
  .eq(
    "id",
    report.reporter_id
  )
  .maybeSingle();

let reviewer = null;

if (
  report.reviewed_by
) {

  const {
    data
  } = await supabase
    .from("profiles")
    .select(
      "full_name,email"
    )
    .eq(
      "id",
      report.reviewed_by
    )
    .maybeSingle();

  reviewer =
    data;
}
let seller = null;

if (
  listing?.owner_id
) {

  const {
    data
  } = await supabase
    .from("profiles")
    .select(
      `
      full_name,
      email,
      trust_score,
      verification_status,
      status
      `
    )
    .eq(
      "id",
      listing.owner_id
    )
    .maybeSingle();

  seller = data;
}
return {
  ...report,
  status:
    report.status ??
    "open",
  listing,
  reporter,
  reviewer,
};
        })
      );

    setReports(
      enhanced
    );

    const initialNotes:
      Record<string, string> = {};

    enhanced.forEach(
      (report) => {

        initialNotes[
          report.id
        ] =
          report.admin_notes ??
          "";

      }
    );

    setNotes(
      initialNotes
    );
  }

  async function removeListing(
    listingId: string
  ) {

    const confirmed =
      confirm(
        "Remove this listing?"
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from("listings")
        .update({
          status: "removed",
        })
        .eq(
          "id",
          listingId
        );

    if (error) {

      console.error(
        error
      );

      alert(
        "Failed to remove listing."
      );

      return;
    }

    alert(
      "Listing removed."
    );

    await loadReports();
  }

  async function updateReport(
    reportId: string,
    updates: any
  ) {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { error } =
      await supabase
        .from("reports")
        .update({
          ...updates,
          reviewed_by:
            user.id,
          reviewed_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          reportId
        );

    if (error) {

      console.error(
        error
      );

      alert(
        "Unable to update report."
      );

      return;
    }

    await loadReports();
  }

  async function saveNotes(
    reportId: string
  ) {

    await updateReport(
      reportId,
      {
        admin_notes:
          notes[
            reportId
          ] ?? "",
      }
    );

  }

  function getStatusColor(
    status: string
  ) {

    switch (
      status
    ) {

      case "valid":
        return "bg-green-100 text-green-700";

      case "invalid":
        return "bg-yellow-100 text-yellow-700";

      case "resolved":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-red-100 text-red-700";
    }
  }

  return (
    <>
      <AuthGuard />
<AdminGuard />
      <main className="min-h-screen bg-[#F7F5F2] p-10">

        <h1 className="mb-8 text-4xl font-black text-[#111827]">
          Reported Listings
        </h1>

        {!reports.length && (

          <div className="rounded-3xl bg-white p-10 shadow-sm">

            <h2 className="text-2xl font-black text-[#111827]">
              No reports found
            </h2>

          </div>

        )}

<div className="mb-8 flex flex-wrap gap-3">

  <button
    onClick={() =>
      setViewMode("open")
    }
    className={`rounded-xl px-5 py-3 font-bold ${
      viewMode === "open"
        ? "bg-[#2F5D50] text-white"
        : "bg-white text-[#111827]"
    }`}
  >
    Open Reports
  </button>

  <button
    onClick={() =>
      setViewMode("reviewed")
    }
    className={`rounded-xl px-5 py-3 font-bold ${
      viewMode === "reviewed"
        ? "bg-[#2F5D50] text-white"
        : "bg-white text-[#111827]"
    }`}
  >
    Reviewed Reports
  </button>

  <button
    onClick={() =>
      setViewMode("all")
    }
    className={`rounded-xl px-5 py-3 font-bold ${
      viewMode === "all"
        ? "bg-[#2F5D50] text-white"
        : "bg-white text-[#111827]"
    }`}
  >
    All Reports
  </button>

</div>

        <div className="space-y-6">

          {reports
  .filter((report) => {

    const status =
      report.status ??
      "open";

    if (
      viewMode ===
      "open"
    ) {
      return (
        status ===
        "open"
      );
    }

    if (
      viewMode ===
      "reviewed"
    ) {
      return (
        status ===
          "valid" ||

        status ===
          "invalid"
      );
    }

    return true;

  })
  .map((report) => (

            <div
              key={report.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >

              <div className="flex flex-col gap-6 lg:flex-row">

                {report.listing
                  ?.image_url && (

                  <img
                    src={
                      report.listing
                        .image_url
                    }
                    alt={
                      report.listing
                        ?.title ?? ""
                    }
                    className="h-48 w-full rounded-2xl object-cover lg:w-72"
                  />

                )}

                <div className="flex-1">

                  <h2 className="text-3xl font-black text-[#111827]">

                    {report.listing
                      ?.title ??

                      "Removed Listing"}

                  </h2>

                  <div className="mt-3 flex flex-wrap gap-3">

                    <div className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">

                      Listing:
                      {" "}

                      {report.listing
                        ?.status ??

                        "removed"}

                    </div>

                    <div className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${getStatusColor(
                      report.status ??
                      "open"
                    )}`}>

                      Report:
                      {" "}

                      {(report.status ??
                        "open")
                        .toUpperCase()}

                    </div>

                  </div>
<div className="mt-6 grid gap-4 md:grid-cols-2">

  <div>

    <div className="mb-2 text-sm font-black text-[#111827]">

      Reported By

    </div>

    <div className="rounded-2xl bg-gray-100 p-4">

      <div className="font-bold text-[#111827]">

        {report.reporter?.full_name ??
          "Unknown User"}

      </div>

      <div className="mt-1 text-sm text-gray-600">

        {report.reporter?.email ??
          "No Email"}

      </div>

    </div>

  </div>

  {report.reviewer && (

    <div>

      <div className="mb-2 text-sm font-black text-[#111827]">

        Reviewed By

      </div>

      <div className="rounded-2xl bg-gray-100 p-4">

        <div className="font-bold text-[#111827]">

          {report.reviewer.full_name ??
            "Admin"}

        </div>

        <div className="mt-1 text-sm text-gray-600">

          {report.reviewer.email}

        </div>

        {report.reviewed_at && (

          <div className="mt-2 text-xs text-gray-500">

            {new Date(
              report.reviewed_at
            ).toLocaleString()}

          </div>

        )}

      </div>

    </div>

  )}

</div>
                  <div className="mt-6">

                    <div className="mb-2 text-sm font-black text-[#111827]">

                      Report Reason

                    </div>

                    <div className="rounded-2xl bg-gray-100 p-4 text-[#374151]">

                      {report.reason}

                    </div>

                  </div>

                  <div className="mt-6">

                    <div className="mb-2 text-sm font-black text-[#111827]">

                      Admin Notes

                    </div>

                    <textarea
                      value={
                        notes[
                          report.id
                        ] ?? ""
                      }
                      onChange={(
                        e
                      ) =>
                        setNotes(
                          (
                            prev
                          ) => ({
                            ...prev,
                            [report.id]:
                              e.target
                                .value,
                          })
                        )
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-gray-200 p-4 text-[#111827]"
                    />

                  </div>

                  {report.reviewed_at && (

                    <div className="mt-4 text-sm text-gray-500">

                      Reviewed:
                      {" "}

                      {new Date(
                        report.reviewed_at
                      ).toLocaleString()}

                    </div>

                  )}

                  <div className="mt-6 flex flex-wrap gap-4">

                    {report.listing && (

                      <Link
                        href={`/listing/${report.listing.slug}`}
                        className="rounded-xl border border-[#2F5D50] px-5 py-3 font-bold text-[#2F5D50]"
                      >
                        Open Listing
                      </Link>

                    )}

                    <button
                      onClick={() =>
                        saveNotes(
                          report.id
                        )
                      }
                      className="rounded-xl bg-[#2F5D50] px-5 py-3 font-bold text-white"
                    >
                      Save Notes
                    </button>

                    <button
                      onClick={() =>
                        updateReport(
                          report.id,
                          {
                            status:
                              "valid",
                          }
                        )
                      }
                      className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white"
                    >
                      Mark Valid
                    </button>

                    <button
                      onClick={() =>
                        updateReport(
                          report.id,
                          {
                            status:
                              "invalid",
                          }
                        )
                      }
                      className="rounded-xl bg-yellow-600 px-5 py-3 font-bold text-white"
                    >
                      Dismiss
                    </button>

                    {report.listing
                      ?.status !==
                      "removed" && (

                      <button
                        onClick={() =>
                          removeListing(
                            report
                              .listing
                              .id
                          )
                        }
                        className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
                      >
                        Remove Listing
                      </button>

                    )}

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

    </>
  );
}