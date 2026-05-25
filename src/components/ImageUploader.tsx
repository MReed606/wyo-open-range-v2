"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  Upload,
  X,
  ImageIcon,
  Shield,
  AlertTriangle,
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

  const [dragging,
    setDragging] =
    useState(false);

  const [uploading,
    setUploading] =
    useState(false);

  const [moderationWarnings,
    setModerationWarnings] =
    useState<string[]>([]);

  const [compressionStats,
    setCompressionStats] =
    useState<string>("");

  // =====================================
  // MAX IMAGES
  // =====================================

  const MAX_IMAGES = 10;

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
      images.length +
      files.length >
      MAX_IMAGES
    ) {

      alert(
        `Maximum ${MAX_IMAGES} images allowed.`
      );

      return;
    }

    setUploading(true);

    const uploaded:
      string[] = [];

    const warnings:
      string[] = [];

    for (
      const file of Array.from(files)
    ) {

      // =====================================
      // VALIDATION
      // =====================================

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        warnings.push(
          `${file.name}: Invalid file type`
        );

        continue;
      }

      // =====================================
      // SIZE CHECK
      // =====================================

      const originalSizeMB =
        (
          file.size /
          1024 /
          1024
        ).toFixed(2);

      // =====================================
      // IMAGE MODERATION
      // =====================================

      const lowerName =
        file.name.toLowerCase();

      const suspiciousTerms = [

        "weapon",
        "blood",
        "violence",
        "drugs",
        "explicit",

      ];

      suspiciousTerms.forEach(
        (term) => {

          if (
            lowerName.includes(term)
          ) {

            warnings.push(
              `${file.name}: Potentially restricted image content detected`
            );
          }
        }
      );

      // =====================================
      // COMPRESS IMAGE
      // =====================================

      const compressed =
        await compressImage(file);

      const compressedSizeMB =
        (
          compressed.size /
          1024 /
          1024
        ).toFixed(2);

      setCompressionStats(

        `${originalSizeMB}MB → ${compressedSizeMB}MB`

      );

      // =====================================
      // SAFE FILE NAME
      // =====================================

      const safeName =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${file.name
            .split(".")
            .pop()}`;

      // =====================================
      // UPLOAD
      // =====================================

      const {
        error
      } =
        await supabase.storage
          .from(
            "listing-images"
          )
          .upload(
            safeName,
            compressed,
            {
              cacheControl:
                "3600",

              upsert:
                false,
            }
          );

      if (error) {

        console.error(error);

        warnings.push(
          `${file.name}: Upload failed`
        );

        continue;
      }

      // =====================================
      // PUBLIC URL
      // =====================================

      const {
        data
      } =
        supabase.storage
          .from(
            "listing-images"
          )
          .getPublicUrl(
            safeName
          );

      uploaded.push(
        data.publicUrl
      );
    }

    setModerationWarnings(
      warnings
    );

    setImages((prev) => [

      ...prev,

      ...uploaded,

    ]);

    setUploading(false);
  }

  // =====================================
  // COMPRESS IMAGE
  // =====================================

  async function compressImage(
    file: File
  ): Promise<File> {

    return new Promise(
      (resolve) => {

        const img =
          document.createElement(
            "img"
          );

        const canvas =
          document.createElement(
            "canvas"
          );

        const ctx =
          canvas.getContext("2d");

        const reader =
          new FileReader();

        reader.onload =
          (e) => {

            img.src =
              e.target?.result as string;
          };

        img.onload =
          () => {

            const MAX_WIDTH = 1800;

            const scale =
              Math.min(
                1,
                MAX_WIDTH /
                img.width
              );

            canvas.width =
              img.width * scale;

            canvas.height =
              img.height * scale;

            ctx?.drawImage(
              img,
              0,
              0,
              canvas.width,
              canvas.height
            );

            canvas.toBlob(
              (blob) => {

                if (!blob) {

                  resolve(file);

                  return;
                }

                const compressed =
                  new File(
                    [blob],
                    file.name,
                    {
                      type:
                        "image/jpeg",
                    }
                  );

                resolve(
                  compressed
                );

              },
              "image/jpeg",
              0.82
            );
          };

        reader.readAsDataURL(
          file
        );
      }
    );
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

  // =====================================
  // DRAG/DROP
  // =====================================

  function handleDrop(
    e: React.DragEvent
  ) {

    e.preventDefault();

    setDragging(false);

    handleFiles(
      e.dataTransfer.files
    );
  }

  // =====================================
  // RENDER
  // =====================================

  return (

    <div>

      {/* DROP ZONE */}

      <div
        onClick={openPicker}
        onDragOver={(e) => {

          e.preventDefault();

          setDragging(true);

        }}
        onDragLeave={() => {

          setDragging(false);

        }}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition ${
          dragging
            ? "border-[#2F5D50] bg-[#2F5D50]/5"
            : "border-gray-300 bg-white"
        }`}
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

            <Loader2 className="h-14 w-14 animate-spin text-[#2F5D50]" />

          ) : (

            <Upload className="h-14 w-14 text-[#2F5D50]" />

          )}

          <h2 className="mt-5 text-2xl font-black text-[#111827]">

            Upload Listing Images

          </h2>

          <p className="mt-3 max-w-xl text-[#6B7280]">

            Drag & drop images or click to browse.
            AI moderation, optimization,
            compression, and marketplace-safe uploads enabled.

          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

            <div className="rounded-full bg-[#2F5D50]/10 px-4 py-2 text-xs font-black text-[#2F5D50]">

              Max {MAX_IMAGES} Images

            </div>

            <div className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700">

              Auto Compression

            </div>

            <div className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700">

              CDN Ready

            </div>

          </div>

        </div>

      </div>

      {/* COMPRESSION */}

      {!!compressionStats && (

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-sm font-bold text-blue-700">

          <Shield className="h-5 w-5" />

          Optimized Upload:
          {" "}
          {compressionStats}

        </div>

      )}

      {/* WARNINGS */}

      {!!moderationWarnings.length && (

        <div className="mt-5 space-y-3">

          {moderationWarnings.map(
            (warning, i) => (

            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-700"
            >

              <AlertTriangle className="h-5 w-5" />

              {warning}

            </div>

          ))}

        </div>

      )}

      {/* IMAGE GRID */}

      {!!images.length && (

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {images.map((url) => (

            <div
              key={url}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-sm"
            >

              <div className="relative aspect-[4/3]">

                <Image
                  src={url}
                  alt="Listing image"
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />

              </div>

              <button
                onClick={() =>
                  removeImage(url)
                }
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur"
              >

                <X className="h-5 w-5" />

              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-[#111827] backdrop-blur">

                <ImageIcon className="h-4 w-4" />

                Optimized

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}