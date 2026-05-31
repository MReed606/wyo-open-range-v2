import {
  Brain,
} from "lucide-react";

export function PostHero() {

  return (

    <div className="mb-10 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#2F5D50] to-[#1F2933] p-10 text-white shadow-xl">

      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black backdrop-blur">

        <Brain className="h-4 w-4" />

        AI Marketplace Safety

      </div>

      <h1 className="text-5xl font-black">

        Create Listing

      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">

        Intelligent marketplace protection,
        scam prevention, spam detection,
        and trust-aware listing validation.

      </p>

    </div>

  );
}