import { PageHeader } from "@/components/PageHeader";

const conversations = [
  {
    name: "Cody R.",
    subject: "2019 Ford F-350 Lariat",
    preview: "Is this still available this weekend?",
    status: "Unread",
  },
  {
    name: "Frontier Welding & Repair",
    subject: "Ranch Welding Services",
    preview: "We can get you scheduled next week.",
    status: "Business",
  },
  {
    name: "Wyoming Member",
    subject: "20ft Stock Trailer",
    preview: "Would you consider a trade plus cash?",
    status: "Offer",
  },
];

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <PageHeader
        eyebrow="Marketplace Messaging"
        title="Messages"
        description="A prototype inbox for buyer/seller conversations, business inquiries, offers, and transaction updates."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[340px_1fr_300px]">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <h2 className="px-2 py-3 text-xl font-bold text-[#1F2933]">
            Conversations
          </h2>

          <div className="mt-2 space-y-3">
            {conversations.map((conversation) => (
              <div key={conversation.subject} className="rounded-xl bg-[#F7F5F2] p-4">
                <p className="font-bold text-[#1F2933]">
                  {conversation.name}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#2F5D50]">
                  {conversation.subject}
                </p>

                <p className="mt-2 text-sm text-[#52606D]">
                  {conversation.preview}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
            Active Conversation
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#1F2933]">
            2019 Ford F-350 Lariat
          </h2>

          <div className="mt-8 space-y-5">
            <div className="max-w-lg rounded-2xl bg-[#F7F5F2] p-5">
              <p className="font-bold text-[#1F2933]">Buyer</p>
              <p className="mt-2 text-[#52606D]">
                Is this still available this weekend?
              </p>
            </div>

            <div className="ml-auto max-w-lg rounded-2xl bg-[#2F5D50] p-5 text-white">
              <p className="font-bold">Seller</p>
              <p className="mt-2 text-white/85">
                Yes, still available. I can meet in Cheyenne.
              </p>
            </div>

            <div className="rounded-2xl border border-[#2F5D50] bg-white p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
                Offer Card
              </p>

              <p className="mt-2 text-2xl font-bold text-[#1F2933]">
                $40,000
              </p>

              <p className="mt-2 text-[#52606D]">
                Buyer can pick up this weekend.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-xl bg-[#2F5D50] px-4 py-2 text-sm font-semibold text-white">
                  Accept
                </button>

                <button className="rounded-xl border border-[#2F5D50] px-4 py-2 text-sm font-semibold text-[#2F5D50]">
                  Counter
                </button>

                <button className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-[#52606D]">
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-[#1F2933]">
            Listing Context
          </h2>

          <div className="mt-5 h-36 rounded-xl bg-gradient-to-br from-[#C2A878] to-[#2F5D50]" />

          <p className="mt-5 text-2xl font-bold text-[#1F2933]">
            $42,500
          </p>

          <p className="mt-2 font-semibold text-[#1F2933]">
            2019 Ford F-350 Lariat
          </p>

          <p className="mt-2 text-sm text-[#52606D]">
            Cheyenne • Verified Seller
          </p>
        </aside>
      </section>
    </main>
  );
}
