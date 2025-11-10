// src/app/attack/components/AttackDisplay.tsx
"use client";

import React, { memo, useMemo } from 'react';
import { useAttackGameStore } from '../../stores/useAttackGameStore';
import { useTranslation } from '../../i18n/useTranslation';
import { Disc } from 'lucide-react';

type AttackDisplayProps = {
  gifSrc: string; 
  attackName: string; 
  isWonOrGaveUp: boolean; 
};

// Constante para o blur inicial
const INITIAL_BLUR_LEVEL_VALUE = 8; // Deve corresponder ao do store


const AttackDisplayComponent: React.FC<AttackDisplayProps> = ({
  gifSrc,
  attackName,
  isWonOrGaveUp,
}) => {
  const { t } = useTranslation();
  
  const { 
      attemptBlurLevel, 
      grayscale, 
      setGrayscale, 
      autoDecreaseActive, 
      toggleAutoDecrease 
    } = useAttackGameStore();

  const blurPx = useMemo(() => {
    const levelToShow = autoDecreaseActive ? attemptBlurLevel : INITIAL_BLUR_LEVEL_VALUE;
    
    return Math.floor(levelToShow * 2); 

  }, [attemptBlurLevel, autoDecreaseActive]);
  
  const filterStyle: React.CSSProperties = useMemo(() => {
    let filter = `blur(${blurPx}px)`;
    
    if (grayscale) {
      filter += ' grayscale(100%)';
    }
    return { filter };
  }, [blurPx, grayscale]);
  
  
  return (
    <div className="w-full max-w-lg mx-auto mb-8 animate-fadeInUp">
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-6 text-center relative overflow-hidden">
        <div className="relative w-full aspect-video rounded-xl bg-gray-900 overflow-hidden border border-gray-700 shadow-xl">
          <img
            src={gifSrc}
            alt={attackName}
            className={`
              w-full h-full object-contain transition-all duration-500 transform-gpu will-change-filter
              ${isWonOrGaveUp ? 'opacity-100' : 'opacity-80 pointer-events-none'}
            `}
            style={filterStyle} 
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = "/dle_feed/placeholder.png";
            }}
          />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <button
              role="switch"
              aria-checked={autoDecreaseActive}
              onClick={toggleAutoDecrease}
              className={`toggle-switch ${autoDecreaseActive ? 'toggle-switch-on' : ''}`}
              aria-label={t('attack_toggle_blur')}
              disabled={false} 
            >
              <div className="toggle-switch-circle"></div>
            </button>
            <label 
              onClick={toggleAutoDecrease} 
              className={`text-sm text-gray-300 cursor-pointer`}
            >
              {t('attack_toggle_blur')}
            </label>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <button
              role="switch"
              aria-checked={!grayscale} 
              onClick={() => setGrayscale(!grayscale)}
              className={`toggle-switch ${!grayscale ? 'toggle-switch-on' : ''}`}
              aria-label={t('attack_toggle_color')}
            >
              <div className="toggle-switch-circle"></div>
            </button>
            <label 
              onClick={() => setGrayscale(!grayscale)} 
              className="text-sm text-gray-300 cursor-pointer"
            >
              {t('attack_toggle_color')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AttackDisplayComponent);