// src/components/StatsModal.tsx
"use client";
import { useStatsStore } from "../stores/useStatsStore";
import { X } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  const [showAllHistory, setShowAllHistory] = useState(false);

  if (!isOpen) return null;

  // Prepara dados para o gráfico de linha (últimos 30 jogos vencidos, ordem cronológica)
  const chartData = [...gamesHistory]
    .filter(g => g.won)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map(game => ({
      date: new Date(game.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      tentativas: game.attempts,
      fullDate: game.date,
    }));

  // Histórico de jogos (primeiros 5 ou todos)
  const displayedHistory = showAllHistory 
    ? gamesHistory.filter(g => g.won)
    : gamesHistory.filter(g => g.won).slice(0, 5);
  
  const hasMoreGames = gamesHistory.filter(g => g.won).length > 5;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b-2 border-yellow-500 p-6 flex justify-between items-center z-10">
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
          </div>

          {/* Gráfico de linha */}
          {chartData.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
                Evolução de Tentativas
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    labelStyle={{ color: '#FCD34D' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tentativas" 
                    stroke="#FCD34D" 
                    strokeWidth={3}
                    dot={{ fill: '#FCD34D', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Histórico de jogos */}
          {displayedHistory.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
                Histórico de Jogos
              </h3>
              <div className="space-y-3">
                {displayedHistory.map((game) => (
                  <div
                    key={game.date}
                    className="flex items-center justify-between bg-gray-600 rounded-lg p-3 hover:bg-gray-550 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={game.characterImage}
                        alt={game.characterName}
                        className="w-14 h-14 rounded-lg object-cover border-2 border-gray-500"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-yellow-400 text-sm">
                          {game.characterName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(game.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {game.firstTry && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-semibold">
                          🏆 1ª Tentativa!
                        </span>
                      )}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">
                          {game.attempts}
                        </div>
                        <div className="text-xs text-gray-400">
                          {game.attempts === 1 ? 'tentativa' : 'tentativas'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreGames && !showAllHistory && (
                <button
                  onClick={() => setShowAllHistory(true)}
                  className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Ver Mais ({gamesHistory.filter(g => g.won).length - 5} jogos)
                </button>
              )}

              {showAllHistory && (
                <button
                  onClick={() => setShowAllHistory(false)}
                  className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Ver Menos
                </button>
              )}
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