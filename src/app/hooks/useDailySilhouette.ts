// src/hooks/useDailySilhouette.ts
import { useEffect, useState, useMemo } from 'react';
import { useSilhouetteGameStore } from '../stores/useSilhouetteGameStore';
import { getCurrentDateInBrazil, getDailyArmor } from '../utils/dailyGame';
import { useLocaleStore } from '../stores/useLocaleStore';
import { getArmorData } from '../i18n/config'; 
import { Armor, SelectedArmor } from '../../app/silhouette/types';

export function useDailySilhouette() {
  const {
    selectedArmor,
    currentGameDate,
    won,
    resetDailyGame,
    setSelectedArmor,
    setCurrentGameDate,
  } = useSilhouetteGameStore();

  const [isInitialized, setIsInitialized] = useState(false);

  const locale = useLocaleStore((state) => state.locale);

  const allArmors = useMemo(() => {
    const dataModule = getArmorData(locale);

    return (dataModule as any).default as Armor[] || [];
  }, [locale]); 

  useEffect(() => {
    if (allArmors.length === 0) {
      console.warn("Nenhuma armadura carregada, aguardando dados...");
      return;
    }

    const todayDate = getCurrentDateInBrazil();

    if (currentGameDate && currentGameDate !== todayDate) {
      const { armor } = getDailyArmor(todayDate, allArmors);
      resetDailyGame(armor as SelectedArmor, todayDate);
      setIsInitialized(true);
      return;
    }

    if (currentGameDate === todayDate && selectedArmor) {
      setIsInitialized(true);
      return;
    }
    if (!currentGameDate || !selectedArmor) {
      const { armor } = getDailyArmor(todayDate, allArmors);
      setSelectedArmor(armor as SelectedArmor);
      setCurrentGameDate(todayDate);
      setIsInitialized(true);
    }
    
  }, [
    allArmors, 
    currentGameDate,
    selectedArmor,
    resetDailyGame,
    setSelectedArmor,
    setCurrentGameDate,
  ]);

  return {
    isInitialized, 
    selectedArmor, 
    won, 
  };
}