"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminReportsPage() {

  const [reports, setReports] =
    useState<any[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {

    const { data } = await supabase
      .from("reports")
      .select(`
        *,
        listings (
          id,
          title,
          image_url,
          owner_id,
          slug
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    setReports(data ?? []);
  }

  async function removeListing(
    listingId: string
  ) {

    const confirmed =
      confirm(
        "Remove this listing?"
      );

    if (!confirmed) return;

    await supabase
      .from("listings")
      .update({
        status: "removed",
      })
      .eq("id", listingId);

    alert("Listing removed.");

    loadReports();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Reported Listings
      </h1>

      {!reports.length && (

        <div className="rounded-3xl bg-white p-10 shadow-sm">

          <h2 className="text-2xl font-black text-[#111827]">
            No reports found
          </h2>

          <p className="mt-3 text-[#374151]">
            Everything currently looks clean.
          </p>

        </div>

      )}

      <div className="space-y-6">

        {reports.map((report) => (

          <div
            key={report.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >

            <div className="flex flex-col gap-6 lg:flex-row">

              {report.listings
                ?.image_url && (

                <img
                  src={
                    report.listings
                      .image_url
                  }
                  alt={
                    report.listings
                      .title
                  }
                  className="h-48 w-full rounded-2xl object-cover lg:w-72"
                />

              )}

              <div className="flex-1">

                <h2 className="text-3xl font-black text-[#111827]">
                  {report.listings
                    ?.title ??
                    "Unknown Listing"}
                </h2>

                <div className="mt-4 space-y-2 text-[#374151]">

                  <p>
                    <span className="font-bold">
                      Reason:
                    </span>{" "}
                    {report.reason ??
                      "No reason"}
                  </p>

                  <p>
                    <span className="font-bold">
                      Reporter:
                    </span>{" "}
                    {report.reporter_id}
                  </p>

                  <p>
                    <span className="font-bold">
                      Listing Owner:
                    </span>{" "}
                    {report.listings
                      ?.owner_id}
                  </p>

                </div>

                <div className="mt-6 flex flex-wrap gap-4">

                  <Link
                    href={`/listing/${report.listings?.slug}`}
                    className="rounded-xl border border-[#2F5D50] px-5 py-3 font-bold text-[#2F5D50]"
                  >
                    Open Listing
                  </Link>

                  <button
                    onClick={() =>
                      removeListing(
                        report.listings
                          ?.id
                      )
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
                  >
                    Remove Listing
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
