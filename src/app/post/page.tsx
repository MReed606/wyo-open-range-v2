"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Shield,
  AlertTriangle,
  Sparkles,
  Brain,
} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";

export default function PostPage() {

  const [title,
    setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [price,
    setPrice] =
    useState("");

  const [category,
    setCategory] =
    useState("");

  const [region,
    setRegion] =
    useState("");

  const [categories,
    setCategories] =
    useState<string[]>([]);

  const [regions,
    setRegions] =
    useState<string[]>([]);

  const [loading,
    setLoading] =
    useState(false);

  const [riskScore,
    setRiskScore] =
    useState(0);

  const [riskFlags,
    setRiskFlags] =
    useState<string[]>([]);

  const [duplicateWarning,
    setDuplicateWarning] =
    useState(false);

  // =====================================
  // LOAD FILTERS
  // =====================================

  useEffect(() => {

    loadFilters();

  }, []);

  async function loadFilters() {

    const {
      data: listings
    } =
      await supabase
        .from("listings")
        .select(
          "category, region"
        );

    if (!listings) {
      return;
    }

    const uniqueCategories =
      Array.from(
        new Set(
          listings
            .map(
              (x) => x.category
            )
            .filter(Boolean)
        )
      );

    const uniqueRegions =
      Array.from(
        new Set(
          listings
            .map(
              (x) => x.region
            )
            .filter(Boolean)
        )
      );

    setCategories(
      uniqueCategories as string[]
    );

    setRegions(
      uniqueRegions as string[]
    );
  }

  // =====================================
  // AI SAFETY ENGINE
  // =====================================

  useEffect(() => {

    analyzeListing();

  }, [

    title,
    description,
    price,

  ]);

  async function analyzeListing() {

    const flags:
      string[] = [];

    let score = 0;

    const combined =
      `
        ${title}
        ${description}
      `
      .toLowerCase();

    // =====================================
    // SPAM WORDS
    // =====================================

    const suspiciousWords = [

      "wire transfer",
      "western union",
      "gift cards",
      "crypto only",
      "text me only",
      "whatsapp",
      "telegram",
      "urgent sale",
      "guaranteed profit",

    ];

    suspiciousWords.forEach(
      (word) => {

        if (
          combined.includes(word)
        ) {

          score += 25;

          flags.push(
            `Suspicious phrase detected: "${word}"`
          );
        }
      }
    );

    // =====================================
    // VERY LOW PRICE
    // =====================================

    const numericPrice =
      Number(
        price.replace(
          /[^0-9.]/g,
          ""
        )
      );

    if (
      numericPrice > 0 &&
      numericPrice < 10
    ) {

      score += 15;

      flags.push(
        "Unusually low price detected"
      );
    }

    // =====================================
    // EXCESSIVE CAPS
    // =====================================

    const upperCount =
      (
        title.match(
          /[A-Z]/g
        ) || []
      ).length;

    if (
      upperCount > 15
    ) {

      score += 10;

      flags.push(
        "Excessive capital letters"
      );
    }

    // =====================================
    // DUPLICATE DETECTION
    // =====================================

    if (
      title.trim().length > 5
    ) {

      const {
        data: similarListings
      } =
        await supabase
          .from("listings")
          .select(
            "id, title"
          )
          .ilike(
            "title",
            `%${title.trim()}%`
          )
          .limit(3);

      if (
        similarListings &&
        similarListings.length > 0
      ) {

        score += 20;

        setDuplicateWarning(
          true
        );

      } else {

        setDuplicateWarning(
          false
        );
      }
    }

    setRiskScore(score);

    setRiskFlags(flags);
  }

  // =====================================
  // TRUST LEVEL
  // =====================================

  const trustLevel =
    useMemo(() => {

      if (riskScore >= 50) {

        return {
          label:
            "High Risk",
          color:
            "bg-red-100 text-red-700",
        };
      }

      if (riskScore >= 25) {

        return {
          label:
            "Moderate Risk",
          color:
            "bg-yellow-100 text-yellow-700",
        };
      }

      return {
        label:
          "Trusted Listing",
        color:
          "bg-green-100 text-green-700",
      };

    }, [riskScore]);

  // =====================================
  // MATCH SAVED SEARCHES
  // =====================================

  async function triggerSavedSearchNotifications(
    listingId: string,
    listingSlug: string
  ) {

    const {
      data: savedSearches
    } =
      await supabase
        .from("saved_searches")
        .select("*");

    if (!savedSearches?.length) {
      return;
    }

    const matchingSearches =
      savedSearches.filter(
        (searchItem) => {

          if (
            searchItem.search &&
            !title
              .toLowerCase()
              .includes(
                searchItem.search.toLowerCase()
              )
          ) {

            return false;
          }

          if (
            searchItem.category &&
            searchItem.category !== category
          ) {

            return false;
          }

          if (
            searchItem.region &&
            searchItem.region !== region
          ) {

            return false;
          }

          if (
            searchItem.min_price &&
            Number(price)
            <
            Number(
              searchItem.min_price
            )
          ) {

            return false;
          }

          if (
            searchItem.max_price &&
            Number(price)
            >
            Number(
              searchItem.max_price
            )
          ) {

            return false;
          }

          return true;
        }
      );

    if (
      !matchingSearches.length
    ) {

      return;
    }

    const notifications =
      matchingSearches.map(
        (searchItem) => ({

          user_id:
            searchItem.user_id,

          type:
            "saved_search_match",

          title:
            "New Matching Listing",

          message:
            `"${title}" matches one of your saved searches.`,

          link:
            `/listing/${listingSlug}`,

        })
      );

    await supabase
      .from(
        "user_notifications"
      )
      .insert(
        notifications
      );
  }

  // =====================================
  // CREATE LISTING
  // =====================================

  async function createListing() {

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      alert(
        "Login required."
      );

      setLoading(false);

      return;
    }

    // =====================================
    // BLOCK HIGH RISK
    // =====================================

    if (
      riskScore >= 75
    ) {

      alert(
        "Listing blocked by marketplace safety system."
      );

      setLoading(false);

      return;
    }

    const slug =
      title
        .toLowerCase()
        .replaceAll(
          " ",
          "-"
        )
        .replace(
          /[^a-z0-9-]/g,
          ""
        )
      +
      "-"
      +
      Date.now();

    const {
      data,
      error
    } =
      await supabase
        .from("listings")
        .insert({

          title,

          description,

          price,

          category,

          region,

          slug,

          owner_id:
            user.id,

          moderation_score:
            riskScore,

          moderation_flags:
            riskFlags,

          flagged:
            riskScore >= 50,

        })
        .select()
        .single();

    setLoading(false);

    if (error) {

      console.log(error);

      alert(
        "Failed to create listing."
      );

      return;
    }

    // =====================================
    // ADMIN ALERT
    // =====================================

    if (
      riskScore >= 50
    ) {

      await supabase
        .from(
          "admin_alerts"
        )
        .insert({

          type:
            "listing_flagged",

          title:
            "High Risk Listing",

          message:
            `"${title}" triggered marketplace safety systems.`,

        });
    }

    // =====================================
    // SAVED SEARCH MATCHES
    // =====================================

    await triggerSavedSearchNotifications(

      data.id,

      slug

    );

    window.location.href =
      "/dashboard/listings";
  }

  return (

    <main className="min-h-screen bg-[#F7F5F2] px-6 py-12">

      <div className="mx-auto max-w-4xl">

        {/* HERO */}

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

        {/* SAFETY PANEL */}

        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-5">

            <div>

              <div className="mb-4 flex items-center gap-3">

                <Shield className="h-7 w-7 text-[#2F5D50]" />

                <h2 className="text-3xl font-black text-[#111827]">

                  Marketplace Trust Analysis

                </h2>

              </div>

              <div className="text-[#6B7280]">

                AI-powered listing safety evaluation.

              </div>

            </div>

            <div className={`rounded-full px-5 py-3 text-sm font-black ${trustLevel.color}`}>

              {trustLevel.label}

            </div>

          </div>

          {/* SCORE */}

          <div className="mt-8">

            <div className="mb-3 flex items-center justify-between">

              <div className="font-black text-[#111827]">

                Risk Score

              </div>

              <div className="font-black text-[#111827]">

                {riskScore}/100

              </div>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-200">

              <div
                className={`h-full transition-all ${
                  riskScore >= 50
                    ? "bg-red-500"
                    : riskScore >= 25
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width:
                    `${riskScore}%`
                }}
              />

            </div>

          </div>

          {/* FLAGS */}

          {!!riskFlags.length && (

            <div className="mt-8 space-y-3">

              {riskFlags.map(
                (flag, i) => (

                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-700"
                >

                  <AlertTriangle className="h-5 w-5" />

                  {flag}

                </div>

              ))}

            </div>

          )}

          {/* DUPLICATE */}

          {duplicateWarning && (

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-5 text-sm font-bold text-red-700">

              <AlertTriangle className="h-5 w-5" />

              Similar listings already exist.
              Duplicate or spam listings may reduce visibility.

            </div>

          )}

        </div>

        {/* FORM */}

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-3">

            <Sparkles className="h-7 w-7 text-[#2F5D50]" />

            <h2 className="text-3xl font-black text-[#111827]">

              Listing Details

            </h2>

          </div>

          <div className="space-y-6">

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Listing Title"
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Description"
              className="min-h-40 w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
            />

            <input
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              placeholder="Price"
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
            >

              <option value="">
                Select Category
              </option>

              {categories.map(
                (cat) => (

                <option
                  key={cat}
                  value={cat}
                >

                  {cat}

                </option>

              ))}

            </select>

            <select
              value={region}
              onChange={(e) =>
                setRegion(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg"
            >

              <option value="">
                Select Region
              </option>

              {regions.map(
                (reg) => (

                <option
                  key={reg}
                  value={reg}
                >

                  {reg}

                </option>

              ))}

            </select>

            <button
              onClick={createListing}
              disabled={loading}
              className="w-full rounded-2xl bg-[#2F5D50] px-6 py-5 text-lg font-black text-white transition hover:bg-[#24473d] disabled:opacity-50"
            >

              {loading
                ? "Creating..."
                : "Create Listing"}

            </button>

          </div>

        </div>

      </div>

    </main>

  );
}