type ListingGalleryProps = {
  title: string;
};

export function ListingGallery({ title }: ListingGalleryProps) {
  const thumbnails = [1, 2, 3, 4];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#C2A878] via-[#2F5D50] to-[#1F2933]">
        <div className="absolute bottom-5 left-5 rounded-xl bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
          {title}
        </div>

        <div className="absolute right-5 top-5 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-[#1F2933] shadow-sm">
          1 / 4
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {thumbnails.map((thumb) => (
          <div
            key={thumb}
            className="h-24 rounded-xl bg-gradient-to-br from-[#C2A878] to-[#2F5D50] shadow-sm ring-1 ring-black/5"
          />
        ))}
      </div>
    </div>
  );
}
