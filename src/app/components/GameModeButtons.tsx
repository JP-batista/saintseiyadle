"use client";

import React, { memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "../i18n/useTranslation";
import { Check } from "lucide-react"; // 1. Importa o ícone de check

// 2. Importa todos os stores de jogo
import { useGameStore } from "../stores/useGameStore";
import { useQuoteGameStore } from "../stores/useQuoteGameStore";
import { useAttackGameStore } from "../stores/useAttackGameStore";
import { useSilhouetteGameStore } from "../stores/useSilhouetteGameStore";
import { getCurrentDateInBrazil } from "../utils/dailyGame"; // Importa o hook de data

// 3. Definição dos modos (como estava antes)
const gameModes = [
  {
    key: "classic",
    path: "/classic",
    iconSrc: "/dle_feed/classic_icon.png",
    translationKey: "mode_classic_name" as const,
  },
  {
    key: "silhouette",
    path: "/silhouette",
    iconSrc: "/dle_feed/silhouette_icon.png",
    translationKey: "mode_silhouette_name" as const,
  },
  {
    key: "attack",
    path: "/attack",
    iconSrc: "/dle_feed/attack_icon.png",
    translationKey: "mode_attack_name" as const,
  },
  {
    key: "quote",
    path: "/quote",
    iconSrc: "/dle_feed/quote_icon.png",
    translationKey: "mode_quote_name" as const,
  },
];

const GameModeButtonsComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const pathname = usePathname(); 

  // 4. Busca o estado de vitória de TODOS os stores
  // Nós também checamos se a vitória é de "hoje"
  const todayDate = getCurrentDateInBrazil();
  
  const classicWon = useGameStore((state) => state.won && state.currentGameDate === todayDate);
  const quoteWon = useQuoteGameStore((state) => state.won && state.currentGameDate === todayDate);
  const attackWon = useAttackGameStore((state) => state.won && state.currentGameDate === todayDate);
  const silhouetteWon = useSilhouetteGameStore((state) => state.won && state.currentGameDate === todayDate);

  // 5. Cria um mapa para fácil acesso dentro do loop
  const winStatusMap = {
    classic: classicWon,
    quote: quoteWon,
    attack: attackWon,
    silhouette: silhouetteWon,
  };

  return (
    <div className="gap-4 sm:gap-6 rounded-xl p-3 flex items-center justify-center flex-wrap">
      
      {gameModes.map((mode) => {
        const isActive = pathname.startsWith(mode.path);
        const label = t(mode.translationKey);
        
        // 6. Verifica se este modo específico foi vencido hoje
        const isWonToday = winStatusMap[mode.key as keyof typeof winStatusMap] || false;

        const buttonSize = isActive
          ? "w-16 h-16"
          : "w-14 h-14 sm:w-16 sm:h-16";

        // 7. Lógica de Estilo ATUALIZADA
        const imageStyles = isActive
          ? "border-yellow-500 scale-105 shadow-glow-yellow" // 1. Ativo
          : isWonToday
          ? "border-green-500/80" // 2. Vencido (mas não ativo)
          : "border-gray-700/50 grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0"; // 3. Padrão (não vencido)

        return (
          <div key={mode.key} className="relative group">
            <button
              className={`
                rounded-full bg-transparent focus:outline-none 
                transition-ultra-smooth hover-lift-rotate
                relative 
                ${buttonSize}
              `}
              onClick={() => router.push(mode.path)}
              aria-label={label}
              disabled={isActive} 
            >
              <img
                src={mode.iconSrc}
                alt={label}
                className={`
                  rounded-full w-full h-full object-contain border-2 
                  transition-all duration-300
                  ${imageStyles}
                `}
              />

              {/* 8. ADICIONA O CHECKMARK DE VITÓRIA */}
              {isWonToday && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

            </button>
            <div className="glass-tooltip">{label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(GameModeButtonsComponent);