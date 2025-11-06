// src/stores/useStatsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ... (Tipo GameHistory e Interface StatsState permanecem os mesmos) ...
type GameHistory = {
  date: string; // YYYY-MM-DD
  attempts: number;
  won: boolean;
  firstTry: boolean;
  characterName: string;
  characterImage: string;
  characterIdKey: string;
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
    characterIdKey: string
  ) => void;
  calculateStats: () => void;
  getGameByDate: (date: string) => GameHistory | undefined;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      // ... (Estado inicial permanece o mesmo) ...
      gamesHistory: [],
      totalWins: 0,
      averageAttempts: 0,
      firstTryWins: 0,
      currentStreak: 0,
      maxStreak: 0,

      // ===========================
      // OTIMIZAÇÃO 2 APLICADA AQUI
      // ===========================
      addGameResult: (date, attempts, won, characterName, characterImage, characterIdKey) => {
        set((state) => {
          // Cria o novo registro do jogo
          const newGame: GameHistory = {
            date,
            attempts,
            won,
            firstTry: attempts === 1 && won,
            characterName,
            characterImage,
            characterIdKey,
          };
          
          // Filtra o registro antigo (se houver) e adiciona o novo no início.
          // Isto é mais limpo e imutável.
          const newHistory = [
            newGame,
            ...state.gamesHistory.filter(g => g.date !== date)
          ];

          // OTIMIZAÇÃO 1: Removido o 'newHistory.sort(...)'
          // Esta operação era redundante, pois 'calculateStats' já faz seu próprio sort.

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

          // Otimização: Filtra por vitórias apenas UMA vez
          const completedGames = history.filter(g => g.won);
          const totalWins = completedGames.length;

          const averageAttempts = completedGames.length > 0
            ? Number((completedGames.reduce((sum, g) => sum + g.attempts, 0) / completedGames.length).toFixed(1))
            : 0;

          const firstTryWins = history.filter(g => g.firstTry).length;

          // Calcula streaks (lógica original está correta)
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
                // Se dayDiff === 0 (mesmo dia), não faz nada, continua a streak
              } else {
                tempStreak = 1; // Primeira vitória
              }
              
              maxStreak = Math.max(maxStreak, tempStreak);
              lastDate = gameDate;
            } else {
              tempStreak = 0; // Quebra a sequência
            }
          }

          // Verifica a streak atual
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