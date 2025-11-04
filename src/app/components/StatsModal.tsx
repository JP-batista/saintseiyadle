// src/components/StatsModal.tsx
"use client";
import { useStatsStore } from "../stores/useStatsStore";
import { X } from "lucide-react";

type StatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { 
    totalWins, 
    averageAttempts, 
    firstTryWins, 
    currentStreak, 
    maxStreak,
    gamesHistory 
  } = useStatsStore();

  if (!isOpen) return null;

  // Prepara dados para o gráfico (últimos 10 jogos)
  const recentGames = [...gamesHistory]
    .filter(g => g.won)
    .slice(0, 10)
    .reverse();

  // Calcula a distribuição de tentativas (1-15+)
  const attemptsDistribution = Array(15).fill(0);
  gamesHistory.filter(g => g.won).forEach(game => {
    const index = Math.min(game.attempts - 1, 14);
    attemptsDistribution[index]++;
  });

  const maxCount = Math.max(...attemptsDistribution, 1);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b-2 border-yellow-500 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-yellow-400">📊 Estatísticas</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estatísticas principais */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{totalWins}</div>
              <div className="text-sm text-gray-300 mt-1">Total de Vitórias</div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{averageAttempts}</div>
              <div className="text-sm text-gray-300 mt-1">Média de Tentativas</div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{firstTryWins}</div>
              <div className="text-sm text-gray-300 mt-1">Acertos na 1ª Tentativa</div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">{currentStreak}</div>
              <div className="text-sm text-gray-300 mt-1">Sequência Atual</div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{maxStreak}</div>
              <div className="text-sm text-gray-300 mt-1">Melhor Sequência</div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-pink-400">{gamesHistory.length}</div>
              <div className="text-sm text-gray-300 mt-1">Jogos Totais</div>
            </div>
          </div>

          {/* Gráfico de distribuição de tentativas */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
              Distribuição de Tentativas
            </h3>
            <div className="space-y-2">
              {attemptsDistribution.map((count, index) => {
                const attempts = index + 1;
                const label = attempts === 15 ? "15+" : attempts.toString();
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return count > 0 ? (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 text-right text-sm text-gray-300">{label}</div>
                    <div className="flex-1 bg-gray-600 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        {count > 0 && (
                          <span className="text-xs font-bold text-gray-900">{count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Histórico recente */}
          {recentGames.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
                Últimos Jogos
              </h3>
              <div className="space-y-2">
                {recentGames.map((game, index) => (
                  <div
                    key={game.date}
                    className="flex items-center justify-between bg-gray-600 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-gray-300">
                        #{recentGames.length - index}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(game.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {game.firstTry && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-semibold">
                          1ª Tentativa!
                        </span>
                      )}
                      <div className="text-lg font-bold text-yellow-400">
                        {game.attempts} {game.attempts === 1 ? 'tentativa' : 'tentativas'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gamesHistory.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">Nenhum jogo registrado ainda.</p>
              <p className="text-sm mt-2">Complete seu primeiro jogo para ver as estatísticas!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t-2 border-yellow-500 p-4">
          <button
            onClick={onClose}
            className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-bold text-lg hover:bg-yellow-600 transition-all duration-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}