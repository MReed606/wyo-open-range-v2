"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminUsersPage() {

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {

    const { data } = await supabase
      .from("profiles")
      .select(`
        id,
        username,
        created_at,
        user_moderation (
          posting_restricted_until,
          suspended_until,
          public_reason
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    setUsers(data ?? []);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <div className="mb-8">

        <h1 className="text-4xl font-black text-[#111827]">
          Admin Users
        </h1>

        <p className="mt-2 text-lg text-[#374151]">
          User moderation and account overview.
        </p>

      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="border-b border-gray-200 bg-[#F8FAFC]">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                  Username
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                  Joined
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                  Posting Restriction
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                  Suspension
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                  Public Reason
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => {

                const moderation =
                  user.user_moderation?.[0];

                return (

                  <tr
                    key={user.id}
                    className="border-b border-gray-100"
                  >

                    <td className="px-6 py-5 font-bold text-[#111827]">
                      {user.username ?? "Unnamed User"}
                    </td>

                    <td className="px-6 py-5 text-[#374151]">
                      {new Date(
                        user.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-5">

                      {moderation?.posting_restricted_until ? (

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                          Restricted
                        </span>

                      ) : (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                          Active
                        </span>

                      )}

                    </td>

                    <td className="px-6 py-5">

                      {moderation?.suspended_until ? (

                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                          Suspended
                        </span>

                      ) : (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                          Active
                        </span>

                      )}

                    </td>

                    <td className="px-6 py-5 text-[#374151]">
                      {moderation?.public_reason ?? "-"}
                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}
