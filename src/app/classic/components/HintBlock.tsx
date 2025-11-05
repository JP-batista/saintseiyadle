// src/app/classico/components/HintBlock.tsx
"use client";
import React, { useState } from "react";

type HintBlockProps = {
  attemptsCount: number;
  dica1: string | null | undefined;
  dica2: string | null | undefined;
};

const HintBlock: React.FC<HintBlockProps> = ({
  attemptsCount,
  dica1,
  dica2,
}) => {
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);

  const canShowHint1 = attemptsCount >= 5;
  const canShowHint2 = attemptsCount >= 10;

  return (
    <div className="w-full max-w-md backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-white rounded-2xl shadow-2xl p-5 sm:p-6 mb-6 animate-fadeInUp">
      {/* OTIMIZAÇÃO 1: Removido 'animate-text-glow' para performance */}
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 text-yellow-400 tracking-wide">
        Adivinha qual é a personagem de<br />Saint Seiya
      </h3>

      {/* Botões de Dica */}
      <div className="flex justify-between gap-4">
        {/* OTIMIZAÇÃO 2: Convertido de 'div' para '<button>' semântico */}
        <button
          onClick={() => setShowHint1(!showHint1)}
          disabled={!canShowHint1}
          className={`
            flex-1 p-3 text-center border-2 rounded-lg font-bold text-sm transition-all duration-300 transform 
            
            border-yellow-500/70 bg-gray-700/80 text-yellow-300 shadow-md shadow-yellow-500/20 
            hover:bg-yellow-500 hover:text-gray-900 hover:shadow-glow-yellow hover:scale-105 button-press
            
            disabled:bg-gray-800/50 disabled:border-gray-600/50 disabled:text-gray-500/70
            disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none 
            disabled:hover:scale-100 disabled:hover:bg-gray-800/50 disabled:hover:text-gray-500/70
          `}
        >
          Dica 1
        </button>
        {/* OTIMIZAÇÃO 2: Convertido de 'div' para '<button>' semântico */}
        <button
          onClick={() => setShowHint2(!showHint2)}
          disabled={!canShowHint2}
          className={`
            flex-1 p-3 text-center border-2 rounded-lg font-bold text-sm transition-all duration-300 transform 
            
            border-yellow-500/70 bg-gray-700/80 text-yellow-300 shadow-md shadow-yellow-500/20 
            hover:bg-yellow-500 hover:text-gray-900 hover:shadow-glow-yellow hover:scale-105 button-press
            
            disabled:bg-gray-800/50 disabled:border-gray-600/50 disabled:text-gray-500/70
            disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none 
            disabled:hover:scale-100 disabled:hover:bg-gray-800/50 disabled:hover:text-gray-500/70
          `}
        >
          Dica 2
        </button>
      </div>

      {/* Container para as dicas e contador de tentativas */}
      <div className="mt-4 space-y-3">
        {showHint1 && canShowHint1 && (
          <div
            className="p-3 bg-gray-900/50 backdrop-blur-sm border border-yellow-500/50 rounded-lg text-center text-sm font-semibold text-yellow-300 shadow-lg hint-appear"
            key={`hint1-${dica1}`}
          >
            {dica1 || "Nenhuma dica disponível para este personagem."}
          </div>
        )}
        {showHint2 && canShowHint2 && (
          <div
            className="p-3 bg-gray-900/50 backdrop-blur-sm border border-yellow-500/50 rounded-lg text-center text-sm font-semibold text-yellow-300 shadow-lg hint-appear"
            key={`hint2-${dica2}`}
          >
            {dica2 || "Nenhuma dica disponível para este personagem."}
          </div>
        )}

        {/* Contador de Tentativas Faltantes */}
        <div className="p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-center text-sm">
          {attemptsCount < 5 && (
            <p className="text-gray-300">
              Faltam{" "}
              <span className="font-bold text-yellow-400">
                {5 - attemptsCount}
              </span>{" "}
              tentativas para a{" "}
              <span className="font-semibold text-yellow-300">Dica 1</span>.
            </p>
          )}
          {attemptsCount >= 5 && attemptsCount < 10 && (
            <p className="text-gray-300">
              Faltam{" "}
              <span className="font-bold text-yellow-400">
                {10 - attemptsCount}
              </span>{" "}
              tentativas para a{" "}
              <span className="font-semibold text-yellow-300">Dica 2</span>.
            </p>
          )}
          {attemptsCount >= 10 && (
            <p className="text-gray-300">Todas as dicas foram desbloqueadas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HintBlock;