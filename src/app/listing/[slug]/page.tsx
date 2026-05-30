"use client";

import Image from "next/image";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  Images,
} from "lucide-react";

import {
  SellerRating
} from "@/components/reviews/SellerRating";

import {
  supabase
} from "@/lib/supabase";

import {
  getRelatedListings
} from "@/lib/recommendations";

import {
  ListingReportPanel
} from "@/components/listing-detail/ListingReportPanel";

import {
  ListingReviewPanel
} from "@/components/listing-detail/ListingReviewPanel";

import {
  ListingActionsPanel
} from "@/components/listing-detail/ListingActionsPanel";

import {
  RelatedListings
} from "@/components/listing-detail/RelatedListings";

type RelatedListing = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  price: string;
  region: string;
  category: string | null;
  trending_score: number;
};

export default function ListingPage() {

  const params =
    useParams();

  const slug =
    params?.slug as string;

  const [listing,
    setListing] =
    useState<any>(null);

  const [relatedListings,
    setRelatedListings] =
    useState<RelatedListing[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  const [reportReason,
    setReportReason] =
    useState("");

  const [reportSubmitted,
    setReportSubmitted] =
    useState(false);

  const [activeImage,
    setActiveImage] =
    useState(0);

  const [fullscreen,
    setFullscreen] =
    useState(false);

  // =====================================
  // LOAD
  // =====================================

  useEffect(() => {

    if (slug) {

      loadListing();

    }

  }, [slug]);

  // =====================================
  // GALLERY
  // =====================================

  const galleryImages =
    useMemo(() => {

      if (!listing) {
        return [];
      }

      const images:
        string[] = [];

      // LEGACY IMAGE

      if (
        listing.image_url
      ) {

        images.push(
          listing.image_url
        );
      }

      // MULTI IMAGE SUPPORT

      if (
        Array.isArray(
          listing.images
        )
      ) {

        listing.images.forEach(
          (
            image: string
          ) => {

            if (
              image &&
              !images.includes(
                image
              )
            ) {

              images.push(
                image
              );
            }
          }
        );
      }

      return images;

    }, [listing]);

  // =====================================
  // VIEW TRACKING
  // =====================================

  async function incrementViewCount(
    listingId: string
  ) {

    const storageKey =
      `viewed_listing_${listingId}`;

    if (
      sessionStorage.getItem(
        storageKey
      )
    ) {

      return;
    }

    sessionStorage.setItem(
      storageKey,
      "true"
    );

    await supabase.rpc(
      "increment_listing_views",
      {
        listing_id:
          listingId,
      }
    );
  }

  // =====================================
  // LOAD RELATED
  // =====================================

  async function loadRelated(
    currentListing: any
  ) {

    const related =
      await getRelatedListings({

        listingId:
          currentListing.id,

        category:
          currentListing.category,

        region:
          currentListing.region,

        limit: 6,

      });

    setRelatedListings(
      related as RelatedListing[]
    );
  }

  // =====================================
  // LOAD LISTING
  // =====================================

  async function loadListing() {

    const {
      data,
      error
    } =
      await supabase
        .from("listings")
        .select("*")
        .eq(
          "slug",
          slug
        )
        .single();

    if (error || !data) {

      console.error(error);

      setLoading(false);

      return;
    }

    setListing(data);

    await incrementViewCount(
      data.id
    );

    await loadRelated(
      data
    );

    setLoading(false);
  }

  // =====================================
  // CONTACT SELLER
  // =====================================

  async function contactSeller() {

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    if (!user) {

      alert(
        "Login required."
      );

      return;
    }

    const {
      data: existing
    } =
      await supabase
        .from("conversations")
        .select("*")
        .eq(
          "listing_id",
          listing.id
        )
        .eq(
          "buyer_id",
          user.id
        )
        .single();

    if (existing) {

      window.location.href =
        `/messages/${existing.id}`;

      return;
    }

    const {
      data
    } =
      await supabase
        .from("conversations")
        .insert({

          listing_id:
            listing.id,

          buyer_id:
            user.id,

          seller_id:
            listing.owner_id,

        })
        .select()
        .single();

    if (data) {

      await supabase
        .from(
          "user_notifications"
        )
        .insert({

          user_id:
            listing.owner_id,

          type:
            "message",

          title:
            "New Buyer Message",

          message:
            `"${listing.title}" received a new buyer message.`,

          link:
            `/messages/${data.id}`,

        });

      window.location.href =
        `/messages/${data.id}`;
    }
  }

  // =====================================
  // REPORT
  // =====================================

  async function submitReport() {

    if (
      !reportReason.trim()
    ) {

      return;
    }

    await supabase
      .from("reports")
      .insert({

        listing_id:
          listing.id,

        reason:
          reportReason,

      });

    setReportSubmitted(
      true
    );

    setReportReason("");
  }

  // =====================================
  // GALLERY NAV
  // =====================================

  function nextImage() {

    setActiveImage((prev) =>

      prev ===
      galleryImages.length - 1

        ? 0

        : prev + 1
    );
  }

  function previousImage() {

    setActiveImage((prev) =>

      prev === 0

        ? galleryImages.length - 1

        : prev - 1
    );
  }

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <main className="min-h-screen bg-[#F7F5F2] p-10">

        Loading listing...

      </main>

    );

  }

  // =====================================
  // NOT FOUND
  // =====================================

  if (!listing) {

    return (

      <main className="min-h-screen bg-[#F7F5F2] p-10">

        Listing not found.

      </main>

    );

  }

  return (

    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">

      {/* FULLSCREEN */}

      {fullscreen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">

          <button
            onClick={() =>
              setFullscreen(false)
            }
            className="absolute right-5 top-5 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur"
          >

            <X className="h-6 w-6" />

          </button>

          {!!galleryImages.length && (

            <div className="relative h-full w-full">

              <Image
                src={
                  galleryImages[
                    activeImage
                  ]
                }
                alt={
                  listing.title
                }
                fill
                className="object-contain"
              />

            </div>

          )}

        </div>

      )}

      <div className="mx-auto max-w-7xl">

        {/* GALLERY */}

        <div className="overflow-hidden rounded-[32px] bg-white shadow-xl">

          {/* HERO */}

          <div className="relative aspect-[16/8] overflow-hidden bg-[#E5E7EB]">

            {!!galleryImages.length ? (

              <Image
                src={
                  galleryImages[
                    activeImage
                  ]
                }
                alt={
                  listing.title
                }
                fill
                priority
                className="object-cover"
              />

            ) : (

              <div className="flex h-full items-center justify-center">

                <div className="text-center">

                  <Images className="mx-auto h-20 w-20 text-gray-400" />

                  <div className="mt-5 text-xl font-black text-[#6B7280]">

                    No Images

                  </div>

                </div>

              </div>

            )}

            {/* CONTROLS */}

            {galleryImages.length > 1 && (

              <>

                <button
                  onClick={
                    previousImage
                  }
                  className="absolute left-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
                >

                  <ChevronLeft className="h-6 w-6" />

                </button>

                <button
                  onClick={
                    nextImage
                  }
                  className="absolute right-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
                >

                  <ChevronRight className="h-6 w-6" />

                </button>

              </>

            )}

            {/* FULLSCREEN */}

            {!!galleryImages.length && (

              <button
                onClick={() =>
                  setFullscreen(true)
                }
                className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full bg-black/40 px-5 py-3 text-sm font-black text-white backdrop-blur"
              >

                <Expand className="h-4 w-4" />

                Fullscreen

              </button>

            )}

            {/* COUNT */}

            {!!galleryImages.length && (

              <div className="absolute bottom-5 right-5 rounded-full bg-black/50 px-5 py-3 text-sm font-black text-white backdrop-blur">

                {activeImage + 1}
                {" / "}
                {galleryImages.length}

              </div>

            )}

          </div>

          {/* THUMBNAILS */}

          {galleryImages.length > 1 && (

            <div className="flex gap-4 overflow-x-auto p-5">

              {galleryImages.map(
                (image, index) => (

                <button
                  key={image}
                  onClick={() =>
                    setActiveImage(
                      index
                    )
                  }
                  className={`relative h-28 w-40 shrink-0 overflow-hidden rounded-2xl border-4 transition ${
                    activeImage === index
                      ? "border-[#2F5D50]"
                      : "border-transparent"
                  }`}
                >

                  <Image
                    src={image}
                    alt={`Gallery ${index}`}
                    fill
                    className="object-cover"
                  />

                </button>

              ))}

            </div>

          )}

        </div>

        {/* CONTENT */}

        <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_380px]">

          {/* LEFT */}

          <div className="space-y-10">

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <div className="flex flex-wrap items-start justify-between gap-6">

                <div>

                  <h1 className="text-5xl font-black text-[#111827]">

                    {listing.title}

                  </h1>

                  {listing.category && (

                    <div className="mt-5 inline-flex rounded-full bg-[#2F5D50]/10 px-5 py-3 text-sm font-black text-[#2F5D50]">

                      {listing.category}

                    </div>

                  )}

                  <div className="mt-6">

                    <SellerRating
                      sellerId={
                        listing.owner_id
                      }
                    />

                  </div>

                </div>

                <div className="text-right">

                  <div className="text-5xl font-black text-[#2F5D50]">

                    {listing.price ??
                      "Contact"}

                  </div>

                  <div className="mt-5 flex flex-wrap justify-end gap-3">

                    <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-black text-[#111827]">

                      👁
                      {" "}
                      {listing.views ?? 0}
                      {" "}
                      views

                    </div>

                    <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-black text-[#111827]">

                      📍
                      {" "}
                      {listing.region ??
                        "Wyoming"}

                    </div>

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-12">

                <h2 className="text-3xl font-black text-[#111827]">

                  Description

                </h2>

                <p className="mt-6 whitespace-pre-wrap text-lg leading-8 text-[#374151]">

                  {listing.description}

                </p>

              </div>

            </div>

            {/* RELATED */}

            <RelatedListings
  listings={relatedListings}
/>

          </div>

          {/* SIDEBAR */}

          <div className="space-y-8">

            {/* ACTIONS */}

<ListingActionsPanel
  listingId={listing.id}
  ownerId={listing.owner_id}
  onContactSeller={contactSeller}
/>

                
            {/* REVIEW */}

<ListingReviewPanel
  sellerId={listing.owner_id}
  listingId={listing.id}
/>

            {/* REPORT */}

            <ListingReportPanel
  reportReason={reportReason}
  reportSubmitted={reportSubmitted}
  onReportReasonChange={setReportReason}
  onSubmitReport={submitReport}
/>

          </div>

        </div>

      </div>

    </main>

  );
}