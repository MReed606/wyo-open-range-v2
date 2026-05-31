import {
  Brain,
  TrendingUp,
} from "lucide-react";

export function AdminHero() {

  return (

    <div className="mb-10 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#111827] to-[#1F2937] p-10 text-white shadow-xl">

      <div className="flex flex-wrap items-center justify-between gap-8">

        <div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black backdrop-blur">

            <Brain className="h-4 w-4" />

            AI Marketplace Moderation

          </div>

          <h1 className="text-5xl font-black">

            Admin Command Center

          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">

            Marketplace intelligence, trust enforcement,
            moderation analytics, safety systems,
            and realtime platform oversight.

          </p>

        </div>

        <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

          <div className="text-sm font-black uppercase tracking-wide text-white/60">

            Marketplace Health

          </div>

          <div className="mt-3 text-5xl font-black">

            96%

          </div>

          <div className="mt-3 flex items-center gap-2 text-green-300">

            <TrendingUp className="h-5 w-5" />

            Stable & Protected

          </div>

        </div>

      </div>

    </div>

  );
}