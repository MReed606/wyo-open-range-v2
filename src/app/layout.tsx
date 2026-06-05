import "./globals.css";

import type {
  Metadata,
} from "next";

import NavBar
from "@/components/NavBar";

import Footer
from "@/components/Footer";

import PresenceTracker
 from "@/components/PresenceTracker";
 import { MobileBottomNav }
 from "@/components/mobile/MobileBottomNav";

  export const metadata: Metadata = {

  title:
    "Wyo Open Range",

  description:
    "Wyoming's marketplace for listings, businesses, forums, and community.",

};

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
<MobileBottomNav />
      </body>

    </html>

  );
}