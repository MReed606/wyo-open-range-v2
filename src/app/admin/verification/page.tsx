"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminVerificationPage() {

  const [users, setUsers] =
    useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setUsers(data ?? []);
  }

  async function verifyUser(
    id: string
  ) {

    await supabase
      .from("profiles")
      .update({
        verified: true,
        verification_status:
          "verified",
      })
      .eq("id", id);

    loadUsers();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Verification Queue
      </h1>

      <div className="grid gap-5">

        {users.map((user) => (

          <div
            key={user.id}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-[#111827]">
                  {user.username ??
                    "Unnamed User"}
                </h2>

                <div className="mt-2 flex flex-wrap gap-3">

                  <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                    {user.role ?? "user"}
                  </div>

                  {user.verified ? (

                    <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                      Verified
                    </div>

                  ) : (

                    <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                      Pending Verification
                    </div>

                  )}

                </div>

              </div>

              {!user.verified && (

                <button
                  onClick={() =>
                    verifyUser(user.id)
                  }
                  className="rounded-xl bg-[#2F5D50] px-5 py-3 font-bold text-white"
                >
                  Verify User
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
