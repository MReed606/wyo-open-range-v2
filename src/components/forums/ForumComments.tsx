"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export function ForumComments({
  postId,
}: {
  postId: string;
}) {

  const [comments,
    setComments] =
    useState<any[]>([]);

  const [content,
    setContent] =
    useState("");

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {

    const { data } =
      await supabase
        .from("forum_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", {
          ascending: true,
        });

    setComments(data ?? []);
  }

  async function createComment() {

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
      .from("forum_comments")
      .insert({
        post_id: postId,

        user_id: user.id,

        username:
          profile?.full_name ??
          "User",

        content,
      });

    setContent("");

    loadComments();
  }

  return (
    <div className="mt-8">

      <h3 className="mb-6 text-2xl font-black text-[#111827]">
        Comments
      </h3>

      <div className="mb-6 space-y-4">

        <textarea
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
          placeholder="Write a comment..."
          rows={4}
          className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-lg font-semibold text-[#111827]"
        />

        <button
          onClick={createComment}
          className="rounded-2xl bg-[#2F5D50] px-6 py-3 text-lg font-black text-white"
        >
          Post Comment
        </button>

      </div>

      <div className="space-y-4">

        {comments.map((comment) => (

          <div
            key={comment.id}
            className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-5"
          >

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div className="font-black text-[#111827]">
                {comment.username}
              </div>

              <div className="text-sm font-bold text-gray-500">
                {new Date(
                  comment.created_at
                ).toLocaleDateString()}
              </div>

            </div>

            <p className="mt-4 whitespace-pre-wrap text-[#374151]">
              {comment.content}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
