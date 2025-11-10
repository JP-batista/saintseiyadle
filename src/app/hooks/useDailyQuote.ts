// src/hooks/useDailyQuote.ts
import { useEffect, useState, useMemo } from 'react';
import { useQuoteGameStore } from '../stores/useQuoteGameStore';
import { getCurrentDateInBrazil, getDailyQuote } from '../utils/dailyGame';
import { useLocaleStore } from '../stores/useLocaleStore';
import { quoteDataMap } from '../i18n/config'; 
import { CharacterWithQuotes, SelectedQuote } from '../i18n/types';

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

export function useDailyQuote() {
  const {
    selectedQuote,
    currentGameDate,
    won,
    resetDailyGame,
    setSelectedQuote,
    setCurrentGameDate,
  } = useQuoteGameStore();

  const [isInitialized, setIsInitialized] = useState(false);

  const locale = useLocaleStore((state) => state.locale);

  const allQuotes = useMemo(() => {
    const dataModule = quoteDataMap[locale] || quoteDataMap['pt']; 
    
    return flattenQuoteData(dataModule);
  }, [locale]); 

  useEffect(() => {
    if (allQuotes.length === 0) {
      console.warn("Nenhuma fala carregada, aguardando dados...");
      return;
    }

    const todayDate = getCurrentDateInBrazil();

    if (currentGameDate && currentGameDate !== todayDate) {
      const { quote } = getDailyQuote(todayDate, allQuotes);
      resetDailyGame(quote as any, todayDate);
      setIsInitialized(true);
      return;
    }

    if (currentGameDate === todayDate && selectedQuote) {
      setIsInitialized(true);
      return;
    }

    if (!currentGameDate || !selectedQuote) {
      const { quote } = getDailyQuote(todayDate, allQuotes);
      setSelectedQuote(quote as any);
      setCurrentGameDate(todayDate);
      setIsInitialized(true);
    }
    
  }, [
    allQuotes, 
    currentGameDate,
    selectedQuote,
    resetDailyGame,
    setSelectedQuote,
    setCurrentGameDate,
  ]);
  return {
    isInitialized,
    selectedQuote, 
    won,
  };
}