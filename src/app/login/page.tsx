"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [mode, setMode] =
    useState<"login" | "signup">(
      "login"
    );

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [status,
    setStatus] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  async function handleAuth(
    event?: React.FormEvent
  ) {
    event?.preventDefault();

    setStatus("Working...");

    if (mode === "signup") {
      const { error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: "New",
              last_name: "User",
            },
          },
        });

      if (error) {
        setStatus(
          error.message
        );
        return;
      }

      setStatus(
        "Signup created. Check your email if confirmation is required."
      );

      return;
    }

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setStatus(
        error.message
      );
      return;
    }

    setStatus(
      "Logged in successfully."
    );

    window.location.href =
      "/dashboard";
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-20">

      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-md">

        <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">

          Wyo Open Range Account

        </p>

        <h1 className="mt-4 text-4xl font-bold text-[#1F2933]">

          {mode === "login"
            ? "Log In"
            : "Create Account"}

        </h1>

        <p className="mt-3 text-[#52606D]">

          Sign in to post listings,
          message sellers, save items,
          and build your reputation.

        </p>

        <form
          onSubmit={handleAuth}
          className="mt-8 grid gap-5"
        >

          <label className="grid gap-2">

            <span className="font-bold text-[#1F2933]">

              Email

            </span>

            <input
              className="rounded-xl border px-4 py-3 text-[#1F2933]"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              type="email"
            />

          </label>

          <label className="grid gap-2">

            <span className="font-bold text-[#1F2933]">

              Password

            </span>

            <div className="relative">

              <input
                className="w-full rounded-xl border px-4 py-3 pr-12 text-[#1F2933]"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Minimum 6 characters"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >

                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}

              </button>

            </div>

          </label>

          <button
            type="submit"
            className="rounded-xl bg-[#2F5D50] px-5 py-3 font-semibold text-white transition hover:bg-[#24493f]"
          >

            {mode === "login"
              ? "Log In"
              : "Create Account"}

          </button>

          <button
            type="button"
            onClick={() => {

              setMode(
                mode === "login"
                  ? "signup"
                  : "login"
              );

              setStatus("");

            }}
            className="rounded-xl border border-[#2F5D50] px-5 py-3 font-semibold text-[#2F5D50]"
          >

            {mode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Log in"}

          </button>

          {status && (

            <div className="rounded-xl bg-[#F7F5F2] p-4 text-sm font-semibold text-[#1F2933]">

              {status}

            </div>

          )}

        </form>

      </div>

    </main>
  );
}