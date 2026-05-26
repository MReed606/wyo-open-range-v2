"use client";

import {
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  Upload,
  X,
  Loader2,
} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";

type Props = {

  images:
    string[];

  setImages:
    React.Dispatch<
      React.SetStateAction<
        string[]
      >
    >;

};

export function ImageUploader({
  images,
  setImages,
}: Props) {

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [uploading,
    setUploading] =
    useState(false);

  // =====================================
  // OPEN PICKER
  // =====================================

  function openPicker() {

    inputRef.current?.click();

  }

  // =====================================
  // HANDLE FILES
  // =====================================

  async function handleFiles(
    files: FileList | null
  ) {

    if (!files?.length) {
  return;
}

if (
  files.length > 12
) {

  alert(
    "Maximum 12 images allowed."
  );

  return;
}

setUploading(true);
   
    const uploaded:
      string[] = [];

    for (
      const file of Array.from(files)
    ) {
if (
  file.size >
  5 * 1024 * 1024
) {

  alert(
    `${file.name} exceeds 5MB limit.`
  );

  continue;
}
if (
  !file.type.startsWith(
    "image/"
  )
) {

  alert(
    `${file.name} is not a valid image.`
  );

  continue;
}
      // SAFE FILE NAME

      const fileExt =
        file.name
          .split(".")
          .pop();

      const fileName =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

      // UPLOAD

      const {
        error
      } =
        await supabase.storage
          .from(
            "listing-images"
          )
          .upload(
            fileName,
            file
          );

      if (error) {

        console.error(
          error
        );

        continue;
      }

      // PUBLIC URL

      const {
        data
      } =
        supabase.storage
          .from(
            "listing-images"
          )
          .getPublicUrl(
            fileName
          );

      uploaded.push(
        data.publicUrl
      );
    }

    setImages((prev) =>

  Array.from(
    new Set([

      ...prev,

      ...uploaded,

    ])
  )
);

    setUploading(false);
  }

  // =====================================
  // REMOVE IMAGE
  // =====================================

  function removeImage(
    url: string
  ) {

    setImages((prev) =>

      prev.filter(
        (x) => x !== url
      )
    );
  }

  return (

    <div className="space-y-6">

      {/* UPLOAD BOX */}

      <div
        onClick={openPicker}
        className="cursor-pointer rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center transition hover:border-[#2F5D50]"
      >

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) =>
            handleFiles(
              e.target.files
            )
          }
        />

        <div className="flex flex-col items-center">

          {uploading ? (

            <Loader2 className="h-12 w-12 animate-spin text-[#2F5D50]" />

          ) : (

            <Upload className="h-12 w-12 text-[#2F5D50]" />

          )}

          <h2 className="mt-5 text-2xl font-black text-[#111827]">

            Upload Images

          </h2>

          <p className="mt-3 text-[#6B7280]">

            Click to upload listing photos

          </p>

        </div>

      </div>

      {/* PREVIEW GRID */}

      {!!images.length && (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {images.map((url) => (

            <div
              key={url}
              className="relative overflow-hidden rounded-3xl bg-white shadow-sm"
            >

              <div className="relative aspect-[4/3]">

                <Image
                  src={url}
                  alt="Listing image"
                  fill
                  className="object-cover"
                />

              </div>

              <button
                onClick={() =>
                  removeImage(url)
                }
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}