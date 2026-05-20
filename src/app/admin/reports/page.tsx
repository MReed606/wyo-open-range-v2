"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin";

export default function AdminReportsPage() {

  const router = useRouter();

  const [reports, setReports] =
    useState<any[]>([]);

  useEffect(() => {
    checkAdmin();

    loadReports();
  }, []);

  
  async function checkAdmin() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/");

      return;
    }

    if (
      !isAdminEmail(
        user.email
      )
    ) {

      router.push("/");

    }

  }


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
            .neq("status", "removed")
            .maybeSingle();

          return {
            ...report,
            listing,
          };
        })
      );

    setReports(enhanced);
  }

  async function removeListing(
    listingId: string
  ) {

    const confirmed =
      confirm(
        "Remove this listing?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from("listings")
        .update({
          status: "removed"
        })
        .eq("id", listingId);

    console.log(error);

    if (error) {

      alert(
        "Failed to remove listing."
      );

      return;
    }

    alert(
      "Listing removed."
    );

    loadReports();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Reported Listings
      </h1>


        <Link
          href="/admin/removed"
          className="rounded-xl border border-red-600 px-5 py-3 font-bold text-red-700"
        >
          Removed Listings
        </Link>


      {!reports.length && (

        <div className="rounded-3xl bg-white p-10 shadow-sm">

          <h2 className="text-2xl font-black text-[#111827]">
            No reports found
          </h2>

        </div>

      )}

      <div className="space-y-6">

        {reports.map((report) => (

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

                <div className="mt-3 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">

                  Status:
                  {" "}

                  {report.listing
                    ?.status ??

                    "removed"}

                </div>

                <div className="mt-6 flex flex-wrap gap-4">

                  {report.listing && (

                    <>

                      <Link
                        href={`/listing/${report.listing.slug}`}
                        className="rounded-xl border border-[#2F5D50] px-5 py-3 font-bold text-[#2F5D50]"
                      >
                        Open Listing
                      </Link>

                      {report.listing
                        ?.status !==
                        "removed" && (

                        <button
                          onClick={() =>
                            removeListing(
                              report.listing.id
                            )
                          }
                          className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
                        >
                          Remove Listing
                        </button>

                      )}

                    </>

                  )}

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
