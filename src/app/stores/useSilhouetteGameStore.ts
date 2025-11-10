// src/stores/useSilhouetteGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SelectedArmor, Attempt } from '../../app/silhouette/types'; 

// --- Interface do Estado (Zustand) ---

interface SilhouetteGameState {
  selectedArmor: SelectedArmor | null;
  attempts: Attempt[];
  won: boolean;
  gaveUp: boolean;
  currentGameDate: string | null;
  
  // Nível de zoom alcançado pelas tentativas (Ex: 3.0 -> 2.8 -> 2.6)
  attemptZoomLevel: number; 
  
  // Estado do toggle (LIGADO/DESLIGADO)
  autoDecreaseActive: boolean; 
  
  // Ações
  setSelectedArmor: (armor: SelectedArmor) => void;
  addAttempt: (attempt: Attempt) => void;
  setWon: (won: boolean) => void;
  setGaveUp: (gaveUp: boolean) => void;
  setCurrentGameDate: (date: string) => void;
  resetDailyGame: (armor: SelectedArmor, date: string) => void;
  
  toggleAutoDecrease: () => void; 
  clearState: () => void;
}

// --- Configurações Iniciais (Baseado no seu código antigo) ---
const MAX_ZOOM_LEVEL = 3;   // Zoom inicial (equivale a 300%)
const MIN_ZOOM_LEVEL = 1;   // Zoom final (equivale a 100%)
const MAX_ATTEMPTS_FOR_ZOOM = 20; // Número de tentativas para ir do max ao min

// Calcula o quanto o zoom diminui a cada tentativa
const ZOOM_DECREMENT = (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / MAX_ATTEMPTS_FOR_ZOOM;

// --- Criação do Store ---

export const useSilhouetteGameStore = create<SilhouetteGameState>()(
  persist(
    (set) => ({
      // Estado Inicial
      selectedArmor: null,
      attempts: [],
      won: false,
      gaveUp: false,
      currentGameDate: null,
      
      // Estado Inicial dos Filtros
      attemptZoomLevel: MAX_ZOOM_LEVEL, // Começa com zoom máximo
      autoDecreaseActive: true, // O toggle "Auto-Zoom" começa LIGADO

      // --- Ações ---

      setSelectedArmor: (armor) => 
        set({ selectedArmor: armor }),

      addAttempt: (attempt) => 
        set((state) => {
          // LÓGICA DE ZOOM ADAPTADA DO SEU CÓDIGO ANTIGO:
          // Calcula o novo zoom diminuindo o decremento, 
          // garantindo que nunca seja menor que o zoom mínimo (1).
          const newZoom = Math.max(
            MIN_ZOOM_LEVEL, 
            state.attemptZoomLevel - ZOOM_DECREMENT
          ); 
            
          return { 
            attempts: [attempt, ...state.attempts],
            attemptZoomLevel: newZoom, // Salva o novo zoom
          }
        }),

      setWon: (won) => 
        set({ won }),

      setGaveUp: (gaveUp) =>
        set({ gaveUp }),

      setCurrentGameDate: (date) =>
        set({ currentGameDate: date }),
      
      // Ação para o toggle de auto-zoom
      toggleAutoDecrease: () =>
        set((state) => ({
            autoDecreaseActive: !state.autoDecreaseActive,
        })),
        
      /**
       * Reseta o jogo para um novo dia ou recarrega o estado atual.
       */
      resetDailyGame: (armor, date) =>
        set((state) => {
          const isSameDay = state.currentGameDate === date;
          const keepWonState = isSameDay && state.won;
          const keepGaveUpState = isSameDay && state.gaveUp;
          
          // Reseta os filtros apenas se for um novo dia
          const keepZoom = isSameDay ? state.attemptZoomLevel : MAX_ZOOM_LEVEL;
          const keepAutoZoom = isSameDay ? state.autoDecreaseActive : true;

          return {
            selectedArmor: armor,
            attempts: isSameDay ? state.attempts : [],
            won: keepWonState,
            gaveUp: keepGaveUpState,
            currentGameDate: date,
            attemptZoomLevel: keepZoom,
            autoDecreaseActive: keepAutoZoom, // Reseta o toggle
          };
        }),

      clearState: () =>
        set({
          attempts: [],
          won: false,
          gaveUp: false,
          attemptZoomLevel: MAX_ZOOM_LEVEL,
          autoDecreaseActive: true, // Reseta o toggle
        }),
    }),
    {
      name: 'silhouette-game-daily-storage', // Chave de persistência

      partialize: (state) => ({
        selectedArmor: state.selectedArmor,
        attempts: state.attempts,
        won: state.won,
        gaveUp: state.gaveUp,
        currentGameDate: state.currentGameDate,
        attemptZoomLevel: state.attemptZoomLevel,
        autoDecreaseActive: state.autoDecreaseActive,
      }),
    }
  )
);