// src/app/silhouette/components/ResultCard.tsx
"use client";
import React, { memo } from "react";
import { SelectedArmor } from "../types"; // Importa o tipo do Modo Silhueta
import { useRouter } from "next/navigation";
import GameModeButtons from "../../components/GameModeButtons"; // Importa os botões globais
import { useTranslation } from "../../i18n/useTranslation";

type ResultCardProps = {
  cardRef: React.RefObject<HTMLDivElement | null>;
  isWin: boolean;
  selectedArmor: SelectedArmor | null; // Usa o tipo SelectedArmor
  attemptsCount: number;
  timeRemaining: string;
  onShowStats: () => void;
};

const ResultCard: React.FC<ResultCardProps> = ({
  cardRef,
  isWin,
  selectedArmor,
  attemptsCount,
  timeRemaining,
  onShowStats,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div
      ref={cardRef}
      className={`mt-6 sm:mt-8 backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-gray-100 p-4 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-md mx-auto animate-fadeInUp`}
    >
      {/* TÍTULO (Reutiliza chaves de tradução) */}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 font-bold ${
          isWin ? "text-green-400" : "text-red-400"
        }`}
      >
        {isWin ? t('result_win_title') : t('result_lose_title')}
      </h2>

      {/* NOTA: Você precisará adicionar 'result_armor_was' ao pt.json (ex: "A armadura era:") */}
      <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-gray-200">
        {t('result_armor_was')}
      </p>

      <div className="flex flex-col items-center">
        {/* IMAGEM REVELADA (COM TAMANHO AUMENTADO) */}
        <img
          src={selectedArmor?.revealedImg} // Mostra a imagem revelada
          alt={selectedArmor?.name || "Armadura"} 
          className={`
            w-auto 
            h-40 sm:h-48 md:h-56 
            rounded-xl mb-2 border-2 shadow-lg 
            ${isWin ? "correct-indicator-enhanced border-green-500" : "border-gray-600/50"}
          `}
        />
        {/* NOME DA ARMADURA */}
        <p className="text-xl sm:text-2xl font-bold text-yellow-400">
          {selectedArmor?.name}!
        </p>
        {/* NOME DO CAVALEIRO (Subtexto) */}
        <p className="text-base sm:text-lg mb-3 sm:mb-4 text-gray-300">
          {selectedArmor?.knight}
        </p>

        {/* Contagem de Tentativas */}
        <p className="text-base sm:text-lg text-gray-200 mb-3 sm:mb-4">
          {t('result_attempts_count')}{" "}
          <span className="font-bold text-yellow-400">{attemptsCount}</span>
        </p>

        {/* Contador de tempo */}
        <div
          className={`bg-gray-900/50 border border-gray-700/50 p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 w-full ${
            timeRemaining.startsWith("00:00:") ? "countdown-pulse" : ""
          }`}
        >
          {/* NOTA: Você precisará adicionar 'result_next_armor_in' ao pt.json (ex: "Próxima silhueta em:") */}
          <p className="text-xs sm:text-sm text-gray-300 mb-2">
            {t('result_next_armor_in')}
          </p>
          <p className="text-lg sm:text-xl font-bold text-yellow-400">
            {timeRemaining}
          </p>
        </div>

        {/* Botão de estatísticas */}
        <button
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:from-yellow-600 hover:to-orange-600 transition duration-300 mb-4 w-full sm:w-auto hover-lift button-press hover:shadow-glow-yellow"
          onClick={onShowStats}
        >
          {t('result_button_stats')}
        </button>

        {/* Seção "Próximo modo" */}
        <div className="mt-4 sm:mt-6 w-full">
          <h3 className="text-base sm:text-lg font-bold mb-2 text-yellow-400">
            {t('legend_next_mode')}
          </h3>
          <div className="flex flex-col items-center space-y-4">
            
            {/* Renderiza os botões de todos os modos */}
            <GameModeButtons />

          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ResultCard);