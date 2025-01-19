import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";


export const metadata: Metadata = {
  title: "AquaTrack",
  description: "Your Water Business Partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
