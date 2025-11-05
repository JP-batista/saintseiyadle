// src/components/StatsModal.tsx
"use client";
import { useStatsStore } from "../stores/useStatsStore";
import { X } from "lucide-react";
import { useState, useMemo, memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// ... (Todos os componentes memoizados: CustomActiveDot, StatsChartComponent, GameHistoryRow) ...
// ... (Eles não precisam de alteração) ...

type StatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CustomActiveDot = (props: any) => {
  // ... (código do dot)
  const { cx, cy, payload } = props;
  if (!payload) return null;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#FCD34D"
        stroke="rgba(252, 211, 77, 0.5)"
        strokeWidth={4}
      />
      <text
        x={cx}
        y={cy - 15}
        textAnchor="middle"
        fill="#FCD34D"
        fontSize="14"
        fontWeight="bold"
        style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.8))" }}
      >
        {payload.tentativas}
      </text>
    </g>
  );
};

const StatsChartComponent = ({ chartData }: { chartData: any[] }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4">
      {/* OTIMIZAÇÃO 2: Animação de brilho removida para performance */}
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mb-3 sm:mb-4 text-center">
        Evolução de Tentativas
      </h3>
      <div className="w-full h-48 sm:h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 25, right: 10, left: -20, bottom: 5 }}
          >
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
            <Line
              type="monotone"
              dataKey="tentativas"
              stroke="#FCD34D"
              strokeWidth={2}
              dot={{ fill: "#FCD34D", r: 3 }}
              activeDot={<CustomActiveDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
const MemoizedStatsChart = memo(StatsChartComponent);

const GameHistoryRowComponent = ({ game }: { game: any }) => {
  // ... (código da linha do histórico)
  return (
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
          <span className="hidden sm:inline text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-semibold whitespace-nowahora shadow-lg shadow-purple-500/30">
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
const GameHistoryRow = memo(GameHistoryRowComponent);

// ====================================================================
// Componente Principal
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

  // ... (Toda a lógica useMemo permanece a mesma) ...
  const wonGames = useMemo(() => gamesHistory.filter((g) => g.won), [
    gamesHistory,
  ]);
  const chartData = useMemo(
    () =>
      [...wonGames]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30)
        .map((game) => ({
          date: new Date(game.date + "T00:00:00").toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          tentativas: game.attempts,
          fullDate: game.date,
        })),
    [wonGames]
  );
  const displayedHistory = useMemo(
    () => (showAllHistory ? wonGames : wonGames.slice(0, 5)),
    [wonGames, showAllHistory]
  );
  const hasMoreGames = useMemo(() => wonGames.length > 5, [wonGames]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          backdrop-gradient backdrop-blur-custom border border-gray-700/50 
          rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] 
          overflow-y-auto custom-scrollbar flex flex-col
          
          transform-gpu will-change-scroll
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div
          className="
          sticky top-0 
          bg-gray-900/80
          border-b-2 border-yellow-500 
          p-3 sm:p-4 md:p-6 flex justify-between items-center z-20
        "
        >
          {/* OTIMIZAÇÃO 2: Animação de brilho removida para performance */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">
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
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {/* ... (os 5 cards de estatística) ... */}
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
            <div className="bg-gray-900/5D backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:bg-gray-900/70 hover:border-gray-600/50 hover:scale-105 col-span-2 sm:col-span-1">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400">
                {maxStreak}
              </div>
              <div className="text-sm sm:text-base text-gray-300 mt-1 uppercase tracking-wider font-semibold">
                Recorde
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && <MemoizedStatsChart chartData={chartData} />}

          {/* History */}
          {displayedHistory.length > 0 && (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4">
              {/* OTIMIZAÇÃO 2: Animação de brilho removida para performance */}
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mb-3 sm:mb-4 text-center">
                Histórico de Vitórias
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {displayedHistory.map((game) => (
                  <GameHistoryRow key={game.date} game={game} />
                ))}
              </div>

              {/* ... (Botões "Ver Mais" / "Ver Menos") ... */}
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

          {/* Empty State */}
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
          bg-gray-900/80
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