"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import LocaleSwitcher from "./components/LocaleSwitcher";
import SettingsModalComponent from "./components/SettingsButton"; // ✅ Importa o modal
import { useState } from "react";
import { Settings } from "lucide-react";

// 1. IMPORTAÇÃO ESTÁTICA DOS JSONS
import ptDict from "./i18n/locales/pt.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 3. COMPONENTE PRINCIPAL
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-fixed bg-center bg-cover text-zinc-100 flex flex-col will-change-scroll`}
        suppressHydrationWarning
      >
        {/* 🔧 BOTÃO DO MODAL NO CANTO SUPERIOR ESQUERDO */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="
              p-1 rounded-full bg-gray-900/70 border-2 border-yellow-500/50 
              transition-all duration-300 hover:scale-105 hover:bg-gray-800/80
              shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400
              flex items-center justify-center
            "
            aria-label="Abrir configurações"
          >
            {/* Ícone de Engrenagem (Sem rotação) */}
            <Settings className="w-6 h-6 text-yellow-400" />
          </button>
        </div>

        {/* 🌐 LocaleSwitcher no canto superior direito */}
        <div className="absolute top-4 right-4 z-50">
          <LocaleSwitcher />
        </div>

        {/* Conteúdo principal */}
        <main className="flex-grow">{children}</main>

        {/* Rodapé */}
        <Footer />

        {/* 🪟 Modal de Configurações */}
        <SettingsModalComponent
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </body>
    </html>
  );
}
