// srcapp/classicc/components/AttemptsGrid.tsx
import React, { useMemo } from "react";
import { AttemptComparison } from "../types";
import AttemptRow from "./AttemptRow";
import { useTranslation } from "../../i18n/useTranslation";

type AttemptsGridProps = {
  attempts: AttemptComparison[];
  gridRef?: React.RefObject<HTMLDivElement> | null;
};

// Array de CHAVES de tradução (mantém a ordem)
const headerKeys = [
  "grid_header_name",
  "grid_header_gender",
  "grid_header_age",
  "grid_header_height",
  "grid_header_weight",
  "grid_header_sign",
  "grid_header_rank",
  "grid_header_army",
  "grid_header_training",
  "grid_header_saga",
];

const AttemptsGrid: React.FC<AttemptsGridProps> = ({ attempts, gridRef }) => {
  const { t } = useTranslation();

  // Usa useMemo para recalcular os cabeçalhos APENAS quando o idioma muda
  const translatedHeaders = useMemo(() => {
    return headerKeys.map((key) => t(key as any));
  }, [t]);

  return (
    <div className="w-full px-2 sm:px-4" ref={gridRef || null}>
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[900px] lg:min-w-0 w-full max-w-6xl mx-auto grid grid-cols-10 gap-2 sm:gap-3 bg-gray-900/20 backdrop-blur-sm border border-gray-700/50 p-3 sm:p-5 rounded-2xl shadow-2xl">

          {/* Cabeçalhos: usar a chave de tradução (headerKeys[i]) como key em vez do index */}
          {translatedHeaders.map((header, headerIndex) => (
            <div
              key={headerKeys[headerIndex]}
              className="text-center text-yellow-400 font-bold border-b-2 border-yellow-500/50 pb-2 break-words uppercase text-xs sm:text-sm md:text-base animate-fadeInDown"
              style={{ animationDelay: `${headerIndex * 0.05}s` }}
            >
              {header}
            </div>
          ))}

          {/* Linhas de tentativas: garantir key única com fallback */}
          {attempts.map((attempt, index) => {
            // Garante uma key sempre única: usa idKey quando presente, senão combina nome+index
            const rowKey =
              attempt.idKey && attempt.idKey.trim() !== ""
                ? attempt.idKey
                : `${attempt.nome}-${index}`;

            return (
              <AttemptRow
                key={rowKey}
                attempt={attempt}
                isLatest={index === 0}
                animationDelay={index * 0.08}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttemptsGrid;
