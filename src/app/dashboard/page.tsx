"use client";

import { ProfileCompletionGuard } from "@/components/auth/ProfileCompletionGuard";

export default function DashboardPage() {
  return (
    <>
      <ProfileCompletionGuard />

      <main className="min-h-screen bg-[#F7F5F2] px-6 py-10">

        <div className="mx-auto max-w-7xl">

          <h1 className="text-4xl font-black text-[#111827]">
            Dashboard
          </h1>

          <p className="mt-3 text-lg text-[#374151]">
            Manage your listings, messages, and marketplace activity.
          </p>

        </div>

      </main>
    </>
  );
}
