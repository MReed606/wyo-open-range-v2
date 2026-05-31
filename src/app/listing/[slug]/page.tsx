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

import {
  contactListingSeller,
  submitListingReport,
  incrementListingView,
  loadRelatedListings,
} from "@/lib/listingDetailService";

import {
  ListingFullscreenViewer
} from "@/components/listing-detail/ListingFullscreenViewer";

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

  await incrementListingView(
    listingId
  );
}

  // =====================================
  // LOAD RELATED
  // =====================================

  async function loadRelated(
  currentListing: any
) {

  const related =
    await loadRelatedListings(
      currentListing
    );

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

  await contactListingSeller(
    listing
  );
}

  // =====================================
  // REPORT
  // =====================================

  async function submitReport() {

  const success =
    await submitListingReport(
      listing.id,
      reportReason
    );

  if (!success) {
    return;
  }

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

      <ListingFullscreenViewer
  isOpen={fullscreen}
  imageUrl={
    galleryImages[
      activeImage
    ] ?? null
  }
  title={listing.title}
  onClose={() =>
    setFullscreen(false)
  }
/>

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