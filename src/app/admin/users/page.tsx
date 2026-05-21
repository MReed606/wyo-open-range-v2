"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { isAdmin } from "@/lib/admin";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminUsersPage() {

  const [users, setUsers] =
    useState<any[]>([]);

  
  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {

    const admin =
      await isAdmin();

    if (!admin) {

      window.location.href =
        "/";
    }
  }


  useEffect(() => {
    loadUsers();
  }, []);

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

  async function setBadge(
    userId: string,
    badge: string
  ) {

    await supabase
      .from("profiles")
      .update({
        badge
      })
      .eq("id", userId);

    loadUsers();
  }

  async function suspendUser(
    userId: string
  ) {

    await supabase
      .from("profiles")
      .update({
        suspended: true
      })
      .eq("id", userId);

    loadUsers();
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-7xl">

          <h1 className="mb-8 text-5xl font-black text-[#111827]">
            User Management
          </h1>

          <div className="space-y-6">

            {users.map((user) => (

              <div
                key={user.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >

                <div className="flex flex-wrap items-start justify-between gap-6">

                  <div>

                    <h2 className="text-3xl font-black text-[#111827]">
                      {user.full_name ?? "Unnamed User"}
                    </h2>

                    <div className="mt-4 space-y-2 text-[#374151]">

                      <p>{user.email}</p>

                      <p>{user.phone}</p>

                      <p>
                        Badge:
                        {" "}
                        {user.badge ?? "None"}
                      </p>

                      <p>
                        Trust Score:
                        {" "}
                        {user.trust_score ?? 100}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        setBadge(
                          user.id,
                          "Trusted Seller"
                        )
                      }
                      className="rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white"
                    >
                      Trusted
                    </button>

                    <button
                      onClick={() =>
                        setBadge(
                          user.id,
                          "Business"
                        )
                      }
                      className="rounded-2xl bg-purple-600 px-4 py-3 font-bold text-white"
                    >
                      Business
                    </button>

                    <button
                      onClick={() =>
                        suspendUser(
                          user.id
                        )
                      }
                      className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
                    >
                      Suspend
                    </button>

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
