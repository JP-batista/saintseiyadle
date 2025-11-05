// src/app/classico/components/GameModeButtons.tsx
import React from "react";

const GameModeButtons = () => {
  return (
    <div className="gap-4 sm:gap-6 rounded-xl p-3 flex items-center justify-center flex-wrap">
      {/* Modo Clássico */}
      <div className="relative group">
        <button
          className="rounded-full w-16 h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
          onClick={() => (window.location.href = "/SaintSeiyaDLE/classic")}
        >
          <img
            src="/dle_feed/classic_icon.png"
            alt="Modo Classic"
            className="border-2 border-yellow-500 rounded-full w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 animate-border-dance animate-subtle-scale"
          />
        </button>
        <div className="glass-tooltip">Modo Classic</div>
      </div>

      {/* Modo Silhueta (ícone pequeno) */}
      <div className="relative group">
        <button
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
          onClick={() => (window.location.href = "/SaintSeiyaDLE/silhueta")}
        >
          <img
            src="/dle_feed/silhouette_icon.png"
            alt="Modo Silhouette"
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow-yellow animate-subtle-scale"
          />
        </button>
        <div className="glass-tooltip">Silhuetas</div>
      </div>
    </div>
  );
};

export default GameModeButtons;