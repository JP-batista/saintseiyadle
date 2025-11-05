// src/app/game-selection/page.tsx
"use client";

import React, { useEffect, useState, memo } from "react";
// OTIMIZAÇÃO: Importado Logo otimizado
import Logo from "./classic/components/Logo"; 
// OTIMIZAÇÃO: Importado o novo GameCard
import GameCard from "./components/GameCard"; 

// OTIMIZAÇÃO: Dados de partículas movidos para fora (não dependem de props/estado)
const generateParticles = () => {
    return [...Array(20)].map(() => ({
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
        animationDelay: Math.random() * 5 + "s",
        animationDuration: 5 + Math.random() * 10 + "s",
    }));
};

const games = [
    {
        name: "Clássico",
        description: "Consiga pistas a cada tentativa",
        icon: "/dle_feed/classic_icon.png",
        link: "/classic", // CORREÇÃO: Adicionado o prefixo correto
        gradient: "from-yellow-500/20 to-orange-500/20",
        hoverGlow: "shadow-yellow-500/50",
    },
    // { ... outro modo ... }
];

const GameSelectionPage = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);
    
    // OTIMIZAÇÃO: Remoção de 'hoveredCard' desnecessário (a lógica agora está em GameCard)

    useEffect(() => {
        setParticles(generateParticles());
    }, []);

    useEffect(() => {
        // Trigger das animações de entrada após montagem
        setIsLoaded(true);
    }, []);


    return (
        // OTIMIZAÇÃO 3: Removido min-h-screen (deixado para o RootLayout)
        <div className="flex flex-col items-center justify-start text-white px-4 py-8 relative overflow-hidden min-h-[90vh]">
            
            {/* Background particles - OTIMIZAÇÃO 1: Animação mantida para o fundo */}
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

            {/* Logo (Importado) */}
            <div className="mb-8 relative z-10">
                <Logo /> {/* OTIMIZAÇÃO: Reutiliza o componente Logo */}
            </div>


            {/* Card de título com animação */}
            <div
                className={`w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl p-6 mb-10 relative overflow-hidden transition-all duration-700 delay-300 ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
                {/* OTIMIZAÇÃO 1: Removido 'animate-shimmer' e 'animate-text-glow' para performance. */}
                {/* O brilho animado de fundo e o brilho do texto eram contínuos e caros. */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent" />
                
                <h3 className="text-xl sm:text-2xl font-bold text-center text-yellow-400 relative z-10">
                    Adivinha os personagens de <br /> Os Cavaleiros do Zodíaco
                </h3>
            </div>

            {/* Lista de Jogos - Grid Responsivo */}
            <div
                className={`w-full max-w-4xl grid gap-6 px-2 relative z-10 ${
                    games.length === 1
                        ? "grid-cols-1 justify-items-center"
                        : "grid-cols-1 sm:grid-cols-2 justify-items-center" // Ajustado para 1 ou 2 colunas
                }`}
            >
                {/* OTIMIZAÇÃO 2: Usa o GameCard memoizado */}
                {games.map((game, index) => (
                    <GameCard 
                        key={game.name}
                        game={game} 
                        index={index} 
                        isLoaded={isLoaded}
                    />
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
};

export default GameSelectionPage;