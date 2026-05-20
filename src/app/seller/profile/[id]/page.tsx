import { FollowButton } from "@/components/social/FollowButton";
import { LeaveReviewForm } from "@/components/reviews/LeaveReviewForm";
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
    .maybeSingle();

  const { data: reviews } = await supabase
    .from("user_reviews")
    .select("*")
    .eq("reviewed_user_id", id)
    .order("created_at", {
      ascending: false,
    });

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", id)
    .eq("status", "active")
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">

      {/* SELLER HEADER */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <div className="mb-6 flex items-center gap-5">

          {seller?.avatar_url ? (

            <img
              src={seller.avatar_url}
              alt={seller.full_name ?? ""}
              className="h-24 w-24 rounded-full object-cover"
            />

          ) : (

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2F5D50]/10 text-3xl font-black text-[#2F5D50]">

              {(seller?.first_name?.[0] ?? "U")
                .toUpperCase()}

            </div>

          )}

          <div>

            <h1 className="text-4xl font-black text-[#111827]">

              {seller?.full_name ??
                "Seller"}

            </h1>

            <div className="mt-4 space-y-2 text-[#374151]">

              {seller?.email && (
                <p>
                  {seller.email}
                </p>
              )}

              {seller?.phone && (
                <p>
                  {seller.phone}
                </p>
              )}

            </div>

            <div className="mt-5 flex flex-wrap gap-3">

              
              {seller?.premium_seller && (

                <div className="rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
                  Premium Seller
                </div>

              )}


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

          </div>

        
            <div className="mt-6">
              <FollowButton sellerId={id} />
            </div>

          </div>

        <p className="mt-5 text-lg text-[#374151]">

          Seller Rating:
          {" "}
          {seller?.review_score ?? 0}
          ⭐

          {" • "}

          Reviews:
          {" "}
          {seller?.review_count ?? 0}

          <br />

          Member Since: {" "}
          {seller?.created_at
            ? new Date(seller.created_at).getFullYear()
            : "Unknown"}

          <br />

          
          Response Rate:
          {" "}
          {seller?.response_rate ?? 100}%

          <br />

          Response Speed:
          {" "}
          {seller?.response_time ?? "Fast"}

          <br />

          Active Listings:

          {" "}
          {listings?.length ?? 0}

        </p>

      </div>


        {/* BIO */}

        {seller?.bio && (

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="text-3xl font-black text-[#111827]">
              Seller Bio
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#374151]">
              {seller.bio}
            </p>

          </div>

        )}


      {/* LISTINGS */}
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

      {/* REVIEW FORM */}
      <div className="mt-10">
        <LeaveReviewForm sellerId={id} />
      </div>

      {/* REVIEWS */}
      <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-black text-[#111827]">
          Customer Reviews
        </h2>

        <div className="mt-6 space-y-5">

          {reviews?.length ? (

            reviews.map((review) => (

              <div
                key={review.id}
                className="rounded-2xl border border-gray-200 p-5"
              >

                <div className="flex flex-wrap items-center gap-3">

                  <div className="rounded-full bg-[#2F5D50]/10 px-4 py-2 text-sm font-bold text-[#2F5D50]">
                    {review.rating} ⭐
                  </div>

                  <div className="text-sm text-gray-500">

                    {new Date(
                      review.created_at
                    ).toLocaleDateString()}

                  </div>

                </div>

                <p className="mt-4 text-lg text-[#374151]">
                  {review.review}
                </p>

              </div>

            ))

          ) : (

            <p className="text-[#374151]">
              No reviews yet.
            </p>

          )}

        </div>

      </div>

    </main>
  );
}
