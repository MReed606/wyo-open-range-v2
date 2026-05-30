import { supabase } from "@/lib/supabase";

export async function loadMessageDashboardConversations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("conversations")
    .select("*")
    .or(
      `buyer_id.eq.${user.id},seller_id.eq.${user.id}`
    )
    .order("created_at", {
      ascending: false,
    });

  if (!data?.length) {
    return [];
  }

  const filtered = data.filter(
    (conversation) => {
      if (
        conversation.buyer_id === user.id &&
        conversation.hidden_by_buyer
      ) {
        return false;
      }

      if (
        conversation.seller_id === user.id &&
        conversation.hidden_by_seller
      ) {
        return false;
      }

      return true;
    }
  );

  const enhanced = await Promise.all(
    filtered.map(async (conversation) => {
      const otherUserId =
        conversation.buyer_id === user.id
          ? conversation.seller_id
          : conversation.buyer_id;

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", otherUserId)
          .maybeSingle();

      const {
        data: latestMessages,
      } = await supabase
        .from("messages")
        .select("*")
        .eq(
          "conversation_id",
          conversation.id
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(1);

      const latest =
        latestMessages?.[0];

      const {
        data: unreadMessages,
      } = await supabase
        .from("messages")
        .select("*")
        .eq(
          "conversation_id",
          conversation.id
        )
        .eq("read", false)
        .neq(
          "sender_id",
          user.id
        );

      const unreadCount =
        unreadMessages?.length ?? 0;

      let online = false;

      if (profile?.last_seen) {
        const lastSeen =
          new Date(
            profile.last_seen
          ).getTime();

        const diffMinutes =
          (Date.now() - lastSeen) /
          1000 /
          60;

        online =
          diffMinutes <= 5;
      }

      return {
        ...conversation,
        profile,
        latest,
        unreadCount,
        online,
      };
    })
  );

  enhanced.sort((a, b) => {
    if (
      b.unreadCount !==
      a.unreadCount
    ) {
      return (
        b.unreadCount -
        a.unreadCount
      );
    }

    return (
      new Date(
        b.latest?.created_at ??
          b.created_at
      ).getTime() -
      new Date(
        a.latest?.created_at ??
          a.created_at
      ).getTime()
    );
  });

  return enhanced;
}

export async function hideMessageDashboardConversation(
  id: string,
  conversations: any[]
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const conversation =
    conversations.find(
      (c) => c.id === id
    );

  if (!conversation) {
    return;
  }

  if (
    conversation.buyer_id ===
    user.id
  ) {
    await supabase
      .from("conversations")
      .update({
        hidden_by_buyer: true,
      })
      .eq("id", id);
  } else {
    await supabase
      .from("conversations")
      .update({
        hidden_by_seller: true,
      })
      .eq("id", id);
  }
}