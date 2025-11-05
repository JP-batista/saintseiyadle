// src/hooks/useDailyGame.ts
import { useEffect, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { getCurrentDateInBrazil, getDailyCharacter } from '../utils/dailyGame';

type Character = {
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

/**
 * Hook personalizado para gerenciar o jogo diário
 * Garante que o personagem do dia seja inicializado corretamente
 * e que o estado de vitória persista ao recarregar a página
 */
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
    // OTIMIZAÇÃO 1: Removida a verificação 'typeof window' (desnecessária)

    const todayDate = getCurrentDateInBrazil();

    // Cenário 1: Dia mudou - novo jogo
    if (currentGameDate && currentGameDate !== todayDate) {
      const { character, index } = getDailyCharacter(
        todayDate,
        characters,
        usedCharacterIndices
      );
      
      resetDailyGame(character, todayDate);
      addUsedCharacterIndex(index);
      setIsInitialized(true);
      return;
    }

    // Cenário 2: Mesmo dia, personagem já existe - mantém estado (incluindo vitória)
    if (currentGameDate === todayDate && selectedCharacter) {
      setIsInitialized(true);
      return;
    }

    // Cenário 3: Primeira visita ou estado inválido - inicializa
    if (!currentGameDate || !selectedCharacter) {
      const { character, index } = getDailyCharacter(
        todayDate,
        characters,
        usedCharacterIndices
      );
      
      setSelectedCharacter(character);
      setCurrentGameDate(todayDate);
      
      // Só adiciona o índice se não estiver na lista
      if (!usedCharacterIndices.includes(index)) {
        addUsedCharacterIndex(index);
      }
      
      setIsInitialized(true);
    }
  // OTIMIZAÇÃO 2: Array de dependências limpo
  // Removidos 'won' (não usado) e os setters do Zustand (são estáveis)
  }, [
    characters,
    currentGameDate,
    selectedCharacter,
    usedCharacterIndices,
    // As funções setter foram removidas daqui
  ]);

  return {
    isInitialized,
    selectedCharacter,
    won,
  };
}