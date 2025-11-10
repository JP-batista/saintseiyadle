// src/hooks/useDailySilhouette.ts
import { useEffect, useState, useMemo } from 'react';
import { useSilhouetteGameStore } from '../stores/useSilhouetteGameStore';
import { getCurrentDateInBrazil, getDailyArmor } from '../utils/dailyGame';
import { useLocaleStore } from '../stores/useLocaleStore';
import { getArmorData } from '../i18n/config'; 
import { Armor, SelectedArmor } from '../../app/silhouette/types';

/**
 * Hook personalizado para gerenciar o jogo diário do Modo Silhueta.
 * Garante que a armadura do dia seja inicializada corretamente
 * e que o estado de vitória/zoom persista ao recarregar a página.
 */
export function useDailySilhouette() {
  // 1. Obter estado do store específico do Modo Silhueta
  const {
    selectedArmor,
    currentGameDate,
    won,
    resetDailyGame,
    setSelectedArmor,
    setCurrentGameDate,
  } = useSilhouetteGameStore();

  // 2. Estado de inicialização local
  const [isInitialized, setIsInitialized] = useState(false);

  // 3. Obter o locale atual
  const locale = useLocaleStore((state) => state.locale);

  // 4. Carregar os dados das armaduras (baseado no locale)
  const allArmors = useMemo(() => {
    // Pega o módulo de dados (ex: 'armorsDLE_pt') para o locale atual
    // @ts-ignore - Assumindo que 'getArmorData' será adicionado ao config.ts
    const dataModule = getArmorData(locale);
    
    // Os dados já são um array plano, não precisa "achatar"
    return (dataModule as any).default as Armor[] || [];
  }, [locale]); // Recalcula apenas se o idioma mudar

  // 5. Lógica de inicialização do jogo diário
  useEffect(() => {
    // Se não houver armaduras carregadas, não faz nada
    if (allArmors.length === 0) {
      console.warn("Nenhuma armadura carregada, aguardando dados...");
      return;
    }

    const todayDate = getCurrentDateInBrazil();

    // Cenário 1: Dia mudou - novo jogo
    if (currentGameDate && currentGameDate !== todayDate) {
      // Sorteia a nova armadura do dia
      // @ts-ignore - Assumindo que 'getDailyArmor' será adicionado ao dailyGame.ts
      const { armor } = getDailyArmor(todayDate, allArmors);
      // Reseta o store com a nova armadura e reseta o zoom/toggle
      resetDailyGame(armor as SelectedArmor, todayDate);
      setIsInitialized(true);
      return;
    }

    // Cenário 2: Mesmo dia, armadura já existe - mantém estado (incluindo zoom e vitória)
    if (currentGameDate === todayDate && selectedArmor) {
      setIsInitialized(true);
      return;
    }

    // Cenário 3: Primeira visita ou estado inválido - inicializa
    if (!currentGameDate || !selectedArmor) {
      // Sorteia a armadura do dia
      // @ts-ignore - Assumindo que 'getDailyArmor' será adicionado ao dailyGame.ts
      const { armor } = getDailyArmor(todayDate, allArmors);
      // Define a armadura e a data no store
      setSelectedArmor(armor as SelectedArmor);
      setCurrentGameDate(todayDate);
      setIsInitialized(true);
    }
    
  }, [
    allArmors, // Depende dos dados carregados
    currentGameDate,
    selectedArmor,
    resetDailyGame,
    setSelectedArmor,
    setCurrentGameDate,
  ]);

  // 6. Retorna o estado para a página
  return {
    isInitialized, // Informa à UI quando pode parar de mostrar "Carregando..."
    selectedArmor, // O objeto da armadura do dia (inclui a resposta)
    won, // O estado de vitória
  };
}