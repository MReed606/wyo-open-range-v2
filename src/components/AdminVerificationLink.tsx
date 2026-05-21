"use client";

import Link from "next/link";

export function AdminVerificationLink() {

  return (
    <Link
      href="/admin/verification"
      className="shrink-0 text-sm font-bold text-[#1F2933]"
    >
      Verification
    </Link>
  );
}