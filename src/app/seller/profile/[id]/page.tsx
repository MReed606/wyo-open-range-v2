import { supabase } from "@/lib/supabase";

export default async function SellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const { data: seller } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", id)
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h1 className="text-4xl font-black text-[#111827]">
          {seller?.username ?? "Seller"}
        </h1>

        <p className="mt-3 text-lg text-[#374151]">
          Active Listings: {listings?.length ?? 0}
        </p>

      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {listings?.map((listing) => (

          <div
            key={listing.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >

            {listing.image_url && (

              <img
                src={listing.image_url}
                alt={listing.title}
                className="h-48 w-full object-cover"
              />

            )}

            <div className="p-5">

              <h2 className="text-xl font-bold text-[#111827]">
                {listing.title}
              </h2>

              <p className="mt-2 text-[#374151]">
                ${listing.price ?? "Contact"}
              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
