// src/stores/useStatsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GameHistory = {
  date: string; // YYYY-MM-DD
  attempts: number;
  won: boolean;
  firstTry: boolean;
};

interface StatsState {
  gamesHistory: GameHistory[];
  
  // Estatísticas calculadas
  totalWins: number;
  averageAttempts: number;
  firstTryWins: number;
  currentStreak: number;
  maxStreak: number;
  
  // Ações
  addGameResult: (date: string, attempts: number, won: boolean) => void;
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

      addGameResult: (date: string, attempts: number, won: boolean) => {
        set((state) => {
          // Verifica se já existe registro para esta data
          const existingIndex = state.gamesHistory.findIndex(g => g.date === date);
          
          let newHistory: GameHistory[];
          if (existingIndex >= 0) {
            // Atualiza registro existente
            newHistory = [...state.gamesHistory];
            newHistory[existingIndex] = {
              date,
              attempts,
              won,
              firstTry: attempts === 1 && won,
            };
          } else {
            // Adiciona novo registro
            newHistory = [
              ...state.gamesHistory,
              {
                date,
                attempts,
                won,
                firstTry: attempts === 1 && won,
              }
            ];
          }

          // Ordena por data (mais recente primeiro)
          newHistory.sort((a, b) => b.date.localeCompare(a.date));

          return { gamesHistory: newHistory };
        });

        // Recalcula estatísticas após adicionar resultado
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

          // Total de vitórias
          const totalWins = history.filter(g => g.won).length;

          // Média de tentativas (apenas jogos completos)
          const completedGames = history.filter(g => g.won);
          const averageAttempts = completedGames.length > 0
            ? Number((completedGames.reduce((sum, g) => sum + g.attempts, 0) / completedGames.length).toFixed(1))
            : 0;

          // Acertos na primeira tentativa
          const firstTryWins = history.filter(g => g.firstTry).length;

          // Calcula streaks
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
                  // Dia consecutivo
                  tempStreak++;
                } else if (dayDiff > 1) {
                  // Quebrou a sequência
                  tempStreak = 1;
                }
              } else {
                // Primeira vitória
                tempStreak = 1;
              }
              
              maxStreak = Math.max(maxStreak, tempStreak);
              lastDate = gameDate;
            } else {
              // Perdeu ou desistiu - quebra a sequência
              tempStreak = 0;
            }
          }

          // Current streak é o tempStreak se a última data for recente
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

      getGameByDate: (date: string) => {
        return get().gamesHistory.find(g => g.date === date);
      },
    }),
    {
      name: 'classic-game-stats-storage',
      onRehydrateStorage: () => (state) => {
        // Recalcula estatísticas ao carregar do localStorage
        if (state) {
          state.calculateStats();
        }
      },
    }
  )
);