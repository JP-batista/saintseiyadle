// src/app/attack/components/AttackDisplay.tsx
"use client";

import React, { memo, useMemo } from 'react';
import { useAttackGameStore } from '../../stores/useAttackGameStore';
import { useTranslation } from '../../i18n/useTranslation';
import { Disc } from 'lucide-react';

// --- Tipos de Props ---
type AttackDisplayProps = {
  gifSrc: string; // O URL do GIF do ataque
  attackName: string; // Nome do ataque (para alt text)
  isWonOrGaveUp: boolean; // Se o jogo terminou
};

// Constante para o blur inicial
const INITIAL_BLUR_LEVEL_VALUE = 8; // Deve corresponder ao do store

/**
 * Componente que exibe o GIF do golpe, aplicando filtros dinâmicos
 * (Blur e Grayscale) com base no estado do jogo.
 */
const AttackDisplayComponent: React.FC<AttackDisplayProps> = ({
  gifSrc,
  attackName,
  isWonOrGaveUp,
}) => {
  const { t } = useTranslation();
  
  // 1. Obtém os estados de filtro e ações do store
  const { 
      // O blur alcançado pelas tentativas
      attemptBlurLevel, 
      grayscale, 
      setGrayscale, 
      // O estado do toggle (LIGADO/DESLIGADO)
      autoDecreaseActive, 
      // A ação do toggle
      toggleAutoDecrease 
    } = useAttackGameStore();

  // 2. Calcula o nível de blur em pixels
  const blurPx = useMemo(() => {
    
    // ATUALIZADO: Decide qual nível de blur usar
    // Se o toggle (Laranja) estiver LIGADO, usa o blur das tentativas.
    // Se estiver DESLIGADO (Cinza), usa o blur INICIAL.
    const levelToShow = autoDecreaseActive ? attemptBlurLevel : INITIAL_BLUR_LEVEL_VALUE;
    
    // Converte para pixels
    return Math.floor(levelToShow * 2); 

  }, [attemptBlurLevel, autoDecreaseActive]);
  
  // 3. Constrói a string de filtro CSS
  const filterStyle: React.CSSProperties = useMemo(() => {
    let filter = `blur(${blurPx}px)`;
    
    // O filtro grayscale agora se aplica se estiver ativo,
    // independentemente do estado do jogo.
    if (grayscale) {
      filter += ' grayscale(100%)';
    }
    return { filter };
  }, [blurPx, grayscale]);
  
  
  return (
    <div className="w-full max-w-lg mx-auto mb-8 animate-fadeInUp">
      {/* Container principal do GIF com filtros */}
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-6 text-center relative overflow-hidden">
        
        {/* GIF do Ataque */}
        <div className="relative w-full aspect-video rounded-xl bg-gray-900 overflow-hidden border border-gray-700 shadow-xl">
          <img
            src={gifSrc}
            alt={attackName}
            className={`w-full h-full object-contain transition-all duration-500 transform-gpu will-change-filter ${
              isWonOrGaveUp ? 'opacity-100' : 'opacity-80'
            }`}
            style={filterStyle} // O filtro (blur/grayscale) agora persiste
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = "/dle_feed/placeholder.png";
            }}
          />
          
        </div>
        
        {/* Controles de Filtro (Abaixo do GIF) */}
        {/* Os controles agora são exibidos permanentemente */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-6">
            
            {/* Opção 1: Ligar/Desligar Auto-Desfoque */}
            <div className="flex flex-col items-center gap-2">
              <button
                role="switch"
                aria-checked={autoDecreaseActive}
                onClick={toggleAutoDecrease}
                // ATUALIZADO: A classe .toggle-switch-on (laranja) é aplicada se autoDecreaseActive for true
                className={`toggle-switch ${autoDecreaseActive ? 'toggle-switch-on' : ''}`}
                aria-label={t('attack_toggle_blur')}
                // ATUALIZADO: O botão NUNCA é desabilitado
                disabled={false} 
              >
                <div className="toggle-switch-circle"></div>
              </button>
              <label 
                onClick={toggleAutoDecrease} // Permite clicar no label
                className={`text-sm text-gray-300 cursor-pointer`}
              >
                {t('attack_toggle_blur')}
              </label>
            </div>
            
            {/* Opção 2: Ativar/Desativar Cores (Grayscale) */}
            <div className="flex flex-col items-center gap-2">
              <button
                role="switch"
                aria-checked={!grayscale} 
                onClick={() => setGrayscale(!grayscale)}
                className={`toggle-switch ${!grayscale ? 'toggle-switch-on' : ''}`}
                aria-label={t('attack_toggle_color')}
                // Este botão permanece funcional.
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
        
        {/* Mensagem de Dificuldade (removida) */}
      </div>
    </div>
  );
};

export default memo(AttackDisplayComponent);