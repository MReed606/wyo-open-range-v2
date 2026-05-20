"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

      <h1 className="mb-8 text-4xl font-black text-[#111827]">
        Admin Users
      </h1>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-[#F8FAFC]">

              <tr>

                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Joined</th>
                <th className="px-6 py-4 text-left">Restriction</th>
                <th className="px-6 py-4 text-left">Suspension</th>
                <th className="px-6 py-4 text-left">Reason</th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => {

                const moderation =
                  user.user_moderation?.[0];

                return (

                  <tr
                    key={user.id}
                    className="border-t border-gray-100"
                  >

                    <td className="px-6 py-5 font-bold text-[#111827]">
                      <Link
                        href={`/seller/profile/${user.id}`}
                        className="hover:text-[#2F5D50]"
                      >
                        {user.username ?? "Unnamed User"}
                      </Link>
                    </td>

                    <td className="px-6 py-5">
                      {new Date(
                        user.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-5">

                      {moderation?.posting_restricted_until
                        ? "Restricted"
                        : "Active"}

                    </td>

                    <td className="px-6 py-5">

                      {moderation?.suspended_until
                        ? "Suspended"
                        : "Active"}

                    </td>

                    <td className="px-6 py-5">
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
