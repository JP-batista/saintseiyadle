// src/components/StatsModal.tsx
"use client";
import { useStatsStore } from "../stores/useStatsStore";
import { X } from "lucide-react";
// Importa useMemo e memo
import { useState, useMemo, memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type StatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// ====================================================================
// OTIMIZAÇÃO 2: Componente do Gráfico Memoizado
// ====================================================================
const StatsChartComponent = ({ chartData }: { chartData: any[] }) => {
  return (
    // CONTAINER GRÁFICO: Estilo de vidro
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4">
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mb-3 sm:mb-4 text-center animate-text-glow">
        Evolução de Tentativas
      </h3>
      <div className="w-full h-48 sm:h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            {/* GRADES: Cor sutil com transparência */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(107, 114, 128, 0.3)"
            />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: "10px" }}
              interval="preserveStartEnd"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: "10px" }}
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />
            <Tooltip
              // TOOLTIP: Estilo de vidro
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.85)", /* bg-gray-900/85 */
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(107, 114, 128, 0.5)", /* border-gray-500/50 */
                borderRadius: "8px",
                color: "#F3F4F6",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#FCD34D", fontSize: "12px" }}
              itemStyle={{ color: "#F3F4F6" }}
            />
            <Line
              type="monotone"
              dataKey="tentativas"
              stroke="#FCD34D"
              strokeWidth={2}
              dot={{ fill: "#FCD34D", r: 3 }}
              activeDot={{
                r: 5,
                fill: "#FCD34D",
                stroke: "rgba(252, 211, 77, 0.5)",
                strokeWidth: 4,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
// Envolve o componente com memo()
const MemoizedStatsChart = memo(StatsChartComponent);

// ====================================================================
// OTIMIZAÇÃO 3: Componente da Linha do Histórico Memoizado
// ====================================================================
const GameHistoryRowComponent = ({ game }: { game: any }) => {
  return (
    // ITEM HISTÓRICO: Estilo de vidro
    <div
      key={game.date}
      className="
        flex items-center justify-between 
        bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 
        rounded-xl p-2 sm:p-3 
        hover:bg-gray-700/70 transition-colors gap-2
      "
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <img
          src={game.characterImage}
          alt={game.characterName}
          // IMAGEM: Borda sutil
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg object-cover border-2 border-gray-600/50 flex-shrink-0 shadow-lg"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-bold text-yellow-400 text-sm sm:text-base truncate">
            {game.characterName}
          </span>
          <span className="text-xs text-gray-400 truncate">
            {new Date(game.date + "T00:00:00").toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {game.firstTry && (
          // BADGE: Adicionado brilho (shadow)
          <span className="hidden sm:inline text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-semibold whitespace-nowrap shadow-lg shadow-purple-500/30">
            🏆 1ª Tentativa!
          </span>
        )}
        {game.firstTry && (
          <span className="inline sm:hidden text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-semibold shadow-lg shadow-purple-500/30">
            🏆
          </span>
        )}
        <div className="text-right">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">
            {game.attempts}
          </div>
          <div className="text-xs text-gray-400 hidden sm:block">
            {game.attempts === 1 ? "tentativa" : "tentativas"}
          </div>
        </div>
      </div>
    </div>
  );
};
// Envolve o componente com memo()
const GameHistoryRow = memo(GameHistoryRowComponent);

// ====================================================================
// Componente Principal do Modal (Agora otimizado)
// ====================================================================
export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const {
    totalWins,
    averageAttempts,
    firstTryWins,
    currentStreak,
    maxStreak,
    gamesHistory,
  } = useStatsStore();

  const [showAllHistory, setShowAllHistory] = useState(false);

  // ====================================================================
  // OTIMIZAÇÃO 1: useMemo para dados derivados
  // ====================================================================

  // Memoiza a lista de jogos vencidos
  const wonGames = useMemo(() => {
    return gamesHistory.filter((g) => g.won);
  }, [gamesHistory]);

  // Memoiza os dados do gráfico
  const chartData = useMemo(() => {
    return [...wonGames] // Usa a lista já memoizada
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
      .map((game) => ({
        date: new Date(game.date + "T00:00:00").toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        tentativas: game.attempts,
        fullDate: game.date,
      }));
  }, [wonGames]); // Só recalcula se 'wonGames' mudar

  // Memoiza a lista que será exibida (curta ou completa)
  const displayedHistory = useMemo(() => {
    return showAllHistory ? wonGames : wonGames.slice(0, 5);
  }, [wonGames, showAllHistory]); // Recalcula se 'wonGames' ou 'showAllHistory' mudar

  const hasMoreGames = useMemo(() => {
    return wonGames.length > 5;
  }, [wonGames]);
  // ====================================================================

  if (!isOpen) return null;

  return (
    <div
      // FUNDO DO MODAL
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        // CONTAINER PRINCIPAL
        className="
          backdrop-gradient backdrop-blur-custom border border-gray-700/50 
          rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] 
          overflow-y-auto custom-scrollbar flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div
          className="
          sticky top-0 
          bg-gray-900/80 backdrop-blur-md
          border-b-2 border-yellow-500 
          p-3 sm:p-4 md:p-6 flex justify-between items-center z-20
        "
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 animate-text-glow">
            📊 Estatísticas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:rotate-90 hover-lift"
          >
            <X size={24} className="sm:w-7 sm:h-7" />
          </button>
        </div>

        {/* Content - flex-grow */}
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 flex-grow">
          {/* Estatísticas principais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:bg-gray-900/70 hover:border-gray-600/50 hover:scale-105">
              <div className="text-3xl sm:text-4xl font-bold text-green-400">
                {totalWins}
              </div>
              <div className="text-sm sm:text-base text-gray-300 mt-1 uppercase tracking-wider font-semibold">
                Vitórias
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:bg-gray-900/70 hover:border-gray-600/50 hover:scale-105">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">
                {averageAttempts}
              </div>
              <div className="text-sm sm:text-base text-gray-300 mt-1 uppercase tracking-wider font-semibold">
                Média
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:bg-gray-900/70 hover:border-gray-600/50 hover:scale-105">
              <div className="text-3xl sm:text-4xl font-bold text-purple-400">
                {firstTryWins}
              </div>
              <div className="text-sm sm:text-base text-gray-300 mt-1 uppercase tracking-wider font-semibold">
                1ª Tentativa
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:bg-gray-900/70 hover:border-gray-600/50 hover:scale-105">
              <div className="text-3xl sm:text-4xl font-bold text-orange-400">
                {currentStreak}
              </div>
              <div className="text-sm sm:text-base text-gray-300 mt-1 uppercase tracking-wider font-semibold">
                Sequência
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:bg-gray-900/70 hover:border-gray-600/50 hover:scale-105 col-span-2 sm:col-span-1">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400">
                {maxStreak}
              </div>
              <div className="text-sm sm:text-base text-gray-300 mt-1 uppercase tracking-wider font-semibold">
                Recorde
              </div>
            </div>
          </div>

          {/* Gráfico de linha (Agora usa o componente memoizado) */}
          {chartData.length > 0 && <MemoizedStatsChart chartData={chartData} />}

          {/* Histórico de jogos (Agora usa o componente memoizado) */}
          {displayedHistory.length > 0 && (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mb-3 sm:mb-4 text-center animate-text-glow">
                Histórico de Vitórias
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {displayedHistory.map((game) => (
                  <GameHistoryRow key={game.date} game={game} />
                ))}
              </div>

              {/* BOTÃO VER MAIS */}
              {hasMoreGames && !showAllHistory && (
                <button
                  onClick={() => setShowAllHistory(true)}
                  className="w-full mt-3 sm:mt-4 bg-gray-700/80 border border-gray-600/50 text-yellow-300 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base hover:bg-gray-700/100 hover:border-gray-500 hover:text-yellow-200"
                >
                  Ver Mais ({wonGames.length - 5} jogos)
                </button>
              )}

              {showAllHistory && (
                <button
                  onClick={() => setShowAllHistory(false)}
                  className="w-full mt-3 sm:mt-4 bg-gray-700/80 border border-gray-600/50 text-yellow-300 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base hover:bg-gray-700/100 hover:border-gray-500 hover:text-yellow-200"
                >
                  Ver Menos
                </button>
              )}
            </div>
          )}

          {/* ESTADO VAZIO */}
          {gamesHistory.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-400 bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 border-dashed rounded-xl">
              <p className="text-base sm:text-lg">
                Nenhum jogo registrado ainda.
              </p>
              <p className="text-xs sm:text-sm mt-2">
                Complete seu primeiro jogo para ver as estatísticas!
              </p>
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        <div
          className="
          sticky bottom-0 
          bg-gray-900/80 backdrop-blur-md 
          border-t-2 border-yellow-500 
          p-3 sm:p-4 z-20
        "
        >
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 button-press hover-lift hover:from-yellow-600 hover:to-orange-600 hover:shadow-glow-yellow"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}