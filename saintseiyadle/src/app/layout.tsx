import type { Metadata } from "next";
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
  title: "SaintSeiyadle",
  description: "Descubra o cavaleiro do dia e queime seu cosmo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-fixed bg-center bg-cover text-zinc-100`}
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/originals/84/1b/c0/841bc0ef61518645f58293d7b2167f57.png')",
        }}
      >
        {children}
      </body>
    </html>
  );
}
