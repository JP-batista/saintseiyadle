// src/stores/useSilhouetteStatsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Define a estrutura para o histórico de jogos do MODO SILHUETA.
 */
type SilhouetteGameHistory = {
  date: string; // YYYY-MM-DD
  attempts: number;
  won: boolean;
  firstTry: boolean;
  
  // Dados específicos do Modo Silhueta
  name: string; // O nome da armadura (a resposta)
  revealedImg: string; // A imagem revelada (para o modal)
  knight: string; // O cavaleiro (para contexto)
};

interface SilhouetteStatsState {
  gamesHistory: SilhouetteGameHistory[];
  totalWins: number;
  averageAttempts: number;
  firstTryWins: number;
  currentStreak: number;
  maxStreak: number;
  
  // Ação de adicionar resultado
  addGameResult: (
    date: string, 
    attempts: number, 
    won: boolean,
    name: string,
    revealedImg: string,
    knight: string
  ) => void;
  
  calculateStats: () => void;
  getGameByDate: (date: string) => SilhouetteGameHistory | undefined;
}

export const useSilhouetteStatsStore = create<SilhouetteStatsState>()(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      gamesHistory: [],
      totalWins: 0,
      averageAttempts: 0,
      firstTryWins: 0,
      currentStreak: 0,
      maxStreak: 0,

      // --- Ações ---
      
      addGameResult: (
        date, 
        attempts, 
        won, 
        name,
        revealedImg,
        knight
      ) => {
        set((state) => {
          // Cria o novo registro
          const newGame: SilhouetteGameHistory = {
            date,
            attempts,
            won,
            firstTry: attempts === 1 && won,
            name,
            revealedImg,
            knight,
          };
          
          // Adiciona o novo registro e remove qualquer registro antigo do mesmo dia
          const newHistory = [
            newGame,
            ...state.gamesHistory.filter(g => g.date !== date)
          ];

          return { gamesHistory: newHistory };
        });

        // Recalcula todas as estatísticas
        get().calculateStats();
      },

      /**
       * (Lógica idêntica aos outros stores de stats)
       * Calcula todas as métricas derivadas (streaks, médias)
       * baseado no gamesHistory.
       */
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

          // Cálculo de Streaks
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
              // Se o jogo do dia não foi uma vitória, quebra a sequência
              tempStreak = 0; 
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
      // A chave de persistência é única para este modo
      name: 'silhouette-game-stats-storage',
      
      // Recalcula as estatísticas quando o app é carregado
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.calculateStats();
        }
      },
    }
  )
);