// src/stores/useAttackGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SelectedAttack, CharacterBaseInfo } from '../i18n/types';

// MODIFICADO: 'Attempt' agora é um 'CharacterBaseInfo'
type Attempt = CharacterBaseInfo;

interface AttackGameState {
  selectedAttack: SelectedAttack | null;
  attempts: Attempt[]; // Esta lista agora conterá objetos CharacterBaseInfo
  won: boolean;
  gaveUp: boolean;
  currentGameDate: string | null;
  attemptBlurLevel: number; 
  grayscale: boolean;
  autoDecreaseActive: boolean; 
  
  setSelectedAttack: (attack: SelectedAttack) => void;
  addAttempt: (attempt: Attempt) => void; // A assinatura do método permanece a mesma
  setWon: (won: boolean) => void;
  setGaveUp: (gaveUp: boolean) => void;
  setCurrentGameDate: (date: string) => void;
  resetDailyGame: (attack: SelectedAttack, date: string) => void;
  setGrayscale: (grayscale: boolean) => void;
  toggleAutoDecrease: () => void; 
  clearState: () => void;
}

const INITIAL_BLUR_LEVEL = 8; 

export const useAttackGameStore = create<AttackGameState>()(
  persist(
    (set) => ({
      selectedAttack: null,
      attempts: [],
      won: false,
      gaveUp: false,
      currentGameDate: null,
      attemptBlurLevel: INITIAL_BLUR_LEVEL,
      grayscale: true,
      autoDecreaseActive: true, 

      setSelectedAttack: (attack) => 
        set({ selectedAttack: attack }),

      addAttempt: (attempt) => 
        set((state) => {
          const newBlur = Math.max(0, state.attemptBlurLevel - 0.25); 
            
          return { 
            attempts: [attempt, ...state.attempts], // Adiciona o objeto 'CharacterBaseInfo' à lista
            attemptBlurLevel: newBlur,
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
      
      toggleAutoDecrease: () =>
        set((state) => ({
            autoDecreaseActive: !state.autoDecreaseActive,
        })),

      resetDailyGame: (attack, date) =>
        set((state) => {
          const isSameDay = state.currentGameDate === date;
          const keepWonState = isSameDay && state.won;
          const keepGaveUpState = isSameDay && state.gaveUp;
          const keepBlur = isSameDay ? state.attemptBlurLevel : INITIAL_BLUR_LEVEL;
          const keepGrayscale = isSameDay ? state.grayscale : true;
          const keepAutoBlur = isSameDay ? state.autoDecreaseActive : true;

          return {
            selectedAttack: attack,
            attempts: isSameDay ? state.attempts : [], // Mantém as tentativas (CharacterBaseInfo)
            won: keepWonState,
            gaveUp: keepGaveUpState,
            currentGameDate: date,
            attemptBlurLevel: keepBlur,
            grayscale: keepGrayscale,
            autoDecreaseActive: keepAutoBlur, 
          };
        }),

      clearState: () =>
        set({
          attempts: [],
          won: false,
          gaveUp: false,
          attemptBlurLevel: INITIAL_BLUR_LEVEL,
          grayscale: true,
          autoDecreaseActive: true, 
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
        attemptBlurLevel: state.attemptBlurLevel, 
        grayscale: state.grayscale,
        autoDecreaseActive: state.autoDecreaseActive, 
      }),
    }
  )
);