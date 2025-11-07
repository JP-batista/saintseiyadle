"use client";

import React, { useMemo, memo } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { quoteDataMap } from "../../i18n/config"; // 1. Importa o mapa de dados de FALAS
import { getCurrentDateInBrazil, getDailyQuote } from "../../utils/dailyGame"; // 2. Importa a função de FALAS
import { Loader2 } from "lucide-react";
// 3. Importa os tipos de dados necessários para o Modo Fala
import { CharacterWithQuotes, SelectedQuote } from "../../i18n/types";

/**
 * Retorna a string da data de "ontem" (idêntico ao YesterdayClassic)
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
 * "Achata" (flattens) a estrutura de dados das falas.
 * Copiado de 'useDailyQuote.ts' para tornar este componente autônomo.
 */
const flattenQuoteData = (dataModule: any): SelectedQuote[] => {
    const charactersWithQuotes = (dataModule as any).default as CharacterWithQuotes[] || [];
    const allQuotes: SelectedQuote[] = [];

    for (const character of charactersWithQuotes) {
        const characterInfo = {
            idKey: character.idKey,
            nome: character.nome,
            imgSrc: character.imgSrc,
            patente: character.patente,
            titulo: character.titulo,
        };
        for (const quote of character.quotes) {
            allQuotes.push({
              quote: {
                idQuote: quote.idQuote,
                texts: quote.texts,
                dica1: quote.dica1,
                dica2: quote.dica2,
              },
              character: characterInfo,
              patente: character.patente,
              titulo: character.titulo,
            });
        }
    }
    return allQuotes;
};

/**
 * Um componente que calcula e exibe a FALA do dia anterior.
 */
const YesterdayQuoteComponent = () => {
  const { t, locale } = useTranslation();

  // 1. Carrega a lista completa de falas (ainda aninhada)
  const allQuoteData = useMemo(() => {
    // @ts-ignore
    const dataModule = quoteDataMap[locale] || quoteDataMap['pt'];
    return dataModule;
  }, [locale]);

  // 2. Calcula a fala de ontem
  const yesterdayQuote = useMemo(() => {
    if (!allQuoteData) return null;

    // "Achata" os dados para criar a lista de sorteio
    const allFlattenedQuotes = flattenQuoteData(allQuoteData);
    if (allFlattenedQuotes.length === 0) return null;

    // Pega a data formatada de ontem
    const yesterdayString = getYesterdayDateString();

    // Encontra a fala para aquela data
    const { quote } = getDailyQuote(yesterdayString, allFlattenedQuotes);
    return quote as SelectedQuote; // Faz o cast para o tipo correto
  }, [allQuoteData]); // Recalcula se o idioma (e os dados) mudarem

  // Estado de carregamento
  if (!yesterdayQuote) {
    return (
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-xl p-4 w-full max-w-md">
        <h4 className="text-sm font-bold text-center text-yellow-400 mb-3">
          {t('yesterday_quote_title')} 
        </h4>
        <div className="flex items-center justify-center h-20">
          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
        </div>
      </div>
    );
  }

  // Renderização da fala e personagem encontrados
  return (
    <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-xl p-4 w-full max-w-md animate-fadeInUp">
      <h4 className="text-sm font-bold text-center text-yellow-400 mb-4 uppercase tracking-wider">
        {t('yesterday_quote_title')}
      </h4>
      
      {/* A Fala */}
      <div className="mb-4 p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-200 italic text-center">
           &ldquo;{yesterdayQuote.quote.texts}&rdquo;
        </p>
      </div>

      {/* O Personagem (Resposta) */}
      <div className="flex items-center gap-4">
        <img
          src={yesterdayQuote.character.imgSrc}
          alt={yesterdayQuote.character.nome}
          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-600/50 shadow-lg"
          loading="lazy"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-white text-lg truncate">
            {yesterdayQuote.character.nome}
          </span>
          <span className="text-xs text-gray-400">
            {yesterdayQuote.character.titulo || yesterdayQuote.character.patente}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(YesterdayQuoteComponent);