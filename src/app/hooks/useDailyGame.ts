// src/hooks/useDailyGame.ts
import { useEffect, useState } from "react";
import { useGameStore } from "../stores/useGameStore";
import { getCurrentDateInBrazil, getDailyCharacter } from "../utils/dailyGame";

type Character = {
  idKey: string; 
  nome: string;
  titulo?: string;
  idade: string;
  altura: string;
  genero: string;
  peso: string;
  signo: string;
  localDeTreinamento: string;
  patente: string;
  exercito: string;
  saga?: string;
  imgSrc: string;
  dica1?: string;
  dica2?: string;
};

export function useDailyGame(characters: Character[]) {
  const {
    selectedCharacter,
    currentGameDate,
    usedCharacterIndices,
    won,
    setSelectedCharacter,
    setCurrentGameDate,
    addUsedCharacterIndex,
    resetDailyGame,
  } = useGameStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const todayDate = getCurrentDateInBrazil();

    if (currentGameDate && currentGameDate !== todayDate) {
      const { character, index } = getDailyCharacter(
        todayDate,
        characters
      );

      resetDailyGame(character, todayDate);
      addUsedCharacterIndex(index); 
      setIsInitialized(true);
      return;
    }

    if (currentGameDate === todayDate && selectedCharacter) {
      setIsInitialized(true);
      return;
    }

    if (!currentGameDate || !selectedCharacter) {
      const { character, index } = getDailyCharacter(
        todayDate,
        characters
      );

      setSelectedCharacter(character);
      setCurrentGameDate(todayDate);

      if (!usedCharacterIndices.includes(index)) {
        addUsedCharacterIndex(index);
      }

      setIsInitialized(true);
    }
  }, [
    characters,
    currentGameDate,
    selectedCharacter,
    usedCharacterIndices,
    resetDailyGame,
    addUsedCharacterIndex,
    setSelectedCharacter,
    setCurrentGameDate,
  ]);

  return {
    isInitialized,
    selectedCharacter,
    won,
  };
}