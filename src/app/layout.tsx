// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import LocaleSwitcher from "./components/LocaleSwitcher";

// 1. IMPORTAÇÃO ESTÁTICA DOS JSONS
// NOTA: Os caminhos de importação são ajustados para ir da raiz da app (src/app/) para o i18n
import ptDict from './i18n/locales/pt.json'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. FUNÇÃO NATIVA DO NEXT.JS PARA METADATA ESTÁTICA
// Usamos o dicionário Padrão (pt) para garantir que o SEO tenha um idioma base.
// O Next.js NÃO permite usar hooks aqui.
export const metadata: Metadata = {
  // I18N: Usando o dicionário estático (pt.json)
  title: ptDict.app_title, 
  description: ptDict.app_description || "Jogo diário de adivinhação de personagens de Saint Seiya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. ATRIBUTO LANG FIXO: Como não usamos o Middleware, definimos o idioma Padrão (pt)
    // O idioma da interface muda via React, mas o atributo HTML lang será pt-BR.
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-fixed bg-center bg-cover text-zinc-100 flex flex-col will-change-scroll`} 
        suppressHydrationWarning
      >
        {/* Adicione o LocaleSwitcher no topo */}
        <div className="absolute top-4 right-4 z-50">
          <LocaleSwitcher />
        </div>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}