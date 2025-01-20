import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "AquaTrack - Your Water Business Partner",
  description:
    "Simplify your water jar business with AquaTrack. Manage customers, track jar deliveries, and grow digitally with our camper management app.",
  keywords: [
    "Water Jar Management",
    "Camper Management App",
    "Track Water Jars",
    "Water Business Solution",
    "Digital Business Tools",
  ],
  authors: [{ name: "Shivam Bhati", url: "https://aquatracker.in" }],
  creator: "Shivam Bhati",
  openGraph: {
    title: "AquaTrack - Your Water Business Partner",
    description:
      "Track water jars, manage customers, and grow your water business effortlessly. AquaTrack is your ultimate solution for camper management.",
    url: "https://aquatracker.in",
    siteName: "AquaTrack",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "AquaTrack - Your Water Business Partner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AquaTrack - Your Water Business Partner",
    description:
      "Manage your water jar business digitally. Track jars, handle customers, and grow with ease using AquaTrack.",
    images: ["/preview-image.png"],
  },
  themeColor: "#007BFF",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
