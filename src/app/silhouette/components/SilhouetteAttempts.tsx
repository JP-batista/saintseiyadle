// src/app/silhouette/components/SilhouetteAttempts.tsx
"use client";

import React, { memo, useMemo } from 'react';
import { Armor, Attempt } from '../../silhouette/types'; 
import { useTranslation } from '../../i18n/useTranslation';

type SilhouetteAttemptRowProps = {
  attempt: Armor; 
  isLatest: boolean;
};

const SilhouetteAttemptRow: React.FC<SilhouetteAttemptRowProps> = memo(({ attempt, isLatest }) => {
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
        src={attempt.revealedImg}
        alt={attempt.name}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border-2 border-gray-600/50 flex-shrink-0 shadow-lg"
        loading="lazy"
      />
      <div className="flex flex-col min-w-0 ml-4">
        <span className="font-bold text-white text-base sm:text-lg truncate">
          {attempt.name}
        </span>
        <span className="text-xs text-gray-400 truncate">
          {attempt.knight}
        </span>
      </div>
    </div>
  );
});
SilhouetteAttemptRow.displayName = 'SilhouetteAttemptRow';


type SilhouetteAttemptsProps = {
  attempts: Attempt[];
  allArmors: Armor[];
};

const SilhouetteAttemptsComponent: React.FC<SilhouetteAttemptsProps> = ({ attempts, allArmors }) => {
  const { t } = useTranslation();

  const armorsMap = useMemo(() => 
    new Map(allArmors.map(armor => [armor.name, armor])), 
    [allArmors]
  );

  const fullAttemptsData = useMemo(() => 
    attempts
      .map(attempt => armorsMap.get(attempt.name)) 
      .filter(Boolean) as Armor[],
    [attempts, armorsMap]
  );


  if (fullAttemptsData.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mt-6 animate-fadeInUp">
      <h3 className="text-xl font-bold text-center mb-4 text-yellow-400">
        {t('silhouette_attempts_title')} 
      </h3>
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4
        flex flex-col space-y-3">
        
        {fullAttemptsData.map((armor, index) => (
          <SilhouetteAttemptRow
            key={`${armor.name}-${index}`} 
            attempt={armor} 
            isLatest={index === 0} 
          />
        ))}
      </div>
    </div>
  );
};

export default memo(SilhouetteAttemptsComponent);