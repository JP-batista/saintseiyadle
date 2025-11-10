// src/app/quote/components/QuoteAttempts.tsx
"use client";

import React, { memo } from 'react';
import { Character } from '../../classic/types'; 
import { useTranslation } from '../../i18n/useTranslation'; 

type QuoteAttemptRowProps = {
  attempt: Character;
  isLatest: boolean;
};

const QuoteAttemptRow: React.FC<QuoteAttemptRowProps> = memo(({ attempt, isLatest }) => {
  return (
    <div 
      className={`
        flex items-center w-full bg-gray-800/60 border-2 rounded-xl p-3 shadow-lg 
        transition-all duration-300 transform-gpu
        ${isLatest ? 'border-yellow-500/50 scale-105' : 'border-gray-700/50'}
      `}
      style={{
        animation: isLatest ? 'slideInTopEnhanced 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
        opacity: isLatest ? 0 : 1 
      }}
    >
      <img
        src={attempt.imgSrc}
        alt={attempt.nome}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border-2 border-gray-600/50 flex-shrink-0 shadow-lg"
        loading="lazy"
      />
      <div className="flex flex-col min-w-0 ml-4">
        <span className="font-bold text-white text-base sm:text-lg truncate">
          {attempt.nome}
        </span>
        <span className="text-xs text-gray-400 truncate">
          {attempt.titulo || attempt.patente}
        </span>
      </div>
    </div>
  );
});
QuoteAttemptRow.displayName = 'QuoteAttemptRow';


type QuoteAttemptsProps = {
  attempts: Character[]; 
};

const QuoteAttemptsComponent: React.FC<QuoteAttemptsProps> = ({ attempts }) => {
  const { t } = useTranslation();

  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mt-6 animate-fadeInUp">
      <h3 className="text-xl font-bold text-center mb-4 text-yellow-400">
        {t('quote_attempts_title')}
      </h3>
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4
        flex flex-col space-y-3">        
        {attempts.map((attempt, index) => (
          <QuoteAttemptRow
            key={`${attempt.idKey}-${index}`}
            attempt={attempt}
            isLatest={index === 0} 
          />
        ))}
      </div>
    </div>
  );
};

export default memo(QuoteAttemptsComponent);