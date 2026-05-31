"use client";

import {
  useEffect,
} from "react";

import {
  supabase
} from "@/lib/supabase";

export default function PresenceTracker() {

  useEffect(() => {

    let interval:
      NodeJS.Timeout;

    async function updatePresence() {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        return;
      }

      await supabase
  .from("profiles")
  .update({

    last_active_at:
      new Date()
        .toISOString(),

  })
        .eq(
          "id",
          user.id
        );
    }

    // INITIAL UPDATE

    updatePresence();

    // HEARTBEAT

    interval =
      setInterval(() => {

        updatePresence();

      }, 60000);

    // TAB VISIBILITY

    function handleVisibility() {

      if (
        document.visibilityState ===
        "visible"
      ) {

        updatePresence();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {

      clearInterval(
        interval
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

    };

  }, []);

  return null;
}