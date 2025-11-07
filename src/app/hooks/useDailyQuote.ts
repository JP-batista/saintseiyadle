// src/hooks/useDailyQuote.ts
import { useEffect, useState, useMemo } from 'react';
import { useQuoteGameStore } from '../stores/useQuoteGameStore';
import { getCurrentDateInBrazil, getDailyQuote } from '../utils/dailyGame';
import { useLocaleStore } from '../stores/useLocaleStore';
// NOTA: 'quoteDataMap' ainda precisa ser adicionado ao config.ts
import { quoteDataMap } from '../i18n/config'; 
// NOTA: Estes tipos devem ser movidos para types.ts posteriormente
import { CharacterWithQuotes, SelectedQuote } from '../i18n/types';

/**
 * "Achata" (flattens) a estrutura de dados das falas.
 * Transforma: Character[] (com Quotes[] aninhado)
 * Para: SelectedQuote[] (um array plano de falas individuais)
 * * Isso é essencial para que o sorteio diário escolha UMA FALA, e não apenas um personagem.
 */
const flattenQuoteData = (dataModule: any): SelectedQuote[] => {
    // dataModule.default é o array 'quotes' de 'quotesDLE_pt.ts'
    const charactersWithQuotes = (dataModule as any).default as CharacterWithQuotes[] || [];
    const allQuotes: SelectedQuote[] = [];

    for (const character of charactersWithQuotes) {
        // Prepara o objeto 'character' (o personagem-pai)
        // Incluímos apenas os dados necessários para o ResultCard e a lógica
        const characterInfo = {
            idKey: character.idKey,
            nome: character.nome,
            imgSrc: character.imgSrc,
            patente: character.patente,
            titulo: character.titulo,
        };

        // Adiciona cada fala individual, combinada com os dados do personagem
        for (const quote of character.quotes) {
            allQuotes.push({
                // A fala sorteada
                quote: {
                    idQuote: quote.idQuote,
                    texts: quote.texts,
                    dica1: quote.dica1,
                    dica2: quote.dica2,
                },
                // O personagem correto (a resposta)
                character: characterInfo,
                patente: character.patente,
                titulo: character.titulo,
            });
        }
    }
    return allQuotes;
};

/**
 * Hook personalizado para gerenciar o jogo diário do Modo Fala.
 * Garante que a fala do dia seja inicializada corretamente
 * e que o estado de vitória persista ao recarregar a página.
 */
export function useDailyQuote() {
  // 1. Obter estado do store específico do Modo Fala
  const {
    selectedQuote,
    currentGameDate,
    won,
    resetDailyGame,
    setSelectedQuote,
    setCurrentGameDate,
  } = useQuoteGameStore();

  // 2. Estado de inicialização local
  const [isInitialized, setIsInitialized] = useState(false);

  // 3. Obter o locale atual
  const locale = useLocaleStore((state) => state.locale);

  // 4. Carregar e "achatar" os dados de falas (baseado no locale)
  const allQuotes = useMemo(() => {
    // Pega o módulo de dados (ex: 'quotesDLE_pt') para o locale atual
    // @ts-ignore - 'quoteDataMap' será adicionado ao config.ts em breve
    const dataModule = quoteDataMap[locale] || quoteDataMap['pt']; // Fallback para 'pt'
    
    // "Achata" os dados para criar a lista de sorteio
    return flattenQuoteData(dataModule);
  }, [locale]); // Recalcula apenas se o idioma mudar

  // 5. Lógica de inicialização do jogo diário
  useEffect(() => {
    // Se não houver falas carregadas (ex: erro de dados), não faz nada
    if (allQuotes.length === 0) {
      console.warn("Nenhuma fala carregada, aguardando dados...");
      return;
    }

    const todayDate = getCurrentDateInBrazil();

    // Cenário 1: Dia mudou - novo jogo
    // O usuário abriu o jogo, mas a data salva é de ontem.
    if (currentGameDate && currentGameDate !== todayDate) {
      // Sorteia a nova fala do dia
      // @ts-ignore - 'getDailyQuote' será adicionado ao dailyGame.ts em breve
      const { quote } = getDailyQuote(todayDate, allQuotes);
      // Reseta o store com a nova fala (caso os tipos do i18n difiram dos tipos esperados pelo store)
      resetDailyGame(quote as any, todayDate);
      setIsInitialized(true);
      return;
    }

    // Cenário 2: Mesmo dia, fala já existe - mantém estado (incluindo vitória)
    // O usuário recarregou a página no mesmo dia.
    if (currentGameDate === todayDate && selectedQuote) {
      setIsInitialized(true);
      return;
    }

    // Cenário 3: Primeira visita ou estado inválido - inicializa
    // O usuário nunca jogou antes ou limpou o cache.
    if (!currentGameDate || !selectedQuote) {
      // Sorteia a fala do dia
      // @ts-ignore - 'getDailyQuote' será adicionado ao dailyGame.ts em breve
      const { quote } = getDailyQuote(todayDate, allQuotes);
      // Define a fala e a data no store (cast para contornar diferenças entre tipos i18n e store)
      setSelectedQuote(quote as any);
      setCurrentGameDate(todayDate);
      setIsInitialized(true);
    }
    
  }, [
    allQuotes, // Depende dos dados carregados e achatados
    currentGameDate,
    selectedQuote,
    resetDailyGame,
    setSelectedQuote,
    setCurrentGameDate,
  ]);

  // 6. Retorna o estado para a página
  return {
    isInitialized, // Informa à UI quando pode parar de mostrar "Carregando..."
    selectedQuote, // O objeto da fala do dia (inclui a resposta)
    won, // O estado de vitória
  };
}