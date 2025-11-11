// src/stores/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

type Attempt = {
  idKey: string;
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
  selectedCharacter: Character | null;
  attempts: Attempt[];
  won: boolean;
  gaveUp: boolean;
  currentGameDate: string | null;
  usedCharacterIndices: number[];
  
  setSelectedCharacter: (character: Character) => void;
  addAttempt: (attempt: Attempt) => void;
  setWon: (won: boolean) => void;
  setGaveUp: (gaveUp: boolean) => void;
  setCurrentGameDate: (date: string) => void;
  addUsedCharacterIndex: (index: number) => void;
  resetDailyGame: (character: Character, date: string) => void;
  clearState: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      selectedCharacter: null,
      attempts: [],
      won: false,
      gaveUp: false,
      currentGameDate: null,
      usedCharacterIndices: [],

      setSelectedCharacter: (character) => 
        set({ selectedCharacter: character }),

      addAttempt: (attempt) => 
        set((state) => ({ attempts: [attempt, ...state.attempts] })),

      setWon: (won) => 
        set({ won }),

      setGaveUp: (gaveUp) =>
        set({ gaveUp }),

      setCurrentGameDate: (date) =>
        set({ currentGameDate: date }),

      addUsedCharacterIndex: (index) =>
        set((state) => {
          return { 
            usedCharacterIndices: [...state.usedCharacterIndices, index] 
          };
        }),

      resetDailyGame: (character, date) =>
        set((state) => {
          const isSameDay = state.currentGameDate === date;
          const keepWonState = isSameDay && state.won;
          const keepGaveUpState = isSameDay && state.gaveUp;
          
          return {
            selectedCharacter: character,
            attempts: isSameDay ? state.attempts : [],
            won: keepWonState,
            gaveUp: keepGaveUpState,
            currentGameDate: date,
          };
        }),

      clearState: () =>
        set({
          attempts: [],
          won: false,
          gaveUp: false,
        }),
    }),
    {
      name: 'classic-game-daily-storage',
      partialize: (state) => ({
        selectedCharacter: state.selectedCharacter,
        attempts: state.attempts,
        won: state.won,
        gaveUp: state.gaveUp,
        currentGameDate: state.currentGameDate,
        usedCharacterIndices: state.usedCharacterIndices,
      }),
    }
  )
);