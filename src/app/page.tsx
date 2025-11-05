// src/app/game-selection/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function GameSelectionPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generated = [...Array(20)].map(() => ({
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      animationDelay: Math.random() * 5 + "s",
      animationDuration: 5 + Math.random() * 10 + "s",
    }));
    setParticles(generated);
  }, []);

  useEffect(() => {
    // Trigger das animações de entrada após montagem
    setIsLoaded(true);
  }, []);

  const games = [
    {
      name: "Clássico",
      description: "Consiga pistas a cada tentativa",
      icon: "/dle_feed/classic_icon.png",
      link: "/classic",
      gradient: "from-yellow-500/20 to-orange-500/20",
      hoverGlow: "shadow-yellow-500/50",
    },
    // {
    //   name: "Silhuetas",
    //   description: "Adivinhe pela silhueta",
    //   icon: "/dle_feed/silhouette_icon.png",
    //   link: "/silhueta",
    //   gradient: "from-blue-500/20 to-purple-500/20",
    //   hoverGlow: "shadow-blue-500/50",
    // },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-8 relative overflow-hidden">
      {/* Background particles - Opcional */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-float"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Logo com animação de entrada */}
      <div className="flex justify-center items-center mb-8 relative z-10">
        <img
          src="/dle_feed/logo_dle.png"
          alt="Logo Os Cavaleiros do Zodíaco"
          className={`w-auto h-44 sm:h-52 md:h-60 transition-all duration-1000 ${
            isLoaded
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-75 -rotate-12"
          } hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] cursor-pointer`}
          style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
      </div>

      {/* Card de título com animação */}
      <div
        className={`w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl p-6 mb-10 relative overflow-hidden transition-all duration-700 delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Brilho animado de fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-shimmer" />
        
        <h3 className="text-xl sm:text-2xl font-bold text-center text-yellow-400 relative z-10 animate-text-glow">
          Adivinha os personagens de <br /> Os Cavaleiros do Zodíaco
        </h3>
      </div>

      {/* Lista de Jogos - Grid Responsivo */}
      <div
        className={`w-full max-w-4xl grid gap-6 px-2 relative z-10 ${
          games.length === 1
            ? "grid-cols-1 justify-items-center"
            : games.length === 2
            ? "grid-cols-2 justify-items-center"
            : games.length === 3
            ? "grid-cols-2 justify-items-center"
            : "grid-cols-2 md:grid-cols-3 justify-items-center"
        }`}
      >
        {games.map((game, index) => (
          <Link key={index} href={game.link}>
            <div
              className={`group relative transition-all duration-500  ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 "
              }`}
              style={{ transitionDelay: `${500 + index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow effect de fundo */}
              <div
                className={`absolute -inset-1  bg-gradient-to-r ${game.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Card principal */}
              <div className="relative flex items-center space-x-4 cursor-pointer w-full ">
                {/* Ícone do Jogo */}
                <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-2xl group-hover:border-yellow-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden">
                  {/* Partículas ao redor do ícone */}
                  {hoveredCard === index && (
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
                    alt={game.name}
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
                  Clique para jogar!
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-b border-yellow-500/50 rotate-45" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Rodapé com link "Em Breve" (opcional) */}
      <div
        className={`mt-12 text-center transition-all duration-700 delay-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-gray-400 text-sm mb-2">Mais modos de jogo em breve!</p>
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yellow-400/50 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}