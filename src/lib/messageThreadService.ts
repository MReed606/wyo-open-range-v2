import { supabase } from "@/lib/supabase";

import { getCurrentUser } from "@/lib/currentUser";

export async function getCurrentUserId() {
  const user =
  await getCurrentUser();

  return user?.id ?? "";
}

export async function loadConversationMessages(
  conversationId: string
) {
  const { data, error } =
    await supabase
      .from("messages")
      .select("*")
      .eq(
        "conversation_id",
        conversationId
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

  if (error) {
    console.error(
      "MESSAGE LOAD ERROR:",
      error
    );

    return [];
  }

  return data ?? [];
}

export async function markConversationRead(
  conversationId: string
) {
  const user =
  await getCurrentUser();

  if (!user) {
    return;
  }

  await supabase
    .from("messages")
    .update({
      read: true,
      read_at: new Date(),
    })
    .eq(
      "conversation_id",
      conversationId
    )
    .neq(
      "sender_id",
      user.id
    );
}

export async function sendConversationMessage(
  conversationId: string,
  text: string
) {
  const user =
  await getCurrentUser();

  if (!user) {
    throw new Error(
      "User not authenticated"
    );
  }

  const { error } =
    await supabase
      .from("messages")
      .insert({
        conversation_id:
          conversationId,
        sender_id:
          user.id,
        message:
          text,
      });

  if (error) {
    throw error;
  }
}
