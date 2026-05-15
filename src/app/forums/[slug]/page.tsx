import { forumThreads } from "@/data/forums";

type ForumThreadPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ForumThreadPage({
  params,
}: ForumThreadPageProps) {
  const { slug } = await params;

  const thread = forumThreads.find((item) => item.slug === slug);

  if (!thread) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-md">
          <h1 className="text-4xl font-bold text-[#1F2933]">
            Discussion Not Found
          </h1>

          <p className="mt-4 text-lg text-[#52606D]">
            The discussion you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
            {thread.category} • {thread.region}
          </p>

          <h1 className="mt-4 text-4xl font-bold text-[#1F2933]">
            {thread.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#52606D]">
            <span className="rounded-full bg-[#F7F5F2] px-4 py-2">
              {thread.status}
            </span>

            <span className="rounded-full bg-[#F7F5F2] px-4 py-2">
              {thread.replies} replies
            </span>

            <span className="rounded-full bg-[#F7F5F2] px-4 py-2">
              {thread.views} views
            </span>
          </div>

          <p className="mt-8 text-lg leading-8 text-[#52606D]">
            {thread.body}
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold text-[#1F2933]">
            Replies
          </h2>

          {[1, 2, 3].map((reply) => (
            <div key={reply} className="mt-5 rounded-xl bg-[#F7F5F2] p-5">
              <p className="font-bold text-[#1F2933]">
                Wyoming Member {reply}
              </p>

              <p className="mt-2 text-[#52606D]">
                This is sample reply content showing how community discussions
                will look once real users are active.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
