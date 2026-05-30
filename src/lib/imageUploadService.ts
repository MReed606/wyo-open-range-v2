import {
  supabase
} from "@/lib/supabase";

export async function compressImage(
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

              resolve(
                new File(
                  [blob],
                  file.name,
                  {
                    type:
                      "image/jpeg",
                  }
                )
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

export async function uploadImages(
  files: FileList,
  existingCount: number
) {

  const MAX_IMAGES = 10;

  if (
    existingCount +
    files.length >
    MAX_IMAGES
  ) {

    throw new Error(
      `Maximum ${MAX_IMAGES} images allowed.`
    );
  }

  const uploaded: string[] = [];
  const warnings: string[] = [];
  let compressionStats = "";

  for (
    const file of Array.from(files)
  ) {

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

    const originalSizeMB =
      (
        file.size /
        1024 /
        1024
      ).toFixed(2);

    const lowerName =
      file.name.toLowerCase();

    [
      "weapon",
      "blood",
      "violence",
      "drugs",
      "explicit",
    ].forEach(
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

    const compressed =
      await compressImage(file);

    const compressedSizeMB =
      (
        compressed.size /
        1024 /
        1024
      ).toFixed(2);

    compressionStats =
      `${originalSizeMB}MB → ${compressedSizeMB}MB`;

    const safeName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${file.name
          .split(".")
          .pop()}`;

    const { error } =
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

      warnings.push(
        `${file.name}: Upload failed`
      );

      continue;
    }

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

  return {
    uploaded,
    warnings,
    compressionStats,
  };
}
