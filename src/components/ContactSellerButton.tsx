"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  listingId: string;
  sellerId: string;
};

export function ContactSellerButton({
  listingId,
  sellerId,
}: Props) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  async function sendMessage() {
    setStatus("Sending message...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    let conversationId = "";

    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", user.id)
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (existingConversation) {
      conversationId = existingConversation.id;
    } else {
      const { data: newConversation, error } = await supabase
        .from("conversations")
        .insert({
          listing_id: listingId,
          buyer_id: user.id,
          seller_id: sellerId,
        })
        .select()
        .single();

      if (error || !newConversation) {
        setStatus(error?.message ?? "Failed to create conversation.");
        return;
      }

      conversationId = newConversation.id;
    }

    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message,
      });

    if (messageError) {
      setStatus(messageError.message);
      return;
    }

    setStatus("Message sent!");
    setMessage("");

    setTimeout(() => {
      window.location.href = "/messages";
    }, 1000);
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-xl bg-[#2F5D50] px-5 py-3 font-bold text-white"
        >
          Contact Seller
        </button>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-[#F8FAFC] p-4">
          <textarea
            placeholder="Send seller a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-32 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#111827] placeholder:text-gray-500"
          />

          <button
            onClick={sendMessage}
            className="mt-4 w-full rounded-xl bg-[#2F5D50] px-5 py-3 font-bold text-white"
          >
            Send Message
          </button>

          {status && (
            <div className="mt-3 rounded-xl bg-white p-3 font-semibold">
              {status}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
