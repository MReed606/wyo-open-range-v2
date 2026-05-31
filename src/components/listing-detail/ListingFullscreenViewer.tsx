import Image from "next/image";

import {
  X,
} from "lucide-react";

type ListingFullscreenViewerProps = {
  isOpen: boolean;
  imageUrl: string | null;
  title: string;
  onClose: () => void;
};

export function ListingFullscreenViewer({
  isOpen,
  imageUrl,
  title,
  onClose,
}: ListingFullscreenViewerProps) {

  if (!isOpen) {
    return null;
  }

  return (

    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">

      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur"
      >

        <X className="h-6 w-6" />

      </button>

      {!!imageUrl && (

        <div className="relative h-full w-full">

          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
          />

        </div>

      )}

    </div>

  );
}