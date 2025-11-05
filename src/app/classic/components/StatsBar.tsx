// src/app/classico/components/StatsBar.tsx
import React, { memo } from "react"; // Importado 'memo'

type StatsBarProps = {
  currentStreak: number;
  onShowStats: () => void;
  onShowNews: () => void;
  onShowHelp: () => void;
};

// Renomeado para usar com 'memo'
const StatsBarComponent: React.FC<StatsBarProps> = ({
  currentStreak,
  onShowStats,
  onShowNews,
  onShowHelp,
}) => {
  return (
    <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-3 sm:p-4 mb-8 flex items-center justify-center gap-4 sm:gap-6 animate-fadeInUp">
      {/* 1. Estatísticas */}
      <div className="relative group">
        <button
          onClick={onShowStats}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-3xl sm:text-4xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
        >
          📊
        </button>
        <div className="glass-tooltip">Estatísticas</div>
      </div>

      {/* 2. Sequência Atual */}
      <div className="relative group">
        {/* OTIMIZAÇÃO 1: Removido 'animate-subtle-scale' */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex flex-col items-center justify-center transition-all duration-300 shadow-glow-yellow">
          <span className="text-3xl">🔥</span>
          <span className="font-bold text-yellow-400 text-sm -mt-1">
            {currentStreak || 0}
          </span>
        </div>
        <div className="glass-tooltip">Sequência Atual</div>
      </div>

      {/* 3. Novidades */}
      <div className="relative group">
        <button
          onClick={onShowNews}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-3xl sm:text-4xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
        >
          ✨
        </button>
        <div className="glass-tooltip">Novidades</div>
      </div>

      {/* 4. Como Jogar */}
      <div className="relative group">
        <button
          onClick={onShowHelp}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900/50 border-2 border-gray-700/50 flex items-center justify-center text-3xl sm:text-4xl focus:outline-none transition-ultra-smooth hover-lift-rotate group-hover:shadow-glow-yellow group-hover:border-yellow-500/50"
        >
          ❓
        </button>
        <div className="glass-tooltip">Como Jogar</div>
      </div>
    </div>
  );
};

// OTIMIZAÇÃO 2: Envolvido com 'memo'
export default memo(StatsBarComponent);