// src/app/components/StatsBar.tsx
"use client";

import React, { memo, useState } from "react";
// CORREÇÃO DE PATH: O caminho para 'i18n' mudou (subiu um nível)
import { useTranslation } from "../i18n/useTranslation";
// ATUALIZAÇÃO: Importa apenas o NewsModal. O HelpModal é controlado pela página-pai.
import NewsModal from "./NewsModal"; 

type StatsBarProps = {
  // O componente não sabe de qual store vem a streak, apenas a exibe
  currentStreak: number;
  
  // A página-pai decide qual modal de estatísticas abrir
  onShowStats: () => void;
  
  onShowNews: () => void;
  onShowHelp?: () => void; // A página-pai decide o que fazer com este clique
};

const StatsBarComponent: React.FC<StatsBarProps> = ({
  currentStreak, // <-- Prop vinda do pai
  onShowStats,   // <-- Prop vindo do pai
  onShowNews,
  onShowHelp,    // <-- Prop vinda do pai
}) => {
  const { t } = useTranslation();
  
  // O StatsBar controla apenas os modais genéricos (como News)
  const [isNewsOpen, setIsNewsOpen] = useState(false); 

  // ATUALIZAÇÃO: Handlers do HelpModal removidos.
  
  // Handlers para o Modal de Novidades (Genérico)
  const handleOpenNews = () => {
    setIsNewsOpen(true);
    // Chama a prop onShowNews (caso a página-pai queira rastrear)
    if (onShowNews) onShowNews();
  };
  
  const handleCloseNews = () => {
    setIsNewsOpen(false);
  };

  return (
    <>
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-3 sm:p-4 mb-8 flex items-center justify-center gap-2 sm:gap-4 animate-fadeInUp">
        
        {/* 1. Estatísticas */}
        <div className="relative group">
          <button
            onClick={onShowStats} // <-- Chama a prop do pai
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-xl sm:text-2xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_stats")}
          >
            📊
          </button>
          <div className="glass-tooltip">{t("stats_bar_stats")}</div>
        </div>

        {/* 2. Sequência Atual */}
        <div className="relative group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex flex-col items-center justify-center transition-all duration-300 shadow-glow-yellow">
            <span className="text-xl">🔥</span>
            <span className="font-bold text-yellow-400 text-xs -mt-0.5">
              {currentStreak || 0} {/* <-- Usa a prop vinda do pai */}
            </span>
          </div>
          <div className="glass-tooltip">{t("stats_bar_streak")}</div>
        </div>

        {/* 3. Novidades */}
        <div className="relative group">
          <button
            onClick={handleOpenNews} // <-- Controlado localmente
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-xl sm:text-2xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_news")}
          >
            ✨
          </button>
          <div className="glass-tooltip">{t("stats_bar_news")}</div>
        </div>

        {/* 4. Como Jogar */}
        <div className="relative group">
          <button
            onClick={onShowHelp} // ATUALIZAÇÃO: Chama a prop 'onShowHelp' diretamente
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-xl sm:text-2xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_help")}
          >
            ❓
          </button>
          <div className="glass-tooltip">{t("stats_bar_help")}</div>
        </div>
      </div>

      {/* ATUALIZAÇÃO: Renderiza apenas o NewsModal. O HelpModal será renderizado pela página-pai. */}
      <NewsModal isOpen={isNewsOpen} onClose={handleCloseNews} />
    </>
  );
};

export default memo(StatsBarComponent);