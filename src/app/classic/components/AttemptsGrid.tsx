// src/app/classico/components/AttemptsGrid.tsx
import React from "react";
import { AttemptComparison } from "../types";
import AttemptRow from "./AttemptRow";

type AttemptsGridProps = {
  attempts: AttemptComparison[];
  gridRef?: React.RefObject<HTMLDivElement> | null;
};

// OTIMIZAÇÃO 3: Array 'headers' movido para fora do componente.
// Isso evita que ele seja recriado em toda renderização.
const headers = [
  "Personagem", "Gênero", "Idade", "Altura", "Peso",
  "Signo", "Patente", "Exército", "Treinamento", "Saga",
];

const AttemptsGrid: React.FC<AttemptsGridProps> = ({ attempts, gridRef }) => {
  return (
    <div className="w-full px-2 sm:px-4" ref={gridRef || null}>
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[900px] lg:min-w-0 w-full max-w-6xl mx-auto grid grid-cols-10 gap-2 sm:gap-3 bg-gray-900/20 backdrop-blur-sm border border-gray-700/50 p-3 sm:p-5 rounded-2xl shadow-2xl">
          
          {/* O uso de 'headerIndex' como key aqui é OK, pois esta lista NUNCA muda */}
          {headers.map((header, headerIndex) => (
            <div
              key={headerIndex}
              className="text-center text-yellow-400 font-bold border-b-2 border-yellow-500/50 pb-2 break-words uppercase text-xs sm:text-sm md:text-base animate-fadeInDown"
              style={{ animationDelay: `${headerIndex * 0.05}s` }}
            >
              {header}
            </div>
          ))}

          {attempts.map((attempt, index) => (
            <AttemptRow
              // OTIMIZAÇÃO 2: Usando 'attempt.nome' como key
              // Esta é uma chave estável, melhorando a performance de renderização.
              key={attempt.nome} 
              attempt={attempt}
              // CORREÇÃO DE BUG 1: 'isLatest' é o index 0
              // A 'useGameStore' adiciona no início da array.
              isLatest={index === 0} 
              animationDelay={index * 0.08}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttemptsGrid;