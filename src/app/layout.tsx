import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ClientWrapper from "./components/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saintseiyadle",
  description: "Adivinhe o personagem de Saint Seiya! O jogo diário.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <meta name="google-site-verification" content="9MVcrYg5zxMSi-yRc4lZNeouckv7jZlZIJiA9YFK1B4" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-fixed bg-center bg-cover text-zinc-100 flex flex-col will-change-scroll`}
        suppressHydrationWarning
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>

        <SpeedInsights />
      </body>
    </html>
  );
}