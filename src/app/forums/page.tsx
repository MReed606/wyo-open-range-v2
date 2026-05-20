"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ForumsPage() {

  const [posts, setPosts] =
    useState<any[]>([]);

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [category,
    setCategory] =
    useState("General");

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

  async function createPost() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    await supabase
      .from("forum_posts")
      .insert({
        title,
        content,
        category,
        user_id: user.id,
        username:
          profile?.full_name ??
          "User",
      });

    setTitle("");

    setContent("");

    loadPosts();
  }

  return (
    <>
      <AuthGuard />

      <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-8 text-5xl font-black text-[#111827]">
            Forums
          </h1>

          {/* CREATE POST */}

          <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-3xl font-black text-[#111827]">
              Create Discussion
            </h2>

            <div className="space-y-5">

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Discussion title..."
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
              >

                <option>
                  General
                </option>

                <option>
                  Ranching
                </option>

                <option>
                  Equipment
                </option>

                <option>
                  Livestock
                </option>

                <option>
                  Vehicles
                </option>

                <option>
                  Community
                </option>

              </select>

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
                placeholder="Start discussion..."
                rows={6}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
              />

              <button
                onClick={createPost}
                className="rounded-2xl bg-[#2F5D50] px-8 py-4 text-lg font-black text-white"
              >
                Post Discussion
              </button>

            </div>

          </div>

          {/* POSTS */}

          <div className="space-y-6">

            {posts.map((post) => (

              <div
                key={post.id}
                className="rounded-3xl bg-white p-8 shadow-sm"
              >

                <div className="mb-4 flex flex-wrap items-center gap-3">

                  <div className="rounded-full bg-[#2F5D50]/10 px-3 py-1 text-xs font-black text-[#2F5D50]">
                    {post.category}
                  </div>

                  <div className="text-sm font-bold text-gray-500">
                    {new Date(
                      post.created_at
                    ).toLocaleDateString()}
                  </div>

                </div>

                <h2 className="text-3xl font-black text-[#111827]">
                  {post.title}
                </h2>

                <div className="mt-3 text-sm font-bold text-gray-500">
                  Posted by:
                  {" "}
                  {post.username}
                </div>

                <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-[#374151]">
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
