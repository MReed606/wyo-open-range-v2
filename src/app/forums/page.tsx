"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ForumsPage() {

  const [posts, setPosts] =
    useState<any[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {

    const { data } =
      await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setPosts(data ?? []);
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-8 text-5xl font-black text-[#111827]">
            Forums
          </h1>

          <div className="space-y-6">

            {posts.map((post) => (

              <div
                key={post.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >

                <div className="mb-3 inline-flex rounded-full bg-[#2F5D50]/10 px-3 py-1 text-xs font-black text-[#2F5D50]">
                  {post.category}
                </div>

                <h2 className="text-3xl font-black text-[#111827]">
                  {post.title}
                </h2>

                <p className="mt-4 text-lg text-[#374151]">
                  {post.content}
                </p>

              </div>

            ))}

          </div>

        </div>

      </main>
    </>
  );
}
