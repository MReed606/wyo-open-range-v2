"use client";

import "./globals.css";

import {
  useEffect,
} from "react";

import type {
  Metadata,
} from "next";

import NavBar
from "@/components/NavBar";

import Footer
from "@/components/Footer";

import {
  supabase
} from "@/lib/supabase";

export const metadata: Metadata = {

  title:
    "Wyo Open Range",

  description:
    "Wyoming's marketplace for listings, businesses, forums, and community.",

};

function PresenceTracker() {

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

          last_seen:
            new Date()
              .toISOString(),

        })
        .eq(
          "id",
          user.id
        );
    }

    // =====================================
    // INITIAL UPDATE
    // =====================================

    updatePresence();

    // =====================================
    // HEARTBEAT
    // =====================================

    interval =
      setInterval(() => {

        updatePresence();

      }, 60000);

    // =====================================
    // TAB VISIBILITY
    // =====================================

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

    // =====================================
    // CLEANUP
    // =====================================

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body suppressHydrationWarning>

        <PresenceTracker />

        <NavBar />

        {children}

        <Footer />

      </body>

    </html>

  );
}