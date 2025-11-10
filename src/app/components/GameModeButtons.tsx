"use client";

import React, { memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "../i18n/useTranslation";

// 1. Definição dos modos de jogo para fácil extensibilidade
const gameModes = [
  {
    key: "classic",
    path: "/classic",
    iconSrc: "/dle_feed/classic_icon.png",
    translationKey: "mode_classic_name" as const, // Garante o tipo
  },
  {
    key: "quote",
    path: "/quote",
    iconSrc: "/dle_feed/quote_icon.png",
    translationKey: "mode_quote_name" as const, // Garante o tipo
  },
  {
    key: "attack",
    path: "/attack",
    iconSrc: "/dle_feed/attack_icon.png", // Ícone que representa um ataque/golpe
    translationKey: "mode_attack_name" as const, // Chave de tradução
  },
  // NOVO MODO: SILHUETA (Descomentado e ativado)
  {
    key: "silhouette",
    path: "/silhouette",
    iconSrc: "/dle_feed/silhouette_icon.png",
    translationKey: "mode_silhouette_name" as const,
  },
];

const GameModeButtonsComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();
  
  // 2. Hook para detectar a rota ativa
  // Ex: /classic/page.tsx -> pathname será /classic
  const pathname = usePathname(); 

  return (
    <div className="gap-4 sm:gap-6 rounded-xl p-3 flex items-center justify-center flex-wrap">
      
      {/* 3. Mapeia os modos de jogo dinamicamente */}
      {gameModes.map((mode) => {
        // 4. Lógica de destaque: verifica se a rota atual começa com o path do modo
        const isActive = pathname.startsWith(mode.path);
        const label = t(mode.translationKey);

        // 5. Define os estilos com base no estado 'isActive'
        
        // O modo ativo é sempre w-16 h-16
        // O modo inativo é menor em mobile (w-14) mas igual em desktop (sm:w-16)
        const buttonSize = isActive
          ? "w-16 h-16"
          : "w-14 h-14 sm:w-16 sm:h-16";

        // O modo ativo tem borda amarela, brilho e está 100% opaco
        // O modo inativo tem borda cinza (100% opaco no hover)
        const imageStyles = isActive
          ? "border-yellow-500 scale-105 shadow-glow-yellow" // Estilo Ativo
          : "border-gray-700/50 opacity-100 group-hover:opacity-100"; // Estilo Inativo

        return (
          <div key={mode.key} className="relative group">
            <button
              className={`
                rounded-full bg-transparent focus:outline-none 
                transition-ultra-smooth hover-lift-rotate
                ${buttonSize}
              `}
              onClick={() => router.push(mode.path)}
              aria-label={label}
              // Desativa o botão se já estivermos nesse modo
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
            </button>
            <div className="glass-tooltip">{label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(GameModeButtonsComponent);