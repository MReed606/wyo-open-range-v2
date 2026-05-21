"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

import { isAdmin } from "@/lib/admin";

export default function AdminUsersPage() {

  const [users, setUsers] =
    useState<any[]>([]);

  useEffect(() => {
    checkAdmin();
    loadUsers();
  }, []);

  async function checkAdmin() {

    const admin =
      await isAdmin();

    if (!admin) {
      window.location.href = "/";
    }
  }

  async function loadUsers() {

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setUsers(data ?? []);
  }

  async function toggleBadge(
    userId: string,
    field: string,
    value: boolean
  ) {

    await supabase
      .from("profiles")
      .update({
        [field]: value,
      })
      .eq("id", userId);

    loadUsers();
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-7xl">

          <h1 className="mb-10 text-5xl font-black text-[#111827]">
            User Management
          </h1>

          <div className="space-y-6">

            {users.map((user) => (

              <div
                key={user.id}
                className="rounded-3xl bg-white p-8 shadow-sm"
              >

                <div className="flex flex-wrap items-start justify-between gap-8">

                  <div>

                    <h2 className="text-3xl font-black text-[#111827]">
                      {user.full_name ?? "Unnamed User"}
                    </h2>

                    <div className="mt-4 space-y-2 text-[#374151]">

                      <p>{user.email}</p>

                      <p>{user.phone}</p>

                      <p>
                        Role:
                        {" "}
                        {user.role ?? "user"}
                      </p>

                    </div>

                  </div>

                  <div className="grid gap-3 md:grid-cols-2">

                    {[
                      ["verified_badge", "Verified"],
                      ["trusted_seller_badge", "Trusted Seller"],
                      ["premium_seller_badge", "Premium Seller"],
                      ["moderator_badge", "Moderator"],
                      ["business_badge", "Business"],
                      ["admin_badge", "Admin"],
                    ].map(([field, label]) => (

                      <label
                        key={field}
                        className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3 font-bold text-[#111827]"
                      >

                        <input
                          type="checkbox"
                          checked={user[field]}
                          onChange={(e) =>
                            toggleBadge(
                              user.id,
                              field,
                              e.target.checked
                            )
                          }
                        />

                        {label}

                      </label>

                    ))}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>
    </>
  );
}
