import React, { memo, useState } from "react";
import { useTranslation } from "../../i18n/useTranslation"; // Importa o hook
import HelpModal from "../../components/HelpModal"; // Importa o modal de ajuda
import NewsModal from "../../components/NewsModal"; // 💥 NOVO: Importa o modal de novidades

type StatsBarProps = {
  currentStreak: number;
  onShowStats: () => void;
  onShowNews: () => void;
  onShowHelp?: () => void; // deixei opcional para maior flexibilidade
};

const StatsBarComponent: React.FC<StatsBarProps> = ({
  currentStreak,
  onShowStats,
  onShowNews,
  onShowHelp,
}) => {
  const { t } = useTranslation(); // Instancia a tradução
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false); // 💥 NOVO: Estado para Novidades

  // Handlers para o Modal de Ajuda
  const handleOpenHelp = () => {
    setIsHelpOpen(true);
    if (onShowHelp) onShowHelp();
  };

  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };
  
  // Handlers para o Modal de Novidades
  const handleOpenNews = () => {
    setIsNewsOpen(true);
    // Chama o callback externo se existir (e.g., para rastreamento)
    if (onShowNews) onShowNews();
  };
  
  const handleCloseNews = () => {
    setIsNewsOpen(false);
  };

  return (
    <>
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-3 sm:p-4 mb-8 flex items-center justify-center gap-4 sm:gap-6 animate-fadeInUp">
        {/* 1. Estatísticas */}
        <div className="relative group">
          <button
            onClick={onShowStats}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-3xl sm:text-4xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_stats")}
          >
            📊
          </button>
          {/* I18N: Traduzido tooltip */}
          <div className="glass-tooltip">{t("stats_bar_stats")}</div>
        </div>

        {/* 2. Sequência Atual */}
        <div className="relative group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex flex-col items-center justify-center transition-all duration-300 shadow-glow-yellow">
            <span className="text-3xl">🔥</span>
            <span className="font-bold text-yellow-400 text-sm -mt-1">
              {currentStreak || 0}
            </span>
          </div>
          {/* I18N: Traduzido tooltip */}
          <div className="glass-tooltip">{t("stats_bar_streak")}</div>
        </div>

        {/* 3. Novidades */}
        <div className="relative group">
          <button
            onClick={handleOpenNews}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-3xl sm:text-4xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_news")}
          >
            ✨
          </button>
          {/* I18N: Traduzido tooltip */}
          <div className="glass-tooltip">{t("stats_bar_news")}</div>
        </div>

        {/* 4. Como Jogar */}
        <div className="relative group">
          <button
            onClick={handleOpenHelp}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-3xl sm:text-4xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_help")}
          >
            ❓
          </button>
          {/* I18N: Traduzido tooltip */}
          <div className="glass-tooltip">{t("stats_bar_help")}</div>
        </div>
      </div>

      {/* Renderiza o modal de ajuda controlado localmente */}
      <HelpModal isOpen={isHelpOpen} onClose={handleCloseHelp} />
      {/* 💥 NOVO MODAL */}
      <NewsModal isOpen={isNewsOpen} onClose={handleCloseNews} />
    </>
  );
};

export default memo(StatsBarComponent);