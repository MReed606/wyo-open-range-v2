"use client";

import Link from "next/link";

import { MarketplaceAnnouncements } from "@/components/home/MarketplaceAnnouncements";

import { MarketplaceStats } from "@/components/dashboard/MarketplaceStats";

import { TrendingListings } from "@/components/home/TrendingListings";

import { MarketplaceLiveFeed } from "@/components/home/MarketplaceLiveFeed";

export default function HomePage() {

  const categories = [
    "Livestock",
    "Equipment",
    "Vehicles",
    "Land",
    "Hay",
    "Services",
  ];

  return (
    <main className="min-h-screen bg-[#F7F5F2]">

      {/* HERO */}

      <section className="relative overflow-hidden">

        <img
          src="/wyoming-hero.jpg"
          alt="Wyoming Mountains"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-start justify-center px-6 py-20 md:px-10">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black tracking-wide text-white backdrop-blur">
              Wyoming Community Marketplace
            </div>

            <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">
              Buy, Sell, Trade,
              <br />
              and Connect Across Wyoming
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-white/90">
              Wyoming's modern marketplace for ranching,
              livestock, equipment, vehicles,
              land, services, and community discussion.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/listings"
                className="rounded-2xl bg-[#2F5D50] px-8 py-5 text-lg font-black text-white transition hover:bg-[#24473d]"
              >
                Browse Marketplace
              </Link>

              <Link
                href="/signup"
                className="rounded-2xl border border-white/40 bg-white/10 px-8 py-5 text-lg font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                Start Selling
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="px-6 py-16 md:px-10">

        <div className="mx-auto max-w-7xl">

          <MarketplaceAnnouncements />

          <MarketplaceStats />

          {/* CATEGORIES */}

          <section className="mt-20">

            <div className="mb-10">

              <h2 className="text-5xl font-black text-[#111827]">
                Explore Categories
              </h2>

              <p className="mt-4 text-xl text-[#374151]">
                Browse Wyoming's growing marketplace.
              </p>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

              {categories.map((category) => (

                <Link
                  key={category}
                  href={`/listings`}
                  className="market-card rounded-3xl bg-white p-10 shadow-sm"
                >

                  <h3 className="text-3xl font-black text-[#111827]">
                    {category}
                  </h3>

                  <p className="mt-4 text-lg text-[#374151]">
                    Explore listings in {category}.
                  </p>

                </Link>

              ))}

            </div>

          </section>

          {/* TRENDING */}

          <TrendingListings />

          {/* LIVE FEED */}

          <MarketplaceLiveFeed />

          {/* CTA */}

          <section className="mt-20 overflow-hidden rounded-[40px] bg-[#2F5D50] px-8 py-16 text-white shadow-xl md:px-16">

            <div className="max-w-4xl">

              <h2 className="text-5xl font-black leading-tight">
                Join Wyoming's Growing Marketplace Community
              </h2>

              <p className="mt-8 text-xl leading-9 text-white/90">
                Create listings, connect with buyers,
                build your reputation, and participate
                in local Wyoming discussions.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <Link
                  href="/signup"
                  className="rounded-2xl bg-white px-8 py-5 text-lg font-black text-[#2F5D50]"
                >
                  Create Account
                </Link>

                <Link
                  href="/forums"
                  className="rounded-2xl border border-white/30 bg-white/10 px-8 py-5 text-lg font-black text-white backdrop-blur"
                >
                  Visit Forums
                </Link>

              </div>

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}
