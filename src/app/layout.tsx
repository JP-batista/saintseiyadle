import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saint Seiya DLE",
  description: "Jogo diário de adivinhação de personagens de Saint Seiya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-fixed bg-center bg-cover text-zinc-100 flex flex-col will-change-scroll`} 
        // OTIMIZAÇÃO 2: Adicionado will-change-scroll para melhor fluidez de rolagem.
        suppressHydrationWarning
      >
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}