// src/app/components/StatsBar.tsx
"use client";

import React, { memo, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import NewsModal from "./NewsModal"; 

type StatsBarProps = {
  currentStreak: number;
  onShowStats: () => void;
  onShowNews: () => void;
  onShowHelp?: () => void; 
};

const StatsBarComponent: React.FC<StatsBarProps> = ({
  currentStreak, 
  onShowStats,   
  onShowNews,
  onShowHelp,    
}) => {
  const { t } = useTranslation();
  
  const [isNewsOpen, setIsNewsOpen] = useState(false); 

  const handleOpenNews = () => {
    setIsNewsOpen(true);
    if (onShowNews) onShowNews();
  };
  
  const handleCloseNews = () => {
    setIsNewsOpen(false);
  };

  return (
    <>
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-3 sm:p-4 mb-8 flex items-center justify-center gap-2 sm:gap-4 animate-fadeInUp">
        
        <div className="relative group">
          <button
            onClick={onShowStats} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-xl sm:text-2xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_stats")}
          >
            📊
          </button>
          <div className="glass-tooltip">{t("stats_bar_stats")}</div>
        </div>

        <div className="relative group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex flex-col items-center justify-center transition-all duration-300 shadow-glow-yellow">
            <span className="text-xl">🔥</span>
            <span className="font-bold text-yellow-400 text-xs -mt-0.5">
              {currentStreak || 0} 
            </span>
          </div>
          <div className="glass-tooltip">{t("stats_bar_streak")}</div>
        </div>

        <div className="relative group">
          <button
            onClick={handleOpenNews} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-xl sm:text-2xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_news")}
          >
            ✨
          </button>
          <div className="glass-tooltip">{t("stats_bar_news")}</div>
        </div>

        <div className="relative group">
          <button
            onClick={onShowHelp} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-xl sm:text-2xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_help")}
          >
            ❓
          </button>
          <div className="glass-tooltip">{t("stats_bar_help")}</div>
        </div>
      </div>

      <NewsModal isOpen={isNewsOpen} onClose={handleCloseNews} />
    </>
  );
};

export default memo(StatsBarComponent);