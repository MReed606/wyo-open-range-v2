import Link from "next/link";
import { forumThreads } from "@/data/forums";

export default function ForumsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#1F2933]">
              Community Forums
            </h1>

            <p className="mt-4 text-lg text-[#52606D]">
              Join statewide and regional discussions across Wyoming.
            </p>
          </div>

          <button className="rounded-xl bg-[#2F5D50] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24493f]">
            Start Discussion
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {["Outdoors", "Ranching", "Vehicles", "Local Alerts"].map((topic) => (
            <div key={topic} className="rounded-2xl bg-white p-5 shadow-md">
              <p className="text-lg font-bold text-[#1F2933]">{topic}</p>
              <p className="mt-2 text-sm text-[#52606D]">
                Browse discussions
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-5">
          {forumThreads.map((thread) => (
            <Link
              key={thread.slug}
              href={`/forums/${thread.slug}`}
              className="block rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
                    {thread.status}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#1F2933]">
                    {thread.title}
                  </h2>

                  <p className="mt-3 text-base text-[#52606D]">
                    {thread.category} • {thread.region}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F7F5F2] px-5 py-3 text-sm font-semibold text-[#1F2933]">
                  {thread.replies} replies • {thread.views} views
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
