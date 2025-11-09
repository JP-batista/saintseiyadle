// src/app/attack/components/AttackAttemptsList.tsx
"use client";

import React, { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

// --- NOVO SUB-COMPONENTE DE LINHA ---
type AttackAttemptRowProps = {
  attackName: string; // Nome do ataque tentado
  isLatest: boolean;
};

/**
 * Um sub-componente para renderizar uma única linha de tentativa
 * (Apenas o nome do Golpe)
 */
const AttackAttemptRow: React.FC<AttackAttemptRowProps> = memo(({ attackName, isLatest }) => {
  return (
    <div 
      className={`
        flex items-center w-full bg-gray-800/60 border-2 rounded-xl p-3 shadow-lg 
        transition-all duration-300 transform-gpu
        ${isLatest ? 'border-yellow-500/50 scale-105' : 'border-gray-700/50'}
      `}
      style={{
        // Reutiliza a animação de entrada para a última tentativa
        animation: isLatest ? 'slideInTopEnhanced 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
        opacity: isLatest ? 0 : 1 // Garante que apenas o último item anime
      }}
    >
      <div className="flex items-center min-w-0 ml-2">
        <span className="font-bold text-white text-base sm:text-lg truncate">
          {attackName}
        </span>
      </div>
      {/* Indicador visual de tentativa (opcional) */}
      <span className="ml-auto text-yellow-400 font-bold text-sm">
        💥
      </span>
    </div>
  );
});
AttackAttemptRow.displayName = 'AttackAttemptRow';
// --- FIM DO SUB-COMPONENTE ---


type AttackAttemptsListProps = {
  // O array de tentativas é um array de objetos simples, como definido no store
  attempts: { attackName: string }[]; 
};

/**
 * Componente para exibir os palpites (tentativas) do usuário no Modo Ataque.
 * Mostra uma LISTA VERTICAL com os nomes dos golpes que já foram tentados.
 */
const AttackAttemptsListComponent: React.FC<AttackAttemptsListProps> = ({ attempts }) => {
  const { t } = useTranslation();

  // Não renderiza nada se não houver tentativas
  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mt-6 animate-fadeInUp">
      <h3 className="text-xl font-bold text-center mb-4 text-yellow-400">
        {t('attack_attempts_title')}
      </h3>
      {/* Card de vidro */}
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4
        flex flex-col space-y-3">
        
        {/* Mapeia as tentativas. O índice 0 é sempre a mais recente, devido à forma como o store adiciona */}
        {attempts.map((attempt, index) => (
          // O key é a combinação do nome e índice, já que o nome pode se repetir
          <AttackAttemptRow
            key={`${attempt.attackName}-${index}`}
            attackName={attempt.attackName}
            isLatest={index === 0} // Destaca o último palpite
          />
        ))}
      </div>
    </div>
  );
};

export default memo(AttackAttemptsListComponent);