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

import {
  PostListingForm
} from "@/components/post/PostListingForm";

import {
  PostSafetyPanel
} from "@/components/post/PostSafetyPanel";

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

        <PostSafetyPanel
  riskScore={riskScore}
  riskFlags={riskFlags}
  duplicateWarning={duplicateWarning}
  trustLevel={trustLevel}
/>      

       {/* FORM */}

<PostListingForm
  title={title}
  description={description}
  price={price}
  category={category}
  region={region}
  images={images}
  categories={categories}
  regions={regions}
  loading={loading}
  setTitle={setTitle}
  setDescription={setDescription}
  setPrice={setPrice}
  setCategory={setCategory}
  setRegion={setRegion}
  setImages={setImages}
  onCreateListing={createListing}
/>

      </div>

    </main>

  );
}