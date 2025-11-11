// src/stores/useStatsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GameHistory = {
  date: string; 
  attempts: number;
  won: boolean;
  firstTry: boolean;
  characterName: string;
  characterImage: string;
  characteridKey: string;
};

interface StatsState {
  gamesHistory: GameHistory[];
  totalWins: number;
  averageAttempts: number;
  firstTryWins: number;
  currentStreak: number;
  maxStreak: number;
  addGameResult: (
    date: string, 
    attempts: number, 
    won: boolean,
    characterName: string,
    characterImage: string,
    characteridKey: string
  ) => void;
  calculateStats: () => void;
  getGameByDate: (date: string) => GameHistory | undefined;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      gamesHistory: [],
      totalWins: 0,
      averageAttempts: 0,
      firstTryWins: 0,
      currentStreak: 0,
      maxStreak: 0,

      addGameResult: (date, attempts, won, characterName, characterImage, characteridKey) => {
        set((state) => {
          const newGame: GameHistory = {
            date,
            attempts,
            won,
            firstTry: attempts === 1 && won,
            characterName,
            characterImage,
            characteridKey,
          };
          
          const newHistory = [
            newGame,
            ...state.gamesHistory.filter(g => g.date !== date)
          ];

          return { gamesHistory: newHistory };
        });

        get().calculateStats();
      },

      calculateStats: () => {
        set((state) => {
          const history = state.gamesHistory;
          
          if (history.length === 0) {
            return {
              totalWins: 0,
              averageAttempts: 0,
              firstTryWins: 0,
              currentStreak: 0,
              maxStreak: 0,
            };
          }

          const completedGames = history.filter(g => g.won);
          const totalWins = completedGames.length;

          const averageAttempts = completedGames.length > 0
            ? Number((completedGames.reduce((sum, g) => sum + g.attempts, 0) / completedGames.length).toFixed(1))
            : 0;

          const firstTryWins = history.filter(g => g.firstTry).length;

          const sortedHistory = [...history].sort((a, b) => a.date.localeCompare(b.date));
          
          let currentStreak = 0;
          let maxStreak = 0;
          let tempStreak = 0;
          let lastDate: Date | null = null;

          for (const game of sortedHistory) {
            const gameDate = new Date(game.date + 'T00:00:00');
            
            if (game.won) {
              if (lastDate) {
                const dayDiff = Math.floor((gameDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                
                if (dayDiff === 1) {
                  tempStreak++;
                } else if (dayDiff > 1) {
                  tempStreak = 1;
                }
              } else {
                tempStreak = 1; 
              }
              
              maxStreak = Math.max(maxStreak, tempStreak);
              lastDate = gameDate;
            } else {
              tempStreak = 0; 
            }
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (lastDate) {
            const daysSinceLastWin = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            currentStreak = daysSinceLastWin <= 1 ? tempStreak : 0;
          } else {
            currentStreak = 0;
          }

          return {
            totalWins,
            averageAttempts,
            firstTryWins,
            currentStreak,
            maxStreak,
          };
        });
      },

      getGameByDate: (date) => {
        return get().gamesHistory.find(g => g.date === date);
      },
    }),
    {
      name: 'classic-game-stats-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.calculateStats();
        }
      },
    }
  )
);