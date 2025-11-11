// src/app/silhouette/components/YesterdaySilhouette.tsx
"use client";

import React, { useMemo, memo } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { getArmorData } from "../../i18n/config"; 
import { getCurrentDateInBrazil, getDailyArmor } from "../../utils/dailyGame"; 
import { Loader2 } from "lucide-react";
import { Armor } from "../types";

function getYesterdayDateString(): string {
  const todayString = getCurrentDateInBrazil();
  const todayParts = todayString.split('-').map(Number);
  const todayGameDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);
  const yesterdayGameDate = new Date(todayGameDate);
  yesterdayGameDate.setDate(yesterdayGameDate.getDate() - 1);

  const year = yesterdayGameDate.getFullYear();
  const month = String(yesterdayGameDate.getMonth() + 1).padStart(2, "0");
  const day = String(yesterdayGameDate.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
}

const YesterdaySilhouetteComponent = () => {
  const { t, locale } = useTranslation();

  const allArmors = useMemo(() => {
    const dataModule = getArmorData(locale);
    return (dataModule as any).default as Armor[] || [];
  }, [locale]);

  const yesterdayArmor = useMemo(() => {
    if (allArmors.length === 0) return null;

    const yesterdayString = getYesterdayDateString();

    const { armor } = getDailyArmor(yesterdayString, allArmors);
    return armor as Armor; 
  }, [allArmors]); 

  if (!yesterdayArmor) {
    return (
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-xl p-4 w-full max-w-md">
        <h4 className="text-sm font-bold text-center text-yellow-400 mb-3">
          {t('yesterday_silhouette_title')} 
        </h4>
        <div className="flex items-center justify-center h-20">
          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-xl p-4 w-full max-w-md animate-fadeInUp">
      <h4 className="text-sm font-bold text-center text-yellow-400 mb-4 uppercase tracking-wider">
        {t('yesterday_silhouette_title')}
      </h4>
      
      <div className="flex items-center gap-4">
        <img
          src={yesterdayArmor.revealedImg} 
          alt={yesterdayArmor.name}
          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-600/50 shadow-lg"
          loading="lazy"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-white text-lg truncate">
            {yesterdayArmor.name}
          </span>
          <span className="text-xs text-gray-400">
            {yesterdayArmor.knight}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(YesterdaySilhouetteComponent);