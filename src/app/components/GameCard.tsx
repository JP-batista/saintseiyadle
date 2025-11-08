// src/app/components/GameCard.tsx
import React, { memo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "../i18n/useTranslation"; // I18N: Importa o hook

interface GameCardProps {
  game: {
    name: string;
    description: string;
    icon: string;
    link: string;
    gradient: string;
    hoverGlow: string;
  };
  index: number;
  isLoaded: boolean;
}

const GameCardComponent: React.FC<GameCardProps> = ({ game, index, isLoaded }) => {
  const { t } = useTranslation(); // Instancia a tradução
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <Link key={index} href={game.link}>
      <div
        // ✅ CORREÇÃO AQUI: Adicionado 'w-full'
        className={`group relative w-full transition-all duration-500 transform ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ transitionDelay: `${500 + index * 150}ms`, willChange: 'transform, opacity' }}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        {/* Glow effect de fundo */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${game.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Card principal */}
        <div className="relative flex items-center space-x-4 cursor-pointer w-full ">
          {/* Ícone do Jogo */}
          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-2xl group-hover:border-yellow-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden">
            {/* Partículas ao redor do ícone (mantidas, mas só ativadas no hover) */}
            {isCardHovered && (
              <>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-particle"
                    style={{
                      left: "50%",
                      top: "50%",
                      animationDelay: `${i * 0.1}s`,
                      transform: `rotate(${i * 45}deg) translateY(-40px)`,
                    }}
                  />
                ))}
              </>
            )}
            
            <img
              src={game.icon}
              alt={game.name} // game.name já é localizado pelo pai
              loading="lazy"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Detalhes do Jogo */}
          <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 p-4 sm:p-5 rounded-xl shadow-2xl group-hover:border-yellow-500 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02] relative overflow-hidden">
            {/* Brilho deslizante no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Conteúdo */}
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 mb-1">
                {game.name}
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm group-hover:text-white transition-colors duration-300">
                {game.description}
              </p>
            </div>

            {/* Indicador de "clique aqui" */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-5 h-5 text-yellow-400 animate-bounce-horizontal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tooltip flutuante */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-gray-900 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-lg shadow-lg border border-yellow-500/50 whitespace-nowrap">
            {/* I18N: Traduzido tooltip */}
            {t('legend_click_to_play')}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-b border-yellow-500/50 rotate-45" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(GameCardComponent);