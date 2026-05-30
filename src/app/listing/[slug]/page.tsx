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
 
  X,
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

import {
  ListingGallery
} from "@/components/listing-detail/ListingGallery";

import {
  ListingHeader
} from "@/components/listing-detail/ListingHeader";

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

<ListingGallery
  title={listing.title}
  galleryImages={galleryImages}
  activeImage={activeImage}
  onNextImage={nextImage}
  onPreviousImage={previousImage}
  onSetActiveImage={setActiveImage}
  onOpenFullscreen={() => setFullscreen(true)}
/>

{/* CONTENT */} 

        

        <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_380px]">

          {/* LEFT */}

          <div className="space-y-10">

           <ListingHeader
  title={listing.title}
  category={listing.category}
  sellerId={listing.owner_id}
  price={listing.price}
  views={listing.views}
  region={listing.region}
  description={listing.description}
/> 

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