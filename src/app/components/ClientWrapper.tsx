"use client"; 

import { useState } from "react";
import { Settings } from "lucide-react";
import Footer from "./Footer";
import LocaleSwitcher from "./LocaleSwitcher";
import SettingsModalComponent from "./SettingsButton";

export default function ClientWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <> 
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
          <Settings className="w-6 h-6 text-yellow-400" />
        </button>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <LocaleSwitcher />
      </div>

      <main className="flex-grow">{children}</main>

      <Footer />

      <SettingsModalComponent
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}