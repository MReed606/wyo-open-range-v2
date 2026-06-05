"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { isAdmin } from "@/lib/admin";

export function AdminGuard() {

  const router = useRouter();

  const [checking,
    setChecking] =
    useState(true);

  useEffect(() => {

    checkAdmin();

  }, []);

  async function checkAdmin() {

    const admin =
      await isAdmin();

    if (!admin) {

      router.push("/");

      return;
    }

    setChecking(false);

  }

  if (checking) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F2]">

        <div className="rounded-3xl bg-white p-10 shadow-sm">

          <h1 className="text-3xl font-black text-[#111827]">

            Checking Admin Access...

          </h1>

        </div>

      </div>

    );

  }

  return null;
}