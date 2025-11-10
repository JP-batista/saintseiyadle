"use client";

import { useMemo, memo } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { getAttackData } from "../../i18n/config"; 
import { getCurrentDateInBrazil, getDailyAttack } from "../../utils/dailyGame";
import { Loader2 } from "lucide-react";
import { CharacterWithAttacks, SelectedAttack } from "../../i18n/types";

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

const flattenAttackData = (dataModule: any): SelectedAttack[] => {
    const charactersWithAttacks = (dataModule as any).default as CharacterWithAttacks[] || [];
    const allAttacks: SelectedAttack[] = [];

    for (const character of charactersWithAttacks) {
        const characterInfo = {
            idKey: character.idKey,
            nome: character.nome,
            imgSrc: character.imgSrc,
            patente: character.patente,
            titulo: character.titulo,
        };
        for (const attack of character.attacks) {
            allAttacks.push({
              attack: {
                idAttack: attack.idAttack,
                name: attack.name,
                gifSrc: attack.gifSrc,
              },
              character: characterInfo,
            });
        }
    }
    return allAttacks;
};

const YesterdayAttackComponent = () => {
  const { t, locale } = useTranslation();

  const allAttackData = useMemo(() => {
    const dataModule = getAttackData(locale);
    return dataModule;
  }, [locale]);

  const yesterdayAttack = useMemo(() => {
    if (!allAttackData) return null;

    const allFlattenedAttacks = flattenAttackData(allAttackData);
    if (allFlattenedAttacks.length === 0) return null;

    const yesterdayString = getYesterdayDateString();

    const { attack } = getDailyAttack(yesterdayString, allFlattenedAttacks);
    return attack as SelectedAttack; 
  }, [allAttackData]); 

  if (!yesterdayAttack) {
    return (
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-xl p-4 w-full max-w-md">
        <h4 className="text-sm font-bold text-center text-yellow-400 mb-3">
          {t('yesterday_attack_title')} 
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
        {t('yesterday_attack_title')}
      </h4>
      
      <div className="mb-4 p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg">
        <h5 className="text-base text-gray-200 text-center font-bold">
           {yesterdayAttack.attack.name}
        </h5>
        <div className="relative w-full aspect-video rounded-lg bg-gray-900 overflow-hidden border border-gray-700 mt-2">
            <img
                src={yesterdayAttack.attack.gifSrc}
                alt={yesterdayAttack.attack.name}
                className={`w-full h-full object-contain`}
                loading="lazy"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = "/dle_feed/placeholder.png";
                }}
            />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={yesterdayAttack.character.imgSrc}
          alt={yesterdayAttack.character.nome}
          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-600/50 shadow-lg"
          loading="lazy"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-gray-400">
             {t('yesterday_correct_answer')}
          </span>
          <span className="font-bold text-white text-lg truncate">
            {yesterdayAttack.character.nome}
          </span>
          <span className="text-xs text-gray-400">
            {yesterdayAttack.character.titulo || yesterdayAttack.character.patente}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(YesterdayAttackComponent);