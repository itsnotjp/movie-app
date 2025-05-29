import type { Metadata } from "next";

import Nav from "@/components/Nav";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie/TV Catalog",
  description: "Discover and explore your favorite movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <Nav className="bg-transparent border-b-2 border-gray-300/10" />
        </header>
        <main className="mx-auto">
          {children}
        </main>
        {/* <footer className="h-10 bg-gray-600"></footer> */}
      </body>
    </html>
  );
}
