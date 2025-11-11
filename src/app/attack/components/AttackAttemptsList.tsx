// src/app/attack/components/AttackAttemptsList.tsx
"use client";

import React, { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
// MODIFICADO: Importa o tipo do personagem
import { CharacterBaseInfo } from '../../i18n/types';

type AttackAttemptRowProps = {
  // MODIFICADO: Recebe o objeto completo do personagem
  character: CharacterBaseInfo; 
  isLatest: boolean;
  // MODIFICADO: Recebe o status de correção
  isCorrect: boolean;
};

const AttackAttemptRow: React.FC<AttackAttemptRowProps> = memo(({ character, isLatest, isCorrect }) => {
  const { t } = useTranslation();

  // MODIFICADO: Classes de borda baseadas na correção e se é o último
  const borderClass = isLatest 
    ? (isCorrect ? 'border-yellow-500/50' : 'border-yellow-500/50')
    : (isCorrect ? 'border-yellow-500/50' : 'border-gray-700/50');

  return (
    <div 
      className={`
        flex items-center w-full bg-gray-800/60 border-2 rounded-xl p-3 shadow-lg 
        transition-all duration-300 transform-gpu
        ${borderClass}
        ${isLatest ? 'scale-105' : ''}
      `}
      style={{
        // MODIFICADO: Animação de entrada para a última tentativa
        animation: isLatest ? 'slideInTopEnhanced 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
        opacity: isLatest ? 0 : 1 
      }}
    >
      <img
        src={character.imgSrc || '/dle_feed/placeholder.png'}
        alt={character.nome || t("form_default_name")}
        className="w-12 h-12 rounded-md object-cover border border-gray-700 flex-shrink-0"
      />
      <div className="flex items-center min-w-0 ml-3">
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-white text-base sm:text-lg truncate">
            {character.nome || t("form_default_name")}
          </span>
          <span className="text-xs text-gray-400 truncate">
            {character.patente || t("form_default_title")}
          </span>
        </div>
      </div>
    </div>
  );
});
AttackAttemptRow.displayName = 'AttackAttemptRow';


type AttackAttemptsListProps = {
  // MODIFICADO: 'attempts' agora é um array de 'CharacterBaseInfo'
  attempts: CharacterBaseInfo[]; 
  // MODIFICADO: Necessário para verificar a correção
  correctCharacterIdKey: string;
};

const AttackAttemptsListComponent: React.FC<AttackAttemptsListProps> = ({ attempts, correctCharacterIdKey }) => {
  const { t } = useTranslation();

  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mt-6 animate-fadeInUp">
      <h3 className="text-xl font-bold text-center mb-4 text-yellow-400">
        {/* MODIFICADO: Título atualizado para refletir tentativas de personagem */}
        {t('attack_attempts_title_character')}
      </h3>
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4
        flex flex-col space-y-3">
        
        {attempts.map((attempt, index) => {
          // MODIFICADO: Lógica para verificar se a tentativa está correta
          const isCorrect = attempt.idKey === correctCharacterIdKey;
          
          return (
            <AttackAttemptRow
              // MODIFICADO: Key usa o 'idKey' do personagem
              key={`${attempt.idKey}-${index}`}
              character={attempt}
              isLatest={index === 0} 
              isCorrect={isCorrect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(AttackAttemptsListComponent);