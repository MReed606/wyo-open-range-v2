import "./globals.css";

import type { Metadata } from "next";

import NavBar from "@/components/NavBar";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Wyo Open Range",
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

        <NavBar />

        {children}

        <Footer />

      </body>

    </html>
  );
}