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


  const { data: moderationActions } = await supabase
    .from("moderation_actions")
    .select("*")
    .eq("target_user_id", id)
    .order("created_at", {
      ascending: false,
    });


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

        <div className="mt-4 flex flex-wrap gap-3">

          {seller?.verified && (

            <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              Verified Seller
            </div>

          )}

          {seller?.role === "admin" && (

            <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
              Admin
            </div>

          )}

          {seller?.role === "moderator" && (

            <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
              Moderator
            </div>

          )}

        </div>


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

    
      <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-black text-[#111827]">
          Moderation History
        </h2>

        <div className="mt-6 space-y-4">

          {moderationActions?.length ? (

            moderationActions.map((action) => (

              <div
                key={action.id}
                className="rounded-2xl border border-gray-200 p-5"
              >

                <div className="flex flex-wrap items-center gap-3">

                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                    {action.action_type}
                  </span>

                  <span className="text-sm text-gray-500">
                    {new Date(
                      action.created_at
                    ).toLocaleString()}
                  </span>

                </div>

                <p className="mt-4 text-[#374151]">
                  {action.public_reason ??
                    "No public reason"}
                </p>

              </div>

            ))

          ) : (

            <p className="text-[#374151]">
              No moderation history.
            </p>

          )}

        </div>

      </div>


    </main>
  );
}
