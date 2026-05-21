"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

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

  function isProtected(
    userId: string
  ) {

    const targetUser =
      users.find(
        (u) =>
          u.id === userId
      );

    return (
      targetUser?.protected_admin
    );
  }

  async function toggleBadge(
    userId: string,
    field: string,
    value: boolean
  ) {

    if (
      isProtected(userId)
    ) {

      alert(
        "Protected owner account"
      );

      return;
    }

    let payload: any = {
      [field]: value,
    };

    // ADMIN LINK

    if (
      field ===
      "admin_badge"
    ) {

      payload = {
        admin_badge: value,

        role:
          value
            ? "admin"
            : "user",
      };
    }

    const { error } =
      await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId);

    if (error) {

      console.error(error);

      alert(error.message);

      return;
    }

    loadUsers();
  }

  async function toggleSuspend(
    userId: string,
    suspended: boolean
  ) {

    if (
      isProtected(userId)
    ) {

      alert(
        "Protected owner account"
      );

      return;
    }

    await supabase
      .from("profiles")
      .update({
        suspended:
          !suspended,
      })
      .eq("id", userId);

    loadUsers();
  }

  async function deleteUser(
    userId: string
  ) {

    if (
      isProtected(userId)
    ) {

      alert(
        "Protected owner account"
      );

      return;
    }

    const confirmed =
      confirm(
        "Delete this user permanently?"
      );

    if (!confirmed) {
      return;
    }

    await supabase
      .from("listings")
      .delete()
      .eq("owner_id", userId);

    await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    loadUsers();
  }

  const badges = [

    [
      "verified_badge",
      "Verified",
    ],

    [
      "trusted_seller_badge",
      "Trusted Seller",
    ],

    [
      "premium_seller_badge",
      "Premium Seller",
    ],

    [
      "moderator_badge",
      "Moderator",
    ],

    [
      "business_badge",
      "Business",
    ],

    [
      "admin_badge",
      "Admin",
    ],

    [
      "owner_badge",
      "Site Owner / Programmer",
    ],

  ];

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
                      {user.full_name ??
                        "Unnamed User"}
                    </h2>

                    <div className="mt-4 space-y-2 text-[#374151]">

                      <p>
                        {user.email}
                      </p>

                      <p>
                        Role:
                        {" "}
                        {user.role ??
                          "user"}
                      </p>

                      {user.protected_admin && (

                        <div className="mt-4 rounded-2xl bg-red-100 px-4 py-2 font-black text-red-700">
                          Protected Owner Account
                        </div>

                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      <button
                        onClick={() =>
                          toggleSuspend(
                            user.id,
                            user.suspended
                          )
                        }
                        className="rounded-2xl bg-yellow-500 px-5 py-3 font-black text-white"
                      >
                        {user.suspended
                          ? "Unsuspend User"
                          : "Suspend User"}
                      </button>

                      <Link
                        href={`/seller/profile/${user.id}`}
                        className="rounded-2xl bg-[#111827] px-5 py-3 font-black text-white"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={() => {
                          window.location.href =
                            `/messages?user=${user.id}`;
                        }}
                        className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
                      >
                        Message User
                      </button>

                      <button
                        onClick={() =>
                          deleteUser(
                            user.id
                          )
                        }
                        className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white"
                      >
                        Delete User
                      </button>

                    </div>

                  </div>

                  {/* BADGES */}

                  <div className="grid gap-3 md:grid-cols-2">

                    {badges.map(
                      ([field, label]) => (

                        <label
                          key={field}
                          className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3 font-bold text-[#111827]"
                        >

                          <input
                            type="checkbox"
                            checked={
                              user[field]
                            }
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

                      )
                    )}

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
