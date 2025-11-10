// src/hooks/useDailyAttack.ts
import { useEffect, useState, useMemo } from 'react';
import { useAttackGameStore } from '../stores/useAttackGameStore';
import { getCurrentDateInBrazil, getDailyAttack } from '../utils/dailyGame';
import { useLocaleStore } from '../stores/useLocaleStore';
import { getAttackData } from '../i18n/config'; 

import { 
    SelectedAttack, 
    CharacterWithAttacks, 
    CharacterBaseInfo,
    Attack 
} from '../i18n/types';


const flattenAttackData = (dataModule: any): SelectedAttack[] => {
    const charactersWithAttacks = (dataModule as any).default as CharacterWithAttacks[] || [];
    const allAttacks: SelectedAttack[] = [];

    for (const character of charactersWithAttacks) {
        const characterInfo: CharacterBaseInfo = {
            idKey: character.idKey,
            nome: character.nome,
            patente: character.patente,
            imgSrc: character.imgSrc,
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

export function useDailyAttack() {
  const {
    selectedAttack,
    currentGameDate,
    won,
    resetDailyGame,
    setSelectedAttack,
    setCurrentGameDate,
  } = useAttackGameStore();

  const [isInitialized, setIsInitialized] = useState(false);

  const locale = useLocaleStore((state) => state.locale);

  const allAttacks = useMemo(() => {
    const dataModule = getAttackData(locale);
    
    return flattenAttackData(dataModule);
  }, [locale]); 

  useEffect(() => {
    if (allAttacks.length === 0) {
      console.warn("Nenhum ataque carregado, aguardando dados...");
      return;
    }

    const todayDate = getCurrentDateInBrazil();

    if (currentGameDate && currentGameDate !== todayDate) {
      const { attack } = getDailyAttack(todayDate, allAttacks);
      resetDailyGame(attack, todayDate);
      setIsInitialized(true);
      return;
    }

    if (currentGameDate === todayDate && selectedAttack) {
      setIsInitialized(true);
      return;
    }

    if (!currentGameDate || !selectedAttack) {
      const { attack } = getDailyAttack(todayDate, allAttacks);
      setSelectedAttack(attack);
      setCurrentGameDate(todayDate);
      setIsInitialized(true);
    }
    
  }, [
    allAttacks, 
    currentGameDate,
    selectedAttack,
    resetDailyGame,
    setSelectedAttack,
    setCurrentGameDate,
  ]);

  return {
    isInitialized, 
    selectedAttack, 
    won, 
  };
}