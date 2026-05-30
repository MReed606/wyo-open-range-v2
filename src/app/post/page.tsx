"use client";
import { useRouter } from "next/navigation";
import {
  ImageUploader
} from "@/components/post/ImageUploader";

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

import {
  analyzePostSafety,
  getTrustLevel,
} from "@/lib/postSafety";

import {
  triggerSavedSearchNotifications
} from "@/lib/savedSearchNotifications";

export default function PostPage() {
const router =
  useRouter();

  const [title,
    setTitle] =
    useState("");
  
  const [images,
    setImages] =
    useState<string[]>([]);

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

 const categories = [

    "Vehicles",
    "Ranching",
    "Livestock",
    "Equipment",
    "Land",
    "Real Estate",
    "Farm & Garden",
    "Heavy Equipment",
    "Trailers",
    "Services",
    "Jobs",
    "Firearms",
    "Recreation",
    "Outdoor",
    "Tools",
    "Pets",
    "Electronics",
    "Community",
    "Wanted Ads",
    "Other",

  ];

const regions = [

    "Cheyenne",
    "Casper",
    "Laramie",
    "Gillette",
    "Rock Springs",
    "Sheridan",
    "Jackson",
    "Evanston",
    "Riverton",
    "Green River",
    "Rawlins",
    "Torrington",
    "Cody",
    "Buffalo",
    "Douglas",
    "Worland",
    "Thermopolis",
    "Wheatland",
    "Newcastle",
    "Statewide",

  ];

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

   // =====================================
  // AI SAFETY ENGINE
  // =====================================

  useEffect(() => {

  const timeout =
    setTimeout(() => {

      analyzeListing();

    }, 500);

  return () =>
    clearTimeout(timeout);

}, [

  title,
  description,
  price,

]);

  async function analyzeListing() {
  const result =
    await analyzePostSafety({
      title,
      description,
      price,
    });

  setRiskScore(result.riskScore);
  setRiskFlags(result.riskFlags);
  setDuplicateWarning(result.duplicateWarning);
}

  // =====================================
  // TRUST LEVEL
  // =====================================

  const trustLevel =
  useMemo(() => {
    return getTrustLevel(
      riskScore
    );
  }, [riskScore]);

  // =====================================
  // MATCH SAVED SEARCHES
  // =====================================

  

  // =====================================
  // CREATE LISTING
  // =====================================

  async function createListing() {

    setLoading(true);
if (

  !title.trim() ||
  !description.trim() ||
  !price.trim() ||
  !category ||
  !region

) {

  alert(
    "Please complete all required fields."
  );

  setLoading(false);

  return;
}
   const numericPrice =
  Number(
    price.replace(
      /[^0-9.]/g,
      ""
    )
  );

if (
  Number.isNaN(
    numericPrice
  ) ||
  numericPrice < 0
) {

  alert(
    "Please enter a valid price."
  );

  setLoading(false);

  return;
}
   if (
  images.length === 0
) {

  alert(
    "Please upload at least one image."
  );

  setLoading(false);

  return;
}
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
          
          images,
            image_url:
              images[0] ?? null,
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

    await triggerSavedSearchNotifications({
  listingId: data.id,
  listingSlug: slug,
  title,
  category,
  region,
  price,
});

    router.push(
  "/dashboard/listings"
);
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
<ImageUploader
  images={images}
  setImages={setImages}
/>

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