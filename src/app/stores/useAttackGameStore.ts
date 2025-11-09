// src/stores/useAttackGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SelectedAttack } from '../i18n/types';

// Uma tentativa é o nome do ataque que o usuário palpitou
type Attempt = {
  attackName: string; // O palpite (string)
};

// --- Interface do Estado (Zustand) ---

interface AttackGameState {
  selectedAttack: SelectedAttack | null;
  attempts: Attempt[];
  won: boolean;
  gaveUp: boolean;
  currentGameDate: string | null;
  
  // ATUALIZADO: Este é o blur alcançado pelas tentativas (ex: 8 -> 7 -> 6)
  attemptBlurLevel: number; 
  grayscale: boolean;
  
  // ATUALIZADO: Este é o estado do toggle (LIGADO/DESLIGADO)
  autoDecreaseActive: boolean; 
  
  // Ações
  setSelectedAttack: (attack: SelectedAttack) => void;
  addAttempt: (attempt: Attempt) => void;
  setWon: (won: boolean) => void;
  setGaveUp: (gaveUp: boolean) => void;
  setCurrentGameDate: (date: string) => void;
  resetDailyGame: (attack: SelectedAttack, date: string) => void;
  
  // Ações específicas do Modo Ataque
  setGrayscale: (grayscale: boolean) => void;
  // ATUALIZADO: Renomeado para refletir a ação no toggle
  toggleAutoDecrease: () => void; 
  clearState: () => void;
}

// --- Configurações Iniciais ---
const INITIAL_BLUR_LEVEL = 8; // Blur inicial padrão (máxima dificuldade)

// --- Criação do Store ---

export const useAttackGameStore = create<AttackGameState>()(
  persist(
    (set) => ({
      // Estado Inicial
      selectedAttack: null,
      attempts: [],
      won: false,
      gaveUp: false,
      currentGameDate: null,
      
      // Estado Inicial dos Filtros
      attemptBlurLevel: INITIAL_BLUR_LEVEL, // Nível de blur das tentativas
      grayscale: true,
      autoDecreaseActive: true, // O toggle "Auto-Desfoque" começa LIGADO (Laranja)

      // --- Ações ---

      setSelectedAttack: (attack) => 
        set({ selectedAttack: attack }),

      addAttempt: (attempt) => 
        set((state) => {
          // ATUALIZADO: O store SEMPRE calcula o blur das tentativas.
          // O Display decide se deve usá-lo ou o blur inicial.
          const newBlur = Math.max(0, state.attemptBlurLevel - 0.25); 
            
          return { 
            attempts: [attempt, ...state.attempts],
            attemptBlurLevel: newBlur, // Salva o novo blur das tentativas
          }
        }),

      setWon: (won) => 
        set({ won }),

      setGaveUp: (gaveUp) =>
        set({ gaveUp }),

      setCurrentGameDate: (date) =>
        set({ currentGameDate: date }),
      
      setGrayscale: (grayscale) =>
        set({ grayscale }),
      
      // ATUALIZADO: Ação para o toggle
      toggleAutoDecrease: () =>
        set((state) => ({
            autoDecreaseActive: !state.autoDecreaseActive,
        })),
        
      /**
       * Reseta o jogo para um novo dia ou recarrega o estado atual.
       */
      resetDailyGame: (attack, date) =>
        set((state) => {
          const isSameDay = state.currentGameDate === date;
          const keepWonState = isSameDay && state.won;
          const keepGaveUpState = isSameDay && state.gaveUp;
          
          // Reseta os filtros apenas se for um novo dia
          const keepBlur = isSameDay ? state.attemptBlurLevel : INITIAL_BLUR_LEVEL;
          const keepGrayscale = isSameDay ? state.grayscale : true;
          const keepAutoBlur = isSameDay ? state.autoDecreaseActive : true;

          return {
            selectedAttack: attack,
            attempts: isSameDay ? state.attempts : [],
            won: keepWonState,
            gaveUp: keepGaveUpState,
            currentGameDate: date,
            attemptBlurLevel: keepBlur,
            grayscale: keepGrayscale,
            autoDecreaseActive: keepAutoBlur, // Reseta o toggle
          };
        }),

      clearState: () =>
        set({
          attempts: [],
          won: false,
          gaveUp: false,
          attemptBlurLevel: INITIAL_BLUR_LEVEL,
          grayscale: true,
          autoDecreaseActive: true, // Reseta o toggle
        }),
    }),
    {
      name: 'attack-game-daily-storage',

      partialize: (state) => ({
        selectedAttack: state.selectedAttack,
        attempts: state.attempts,
        won: state.won,
        gaveUp: state.gaveUp,
        currentGameDate: state.currentGameDate,
        attemptBlurLevel: state.attemptBlurLevel, // Salva o blur das tentativas
        grayscale: state.grayscale,
        autoDecreaseActive: state.autoDecreaseActive, // Salva o estado do toggle
      }),
    }
  )
);