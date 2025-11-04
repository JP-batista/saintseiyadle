// src/stores/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

type Attempt = {
  nome: string;
  idade: string;
  altura: string;
  peso: string;
  genero: string;
  signo: string;
  localDeTreinamento: string;
  patente: string;
  exercito: string;
  saga: string;
  imgSrc: string;
  guessCharacter: Character;
};

interface GameState {
  // Estado
  selectedCharacter: Character | null;
  attempts: Attempt[];
  won: boolean;
  usedCharacters: string[];
  
  // Ações
  setSelectedCharacter: (character: Character) => void;
  addAttempt: (attempt: Attempt) => void;
  setWon: (won: boolean) => void;
  addUsedCharacter: (characterName: string) => void;
  resetGame: (newCharacter: Character) => void;
  clearState: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // Estado inicial
      selectedCharacter: null,
      attempts: [],
      won: false,
      usedCharacters: [],

      // Ações
      setSelectedCharacter: (character) => 
        set({ selectedCharacter: character }),

      addAttempt: (attempt) => 
        set((state) => ({ attempts: [attempt, ...state.attempts] })),

      setWon: (won) => 
        set({ won }),

      addUsedCharacter: (characterName) =>
        set((state) => ({ 
          usedCharacters: [...state.usedCharacters, characterName] 
        })),

      resetGame: (newCharacter) =>
        set((state) => ({
          selectedCharacter: newCharacter,
          attempts: [],
          won: false,
          usedCharacters: [...state.usedCharacters, newCharacter.nome],
        })),

      clearState: () =>
        set({
          selectedCharacter: null,
          attempts: [],
          won: false,
        }),
    }),
    {
      name: 'classic-game-storage',
      partialize: (state) => ({
        selectedCharacter: state.selectedCharacter,
        attempts: state.attempts,
        won: state.won,
        usedCharacters: state.usedCharacters,
      }),
    }
  )
);