import { supabase } from "@/lib/supabase";

import { sendEmail } from "@/lib/email";

import { sendSMS } from "@/lib/sms";

export async function notifyUser({
  userId,
  title,
  message,
}: {
  userId: string;

  title: string;

  message: string;
}) {

  // =====================================
  // LOAD PROFILE
  // =====================================

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

  if (!profile) return;

  // =====================================
  // EMAIL
  // =====================================

  if (
    profile.email_notifications &&
    profile.email
  ) {

    await sendEmail({
      to:
        profile.email,

      subject:
        title,

      html:
        `<h1>${title}</h1><p>${message}</p>`,
    });
  }

  // =====================================
  // SMS
  // =====================================

  if (
    profile.sms_notifications &&
    profile.phone
  ) {

    await sendSMS({
      to:
        profile.phone,

      body:
        `${title}\n\n${message}`,
    });
  }
}
