import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "Wyo Open Range",
  description: "Wyoming’s modern marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F7F5F2] text-[#1F2933]">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
