// srcapp/classicc/components/StatsBar.tsx
import React, { memo, useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import HelpModal from "../../components/HelpModal";
import NewsModal from "../../components/NewsModal"; 
// import { Disc } from "lucide-react"; // 💥 REMOVIDO: Ícone de Disc

type StatsBarProps = {
  currentStreak: number;
  onShowStats: () => void;
  onShowNews: () => void;
  onShowHelp?: () => void;
  // onShowData: () => void; // 💥 REMOVIDO: Prop onShowData
};

const StatsBarComponent: React.FC<StatsBarProps> = ({
  currentStreak,
  onShowStats,
  onShowNews,
  onShowHelp,
  // onShowData, // 💥 REMOVIDO: Prop onShowData
}) => {
  const { t } = useTranslation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false); 

  // Handlers para o Modal de Ajuda
  const handleOpenHelp = () => {
    setIsHelpOpen(true);
    if (onShowHelp) onShowHelp();
  };

  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };
  
  // Handlers para o Modal de Novidades (mantidos como exemplo)
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
        
        {/* 1. Estatísticas */}
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

        {/* 2. Sequência Atual */}
        <div className="relative group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex flex-col items-center justify-center transition-all duration-300 shadow-glow-yellow">
            <span className="text-xl">🔥</span>
            <span className="font-bold text-yellow-400 text-xs -mt-0.5">
              {currentStreak || 0}
            </span>
          </div>
          <div className="glass-tooltip">{t("stats_bar_streak")}</div>
        </div>
        
        {/* 3. DADOS (Import/Export) 💥 REMOVIDO: Movido para o botão de Configurações no Layout */}
        {/* <div className="relative group">
          <button
            onClick={onShowData}
            // ... (Restante do botão de Disc)
          >
            <Disc className="w-5 h-5 sm:w-6 sm:h-6" /> 
          </button>
          <div className="glass-tooltip">{t("data_modal_title")}</div>
        </div> */}

        {/* 4. Novidades */}
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

        {/* 5. Como Jogar */}
        <div className="relative group">
          <button
            onClick={handleOpenHelp}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-xl sm:text-2xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
            aria-label={t("stats_bar_help")}
          >
            ❓
          </button>
          <div className="glass-tooltip">{t("stats_bar_help")}</div>
        </div>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={handleCloseHelp} />
      <NewsModal isOpen={isNewsOpen} onClose={handleCloseNews} />
    </>
  );
};

export default memo(StatsBarComponent);