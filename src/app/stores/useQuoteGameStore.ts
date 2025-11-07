// src/stores/useQuoteGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Tipos de Dados (Definidos localmente por enquanto) ---
// (Mais tarde, podemos movê-los para src/i18n/types.ts)

// O personagem que o usuário palpita
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

// A fala individual
type Quote = {
  idQuote: string;
  texts: string;
  dica1: string;
  dica2: string;
};

// O objeto da fala do dia (Fala + Personagem correto)
type SelectedQuote = {
  quote: Quote;
  character: GuessedCharacter; // O personagem correto
};

// Uma tentativa é o próprio personagem que o usuário palpitou
type Attempt = GuessedCharacter;

// --- Interface do Estado (Zustand) ---

interface QuoteGameState {
  selectedQuote: SelectedQuote | null;
  attempts: Attempt[];
  won: boolean;
  gaveUp: boolean;
  currentGameDate: string | null;

  // Ações
  setSelectedQuote: (quote: SelectedQuote) => void;
  addAttempt: (attempt: Attempt) => void;
  setWon: (won: boolean) => void;
  setGaveUp: (gaveUp: boolean) => void;
  setCurrentGameDate: (date: string) => void;
  resetDailyGame: (quote: SelectedQuote, date: string) => void;
  clearState: () => void;
}

// --- Criação do Store ---

export const useQuoteGameStore = create<QuoteGameState>()(
  persist(
    (set) => ({
      // Estado Inicial
      selectedQuote: null,
      attempts: [],
      won: false,
      gaveUp: false,
      currentGameDate: null,

      // --- Ações ---

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

      /**
       * Reseta o jogo para um novo dia ou recarrega o estado atual.
       * Idêntico ao 'useGameStore', mas para as falas.
       */
      resetDailyGame: (quote, date) =>
        set((state) => {
          const isSameDay = state.currentGameDate === date;
          // Se for o mesmo dia, mantém o progresso (tentativas, vitória, desistência)
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
      // Nome da chave no localStorage (DIFERENTE do Modo Clássico)
      name: 'quote-game-daily-storage',

      // Define quais partes do estado devem ser salvas
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