// src/app/classico/components/GameModeButtons.tsx
"use client"; // Adicionado para permitir o uso do hook useRouter
import React, { memo } from "react"; // Importado memo
import { useRouter } from "next/navigation"; // Importado useRouter

// Renomeado para usar com memo
const GameModeButtonsComponent = () => {
  const router = useRouter(); // Instanciado o hook

  return (
    <div className="gap-4 sm:gap-6 rounded-xl p-3 flex items-center justify-center flex-wrap">
      {/* Modo Clássico */}
      <div className="relative group">
        <button
          className="rounded-full w-16 h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
          // OTIMIZAÇÃO 1: Trocado window.location.href por router.push
          onClick={() => router.push("/SaintSeiyaDLE/classic")}
        >
          <img
            src="/dle_feed/classic_icon.png"
            alt="Modo Classic"
            // OTIMIZAÇÃO 2: Removido 'animate-border-dance' e 'animate-subtle-scale'
            className="border-2 border-yellow-500 rounded-full w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </button>
        <div className="glass-tooltip">Modo Classic</div>
      </div>

      {/* Modo Silhueta (ícone pequeno) */}
      <div className="relative group">
        <button
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
          // OTIMIZAÇÃO 1: Trocado window.location.href por router.push
          onClick={() => router.push("/SaintSeiyaDLE/silhueta")}
        >
          <img
            src="/dle_feed/silhouette_icon.png"
            alt="Modo Silhouette"
            // OTIMIZAÇÃO 2: Removido 'animate-subtle-scale'
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow-yellow"
          />
        </button>
        <div className="glass-tooltip">Silhuetas</div>
      </div>
    </div>
  );
};

// OTIMIZAÇÃO 3: Envolvido com memo
export default memo(GameModeButtonsComponent);