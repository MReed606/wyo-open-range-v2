"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function ReportListingButton({
  listingId,
}: {
  listingId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");

  async function submitReport() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (!reason.trim()) {
      setStatus("Enter a reason.");
      return;
    }

    const { error } = await supabase.from("reports").insert({
      listing_id: listingId,
      reporter_id: user.id,
      reason,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Report submitted");
    setReason("");

    setTimeout(() => {
      setOpen(false);
      setStatus("");
    }, 1500);
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-red-700 font-semibold hover:underline"
        >
          Report Listing
        </button>
      ) : (
        <div className="rounded-xl border bg-white p-4">
          <textarea
            placeholder="Why are you reporting this?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-[#111827]"
          />

          <button
            onClick={submitReport}
            className="mt-3 w-full rounded-xl bg-red-600 px-4 py-2 text-white font-bold"
          >
            Submit Report
          </button>

          {status && (
            <p className="mt-2 text-sm font-semibold">
              {status}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
