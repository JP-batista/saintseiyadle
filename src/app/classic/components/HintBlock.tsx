// srcapp/classicc/components/HintBlock.tsx
"use client";
import React, { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation"; 

type HintBlockProps = {
  attemptsCount: number;
  dica1: string | null | undefined;
  dica2: string | null | undefined;
};

const HintBlock: React.FC<HintBlockProps> = ({
  attemptsCount,
  dica1,
  dica2,
}) => {
  const { t } = useTranslation(); 
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);

  const canShowHint1 = attemptsCount >= 5;
  const canShowHint2 = attemptsCount >= 10;

  const attemptsToHint1 = 5 - attemptsCount;
  const attemptsToHint2 = 10 - attemptsCount;

  return (
    <div className="w-full max-w-md backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-white rounded-2xl shadow-2xl p-5 sm:p-6 mb-6 animate-fadeInUp">
      
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 text-yellow-400 tracking-wide">
        {t('hint_block_title')}
      </h3>

      <div className="flex justify-between gap-4">
        <button
          onClick={() => setShowHint1(!showHint1)}
          disabled={!canShowHint1}
          className={`
            flex-1 p-3 text-center border-2 rounded-lg font-bold text-sm transition-all duration-300 transform 
            
            border-yellow-500/70 bg-gray-700/80 text-yellow-300 shadow-md shadow-yellow-500/20 
            hover:bg-yellow-500 hover:text-gray-900 hover:shadow-glow-yellow hover:scale-105 button-press
            
            disabled:bg-gray-800/50 disabled:border-gray-600/50 disabled:text-gray-500/70
            disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none 
            disabled:hover:scale-100 disabled:hover:bg-gray-800/50 disabled:hover:text-gray-500/70
          `}
        >
          {t('hint_button_1')}
        </button>
        
        <button
          onClick={() => setShowHint2(!showHint2)}
          disabled={!canShowHint2}
          className={`
            flex-1 p-3 text-center border-2 rounded-lg font-bold text-sm transition-all duration-300 transform 
            
            border-yellow-500/70 bg-gray-700/80 text-yellow-300 shadow-md shadow-yellow-500/20 
            hover:bg-yellow-500 hover:text-gray-900 hover:shadow-glow-yellow hover:scale-105 button-press
            
            disabled:bg-gray-800/50 disabled:border-gray-600/50 disabled:text-gray-500/70
            disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none 
            disabled:hover:scale-100 disabled:hover:bg-gray-800/50 disabled:hover:text-gray-500/70
          `}
        >
          {t('hint_button_2')}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {showHint1 && canShowHint1 && (
          <div
            className="p-3 bg-gray-900/50 backdrop-blur-sm border border-yellow-500/50 rounded-lg text-center text-sm font-semibold text-yellow-300 shadow-lg hint-appear"
            key={`hint1-${dica1}`}
          >
            {dica1 || t('hint_default_msg')}
          </div>
        )}
        {showHint2 && canShowHint2 && (
          <div
            className="p-3 bg-gray-900/50 backdrop-blur-sm border border-yellow-500/50 rounded-lg text-center text-sm font-semibold text-yellow-300 shadow-lg hint-appear"
            key={`hint2-${dica2}`}
          >
            {dica2 || t('hint_default_msg')}
          </div>
        )}

        <div className="p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-center text-sm">
          {attemptsCount < 5 && (
            <p className="text-gray-300">
              {t('hint_attempts_missing_1', { count: attemptsToHint1 })}
            </p>
          )}
          {attemptsCount >= 5 && attemptsCount < 10 && (
            <p className="text-gray-300">
              {t('hint_attempts_missing_2', { count: attemptsToHint2 })}
            </p>
          )}
          {attemptsCount >= 10 && (
            <p className="text-gray-300">{t('hint_all_unlocked')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HintBlock;