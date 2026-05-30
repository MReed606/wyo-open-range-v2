import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
} from "lucide-react";

type ListingGalleryProps = {
  title: string;
  galleryImages: string[];
  activeImage: number;
  onNextImage: () => void;
  onPreviousImage: () => void;
  onSetActiveImage: (index: number) => void;
  onOpenFullscreen: () => void;
};

export function ListingGallery({
  title,
  galleryImages,
  activeImage,
  onNextImage,
  onPreviousImage,
  onSetActiveImage,
  onOpenFullscreen,
}: ListingGalleryProps) {
  return (
    <div className="overflow-hidden rounded-[32px] bg-white shadow-xl">
      <div className="relative aspect-[16/8] overflow-hidden bg-[#E5E7EB]">
        {!!galleryImages.length ? (
          <Image
            src={galleryImages[activeImage]}
            alt={title}
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

        {galleryImages.length > 1 && (
          <>
            <button
              onClick={onPreviousImage}
              className="absolute left-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={onNextImage}
              className="absolute right-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {!!galleryImages.length && (
          <button
            onClick={onOpenFullscreen}
            className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full bg-black/40 px-5 py-3 text-sm font-black text-white backdrop-blur"
          >
            <Expand className="h-4 w-4" />
            Fullscreen
          </button>
        )}

        {!!galleryImages.length && (
          <div className="absolute bottom-5 right-5 rounded-full bg-black/50 px-5 py-3 text-sm font-black text-white backdrop-blur">
            {activeImage + 1}
            {" / "}
            {galleryImages.length}
          </div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto p-5">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              onClick={() => onSetActiveImage(index)}
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
  );
}
