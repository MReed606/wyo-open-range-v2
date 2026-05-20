import type { Metadata } from "next";

import "./globals.css";

import NavBar from "../components/NavBar";

import { Footer } from "../components/Footer";

import { ActivityTracker } from "@/components/activity/ActivityTracker";

import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";

export const metadata: Metadata = {
  title: "Wyo Open Range",

  description:
    "Wyoming's community marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <body>

        <NavBar />

        <ActivityTracker />

        {children}

        <Footer />

        <MobileBottomNav />

      </body>

    </html>
  );
}
