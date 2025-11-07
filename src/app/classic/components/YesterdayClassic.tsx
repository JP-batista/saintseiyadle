"use client";

import React, { useMemo, memo } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { characterDataMap } from "../../i18n/config"; // Importa o mapa de dados de personagens
import { getCurrentDateInBrazil, getDailyCharacter } from "../../utils/dailyGame";
import { Character } from "../../classic/types"; // Importa o tipo Character
import { Loader2 } from "lucide-react";

/**
 * Retorna a string da data de "ontem" no formato YYYY-MM-DD,
 * baseado na data de reset do jogo (São Paulo).
 */
function getYesterdayDateString(): string {
  // 1. Pega a data de jogo "de hoje" (ex: '2025-11-06')
  const todayString = getCurrentDateInBrazil();
  
  // 2. Converte para um objeto Date (de forma segura)
  // Isso garante que estamos na data correta, independentemente do fuso
  const todayParts = todayString.split('-').map(Number);
  const todayGameDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

  // 3. Subtrai um dia
  const yesterdayGameDate = new Date(todayGameDate);
  yesterdayGameDate.setDate(yesterdayGameDate.getDate() - 1);

  // 4. Formata de volta para YYYY-MM-DD
  const year = yesterdayGameDate.getFullYear();
  const month = String(yesterdayGameDate.getMonth() + 1).padStart(2, "0");
  const day = String(yesterdayGameDate.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
}

/**
 * Um componente que calcula e exibe o personagem do Modo Clássico
 * do dia anterior.
 */
const YesterdayClassicComponent = () => {
  const { t, locale } = useTranslation();

  // 1. Carrega a lista completa de personagens do modo clássico
  const allCharacters = useMemo(() => {
    // @ts-ignore
    const dataModule = characterDataMap[locale] || characterDataMap['pt'];
    return (dataModule as any).default as Character[] || [];
  }, [locale]);

  // 2. Calcula o personagem de ontem
  const yesterdayCharacter = useMemo(() => {
    if (allCharacters.length === 0) return null;

    // Pega a data formatada de ontem
    const yesterdayString = getYesterdayDateString();

    // Encontra o personagem para aquela data
    const { character } = getDailyCharacter(yesterdayString, allCharacters);
    return character;
  }, [allCharacters]); // Recalcula se o idioma (e os dados) mudarem

  // Estado de carregamento (enquanto os dados de personagem são carregados)
  if (!yesterdayCharacter) {
    return (
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 shadow-xl p-4 w-full max-w-md">
        <h4 className="text-sm font-bold text-center text-yellow-400 mb-3">
          {t('yesterday_character_title')}
        </h4>
        <div className="flex items-center justify-center h-20">
          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
        </div>
      </div>
    );
  }

  // Renderização do personagem encontrado
  return (
    <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl p-4 w-full max-w-md animate-fadeInUp">
      <h4 className="text-sm font-bold text-center text-yellow-400 mb-3 uppercase tracking-wider">
        {t('yesterday_character_title')}
      </h4>
      <div className="flex items-center gap-4">
        <img
          src={yesterdayCharacter.imgSrc}
          alt={yesterdayCharacter.nome}
          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-600/50 shadow-lg"
          loading="lazy"
        />

        <div className="flex flex-col min-w-0">
          <span className="font-bold text-white text-lg truncate">
            {yesterdayCharacter.nome}
          </span>
          <span className="text-xs text-gray-400">
            {yesterdayCharacter.titulo || yesterdayCharacter.patente}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(YesterdayClassicComponent);