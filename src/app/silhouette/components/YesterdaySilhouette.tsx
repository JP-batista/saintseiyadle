// src/app/silhouette/components/YesterdaySilhouette.tsx
"use client";

import React, { useMemo, memo } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { getArmorData } from "../../i18n/config"; // 1. Importa a função de dados de ARMADURAS
import { getCurrentDateInBrazil, getDailyArmor } from "../../utils/dailyGame"; // 2. Importa a função de ARMADURAS
import { Loader2 } from "lucide-react";
// 3. Importa os tipos de dados necessários para o Modo Silhueta
import { Armor } from "../types";

/**
 * Retorna a string da data de "ontem" (idêntico aos outros)
 */
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

/**
 * Um componente que calcula e exibe a ARMADURA do dia anterior.
 */
const YesterdaySilhouetteComponent = () => {
  const { t, locale } = useTranslation();

  // 1. Carrega a lista completa de armaduras
  const allArmors = useMemo(() => {
    // @ts-ignore
    const dataModule = getArmorData(locale);
    return (dataModule as any).default as Armor[] || [];
  }, [locale]);

  // 2. Calcula a armadura de ontem
  const yesterdayArmor = useMemo(() => {
    if (allArmors.length === 0) return null;

    // Pega a data formatada de ontem
    const yesterdayString = getYesterdayDateString();

    // Encontra a armadura para aquela data
    // @ts-ignore
    const { armor } = getDailyArmor(yesterdayString, allArmors);
    return armor as Armor; // Faz o cast para o tipo correto
  }, [allArmors]); // Recalcula se o idioma (e os dados) mudarem

  // Estado de carregamento
  // NOTA: Você precisará adicionar 'yesterday_silhouette_title' ao pt.json
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

  // Renderização da armadura encontrada
  return (
    <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-xl p-4 w-full max-w-md animate-fadeInUp">
      <h4 className="text-sm font-bold text-center text-yellow-400 mb-4 uppercase tracking-wider">
        {t('yesterday_silhouette_title')}
      </h4>
      
      {/* A Armadura (Resposta) */}
      <div className="flex items-center gap-4">
        <img
          src={yesterdayArmor.revealedImg} // Mostra a imagem revelada
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