// src/app/attack/components/AttackAttemptsList.tsx
"use client";

import React, { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

type AttackAttemptRowProps = {
  attackName: string; 
  isLatest: boolean;
};

const AttackAttemptRow: React.FC<AttackAttemptRowProps> = memo(({ attackName, isLatest }) => {
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
    <div className="flex items-center min-w-0 ml-2">
      <span className="font-bold text-white text-base sm:text-lg truncate">
        {attackName}
      </span>
    </div>
    <span className="ml-auto text-yellow-400 font-bold text-sm">
      💥
    </span>
  </div>
  );
});
AttackAttemptRow.displayName = 'AttackAttemptRow';


type AttackAttemptsListProps = {
  attempts: { attackName: string }[]; 
};

const AttackAttemptsListComponent: React.FC<AttackAttemptsListProps> = ({ attempts }) => {
  const { t } = useTranslation();

  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mt-6 animate-fadeInUp">
      <h3 className="text-xl font-bold text-center mb-4 text-yellow-400">
        {t('attack_attempts_title')}
      </h3>
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4
        flex flex-col space-y-3">
        
        {attempts.map((attempt, index) => (
          <AttackAttemptRow
            key={`${attempt.attackName}-${index}`}
            attackName={attempt.attackName}
            isLatest={index === 0} 
          />
        ))}
      </div>
    </div>
  );
};

export default memo(AttackAttemptsListComponent);