import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CanaryTrack | Global Canary Breeding Management Platform",
  description:
    "CanaryTrack is a global canary breeding management platform for breeders, aviaries, and clubs. Track birds, pairings, pedigree, production, sales, and expenses in one place.",
  metadataBase: new URL("https://trycanarytrack.com"),
  openGraph: {
    title: "CanaryTrack",
    description:
      "Global Canary Breeding Management Platform for modern breeders.",
    url: "https://trycanarytrack.com",
    siteName: "CanaryTrack",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CanaryTrack",
    description:
      "Global Canary Breeding Management Platform for modern breeders.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}