// src/app/classic/components/ResultCard.tsx
"use client";

import React, { memo } from "react";
import { Character } from "../types";
import { useRouter } from "next/navigation";
import GameModeButtons from "../../components/GameModeButtons";
import { useTranslation } from "../../i18n/useTranslation";

type ResultCardProps = {
  cardRef: React.RefObject<HTMLDivElement | null>;
  isWin: boolean;
  selectedCharacter: Character | null;
  attemptsCount: number;
  timeRemaining: string;
  onShowStats: () => void;
};

const ResultCard: React.FC<ResultCardProps> = ({
  cardRef,
  isWin,
  selectedCharacter,
  attemptsCount,
  timeRemaining,
  onShowStats,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const navigateToMode = (path: string) => {
    router.push(path);
  }

  return (
    <div
      ref={cardRef}
      className={`mt-6 sm:mt-8 backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-gray-100 p-4 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-md mx-auto animate-fadeInUp`}
    >
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 font-bold ${
          isWin ? "text-green-400" : "text-red-400"
        }`}
      >
        {isWin ? t('result_win_title') : t('result_lose_title')}
      </h2>

      <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-gray-200">
        {t('result_character_was')}
      </p>

      <div className="flex flex-col items-center">
        <img
          src={selectedCharacter?.imgSrc}
          alt={selectedCharacter?.nome || t('form_default_name')} 
          className={`w-auto h-32 sm:h-36 md:h-40 rounded-xl mb-2 border-2 shadow-lg ${
            isWin ? "correct-indicator-enhanced border-green-500" : "border-gray-600/50"
          }`}
        />
        <p className="text-xl sm:text-2xl mb-3 sm:mb-4 font-bold text-yellow-400">
          {selectedCharacter?.nome}!
        </p>

        <p className="text-base sm:text-lg text-gray-200 mb-3 sm:mb-4">
          {t('result_attempts_count')}{" "}
          <span className="font-bold text-yellow-400">{attemptsCount}</span>
        </p>

        <div
          className={`bg-gray-900/50 border border-gray-700/50 p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 w-full ${
            timeRemaining.startsWith("00:00:") ? "countdown-pulse" : ""
          }`}
        >
          <p className="text-xs sm:text-sm text-gray-300 mb-2">
            {t('result_next_in')}
          </p>
          <p className="text-lg sm:text-xl font-bold text-yellow-400">
            {timeRemaining}
          </p>
        </div>

        <button
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:from-yellow-600 hover:to-orange-600 transition duration-300 mb-4 w-full sm:w-auto hover-lift button-press hover:shadow-glow-yellow"
          onClick={onShowStats}
        >
          {t('result_button_stats')}
        </button>

        <div className="mt-4 sm:mt-6 w-full">
          <h3 className="text-base sm:text-lg font-bold mb-2 text-yellow-400">
            {t('legend_next_mode')}
          </h3>
          <div className="flex flex-col items-center space-y-4">
            
            <div
              className="rounded-full flex items-center space-x-3 sm:space-x-4 cursor-pointer group w-full max-w-[380px] hover-lift-rotate transition-ultra-smooth"
              onClick={() => navigateToMode("/silhouette")}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition-ultra-smooth flex-shrink-0">
                <img
                  src="/dle_feed/silhouette_icon.png"
                  alt={t('mode_silhouette_name')}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                />
              </div>
              <div className="bg-gray-800/50 border-2 border-gray-700 p-3 sm:p-4 rounded-lg shadow-lg flex-1 group-hover:border-yellow-500 transition-ultra-smooth h-16 sm:h-20 flex flex-col justify-center">
                <h3 className="text-base sm:text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
                  {t('mode_silhouette_name')}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm">
                  {t('mode_silhouette_desc')}
                </p>
              </div>
            </div>

            <div>
              <GameModeButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ResultCard);