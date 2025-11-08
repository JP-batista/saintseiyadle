import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 1. Importa o novo wrapper que contém a lógica do cliente
import ClientWrapper from "./components/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. ✅ AQUI ESTÁ O TÍTULO DO SEU SITE!
export const metadata: Metadata = {
  title: "Saintseiyadle",
  description: "Adivinhe o personagem de Saint Seiya! O jogo diário.",
  // Você também pode adicionar um ícone (favicon) aqui
  // icons: "/favicon.ico", 
};

// 3. O RootLayout agora é limpo (Server Component)
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
        {/* 4. O ClientWrapper cuida dos botões e modais */}
        <ClientWrapper>
          {children}
        </ClientWrapper>

        <SpeedInsights />
      </body>
    </html>
  );
}