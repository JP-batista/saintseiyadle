// src/stores/useQuoteGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GuessedCharacter = {
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
};

type Quote = {
  idQuote: string;
  texts: string;
  dica1: string;
  dica2: string;
};

type SelectedQuote = {
  quote: Quote;
  character: GuessedCharacter; 
};

type Attempt = GuessedCharacter;

interface QuoteGameState {
  selectedQuote: SelectedQuote | null;
  attempts: Attempt[];
  won: boolean;
  gaveUp: boolean;
  currentGameDate: string | null;

  setSelectedQuote: (quote: SelectedQuote) => void;
  addAttempt: (attempt: Attempt) => void;
  setWon: (won: boolean) => void;
  setGaveUp: (gaveUp: boolean) => void;
  setCurrentGameDate: (date: string) => void;
  resetDailyGame: (quote: SelectedQuote, date: string) => void;
  clearState: () => void;
}

export const useQuoteGameStore = create<QuoteGameState>()(
  persist(
    (set) => ({
      selectedQuote: null,
      attempts: [],
      won: false,
      gaveUp: false,
      currentGameDate: null,

      setSelectedQuote: (quote) => 
        set({ selectedQuote: quote }),

      addAttempt: (attempt) => 
        set((state) => ({ attempts: [attempt, ...state.attempts] })),

      setWon: (won) => 
        set({ won }),

      setGaveUp: (gaveUp) =>
        set({ gaveUp }),

      setCurrentGameDate: (date) =>
        set({ currentGameDate: date }),

      resetDailyGame: (quote, date) =>
        set((state) => {
          const isSameDay = state.currentGameDate === date;
          const keepWonState = isSameDay && state.won;
          const keepGaveUpState = isSameDay && state.gaveUp;
          
          return {
            selectedQuote: quote,
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
      name: 'quote-game-daily-storage',

      partialize: (state) => ({
        selectedQuote: state.selectedQuote,
        attempts: state.attempts,
        won: state.won,
        gaveUp: state.gaveUp,
        currentGameDate: state.currentGameDate,
      }),
    }
  )
);