import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
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
  title: "Cookie Pulse — Cookie Chain portfolio & network pulse",
  description:
    "Connect Nightly, view COOK/SPL balances, monitor Cookie Chain health, search tokens via Cookiescan DAS, and send real on-chain memos or tiny COOK transfers.",
  metadataBase: new URL("https://cookie-pulse.vercel.app"),
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: "Cookie Pulse",
    description: "Live explorer-lite + portfolio pulse for Cookie Chain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
