// src/stores/useSilhouetteGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SelectedArmor, Attempt } from '../../app/silhouette/types'; 

interface SilhouetteGameState {
  selectedArmor: SelectedArmor | null;
  attempts: Attempt[];
  won: boolean;
  gaveUp: boolean;
  currentGameDate: string | null;
  attemptZoomLevel: number; 
  autoDecreaseActive: boolean; 
  
  setSelectedArmor: (armor: SelectedArmor) => void;
  addAttempt: (attempt: Attempt) => void;
  setWon: (won: boolean) => void;
  setGaveUp: (gaveUp: boolean) => void;
  setCurrentGameDate: (date: string) => void;
  resetDailyGame: (armor: SelectedArmor, date: string) => void;
  toggleAutoDecrease: () => void; 
  clearState: () => void;
}

const MAX_ZOOM_LEVEL = 3;   
const MIN_ZOOM_LEVEL = 1;   
const MAX_ATTEMPTS_FOR_ZOOM = 20; 

const ZOOM_DECREMENT = (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / MAX_ATTEMPTS_FOR_ZOOM;

export const useSilhouetteGameStore = create<SilhouetteGameState>()(
  persist(
    (set) => ({
      selectedArmor: null,
      attempts: [],
      won: false,
      gaveUp: false,
      currentGameDate: null,
      attemptZoomLevel: MAX_ZOOM_LEVEL, 
      autoDecreaseActive: true, 

      setSelectedArmor: (armor) => 
        set({ selectedArmor: armor }),

      addAttempt: (attempt) => 
        set((state) => {
          const newZoom = Math.max(
            MIN_ZOOM_LEVEL, 
            state.attemptZoomLevel - ZOOM_DECREMENT
          ); 
            
          return { 
            attempts: [attempt, ...state.attempts],
            attemptZoomLevel: newZoom, 
          }
        }),

      setWon: (won) => 
        set({ won }),

      setGaveUp: (gaveUp) =>
        set({ gaveUp }),

      setCurrentGameDate: (date) =>
        set({ currentGameDate: date }),
      
      toggleAutoDecrease: () =>
        set((state) => ({
            autoDecreaseActive: !state.autoDecreaseActive,
        })),

      resetDailyGame: (armor, date) =>
        set((state) => {
          const isSameDay = state.currentGameDate === date;
          const keepWonState = isSameDay && state.won;
          const keepGaveUpState = isSameDay && state.gaveUp;
          
          const keepZoom = isSameDay ? state.attemptZoomLevel : MAX_ZOOM_LEVEL;
          const keepAutoZoom = isSameDay ? state.autoDecreaseActive : true;

          return {
            selectedArmor: armor,
            attempts: isSameDay ? state.attempts : [],
            won: keepWonState,
            gaveUp: keepGaveUpState,
            currentGameDate: date,
            attemptZoomLevel: keepZoom,
            autoDecreaseActive: keepAutoZoom, 
          };
        }),

      clearState: () =>
        set({
          attempts: [],
          won: false,
          gaveUp: false,
          attemptZoomLevel: MAX_ZOOM_LEVEL,
          autoDecreaseActive: true, 
        }),
    }),
    {
      name: 'silhouette-game-daily-storage', 

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