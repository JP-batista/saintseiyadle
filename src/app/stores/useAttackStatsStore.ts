// src/stores/useAttackStatsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Define a estrutura para o histórico de jogos do MODO ATAQUE.
 */
type AttackGameHistory = {
  date: string; // YYYY-MM-DD
  attempts: number;
  won: boolean;
  firstTry: boolean;
  
  // Dados específicos do Modo Ataque
  attackName: string; // O nome do golpe (a resposta)
  attackId: string; // O ID do golpe (ex: 'meteoro_pegaso')
  characterName: string; // Nome do personagem que executa o golpe
  characterImage: string; // Imagem do personagem
  characteridKey: string; // ID do personagem
};

interface AttackStatsState {
  gamesHistory: AttackGameHistory[];
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
    attackName: string,
    attackId: string,
    characterName: string,
    characterImage: string,
    characteridKey: string
  ) => void;
  
  calculateStats: () => void;
  getGameByDate: (date: string) => AttackGameHistory | undefined;
}

export const useAttackStatsStore = create<AttackStatsState>()(
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
        attackName, 
        attackId,
        characterName, 
        characterImage, 
        characteridKey
      ) => {
        set((state) => {
          // Cria o novo registro
          const newGame: AttackGameHistory = {
            date,
            attempts,
            won,
            firstTry: attempts === 1 && won,
            attackName,
            attackId,
            characterName,
            characterImage,
            characteridKey,
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
            // A streak é mantida se a última vitória foi hoje (0) ou ontem (1)
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
      name: 'attack-game-stats-storage',
      
      // Recalcula as estatísticas quando o app é carregado
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.calculateStats();
        }
      },
    }
  )
);