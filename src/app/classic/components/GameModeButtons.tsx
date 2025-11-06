// src/app/classico/components/GameModeButtons.tsx
"use client";
import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../i18n/useTranslation"; // Importa o hook

const GameModeButtonsComponent = () => {
  const router = useRouter();
  const { t } = useTranslation(); // Instancia a tradução

  return (
    <div className="gap-4 sm:gap-6 rounded-xl p-3 flex items-center justify-center flex-wrap">
      {/* Modo Clássico */}
      <div className="relative group">
        <button
          className="rounded-full w-16 h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
          onClick={() => router.push("/classic")}
        >
          <img
            src="/dle_feed/classic_icon.png"
            // I18N: Traduzido alt
            alt={t('mode_classic_name')}
            className="border-2 border-yellow-500 rounded-full w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </button>
        {/* I18N: Traduzido tooltip */}
        <div className="glass-tooltip">{t('mode_classic_name')}</div>
      </div>

      {/* Modo Silhueta (ícone pequeno) */}
      <div className="relative group">
        <button
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
          onClick={() => router.push("/SaintSeiyaDLE/silhueta")}
        >
          <img
            src="/dle_feed/silhouette_icon.png"
            // I18N: Traduzido alt
            alt={t('mode_silhouette_name')}
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow-yellow"
          />
        </button>
        {/* I18N: Traduzido tooltip */}
        <div className="glass-tooltip">{t('mode_silhouette_name')}</div>
      </div>
    </div>
  );
};

export default memo(GameModeButtonsComponent);