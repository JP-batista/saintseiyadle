// src/app/classic/components/GameLegend.tsx
"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import GameModeButtons from "../../components/GameModeButtons";
import { useTranslation } from "../../i18n/useTranslation"; 
import YesterdayClassic from '../components/YesterdayClassic';

const GameLegendComponent = () => {
  const router = useRouter();
  const { t } = useTranslation(); 

  return (
    <div
      className={`mt-6 sm:mt-8 backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-gray-100 p-4 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-md mx-auto animate-fadeInUp`}
    >
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-bold mb-4 text-center text-yellow-400">
          {t('legend_indicators')} 
        </h3>

        <div className="flex items-center justify-around space-x-4 w-full">
          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/certo.png"
                alt={t('legend_correct')} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">{t('legend_correct')}</span>
          </div>
          
          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/errado.png"
                alt={t('legend_incorrect')} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">{t('legend_incorrect')}</span>
          </div>

          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/mais.png"
                alt={t('legend_higher')} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">{t('legend_higher')}</span>
          </div>

          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/menos.png"
                alt={t('legend_lower')} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">{t('legend_lower')}</span>
          </div>
        </div>
        
        <YesterdayClassic />

        <GameModeButtons />
      </div>
    </div>
  );
};

export default memo(GameLegendComponent);