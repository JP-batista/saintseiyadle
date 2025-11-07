// src/app/page.tsx
"use client";

import React, { useEffect, useState, memo, useMemo } from "react"; // Adicionado useMemo
import Logo from "./classic/components/Logo"; 
import GameCard from "./components/GameCard"; 
import { useTranslation } from "./i18n/useTranslation"; // I18N: Importa o hook

// OTIMIZAÇÃO: Dados de partículas movidos para fora (não dependem de props/estado)
const generateParticles = () => {
    return [...Array(20)].map(() => ({
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
        animationDelay: Math.random() * 5 + "s",
        animationDuration: 5 + Math.random() * 10 + "s",
    }));
};

const GameSelectionPage = () => {
    const { t } = useTranslation(); // I18N: Instancia a tradução
    const [isLoaded, setIsLoaded] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);
    
    // OTIMIZAÇÃO: Usa useMemo para criar a lista de jogos APENAS quando o idioma muda
    const localizedGames = useMemo(() => ([
        {
            // I18N: Traduzido nome e descrição
            name: t('mode_classic_name'),
            description: t('mode_classic_desc'),
            icon: "/dle_feed/classic_icon.png",
            link: "/classic", // CORREÇÃO: Usar o prefixo completo
            gradient: "from-yellow-500/20 to-orange-500/20",
            hoverGlow: "shadow-yellow-500/50",
        },
        // --- MODO FALA ADICIONADO ---
        {
            name: t('mode_quote_name'),
            description: t('mode_quote_desc'),
            icon: "/dle_feed/quote_icon.png", // (Necessário criar este ícone)
            link: "/quote", // Link para a nova página
            gradient: "from-green-500/20 to-emerald-500/20",
            hoverGlow: "shadow-green-500/50",
        },
        // {
        //     // I18N: Traduzido nome e descrição
        //     name: t('mode_silhouette_name'),
        //     description: t('mode_silhouette_desc'),
        //     icon: "/dle_feed/silhouette_icon.png",
        //     link: "/SaintSeiyaDLE/silhueta",
        //     gradient: "from-blue-500/20 to-purple-500/20",
        //     hoverGlow: "shadow-blue-500/50",
        // },
    ]), [t]); // Depende da função 't'

    useEffect(() => {
        setParticles(generateParticles());
    }, []);

    useEffect(() => {
        setIsLoaded(true);
    }, []);


    return (
        <div className="flex flex-col items-center justify-start text-white px-4 py-8 relative overflow-hidden min-h-[90vh]">
            
            {/* Background particles */}
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
                <Logo />
            </div>


            {/* Card de título com animação */}
            <div
                className={`w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl p-6 mb-10 relative overflow-hidden transition-all duration-700 delay-300 ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent" />
                
                <h3 className="text-xl sm:text-2xl font-bold text-center text-yellow-400 relative z-10">
                    {/* I18N: Traduzido título principal */}
                    {t('game_selection_title')}
                </h3>
            </div>

            {/* Lista de Jogos - Grid Responsivo */}
            <div
                className={`w-full max-w-4xl grid gap-6 px-2 relative z-10 ${
                    localizedGames.length === 1
                        ? "grid-cols-1 justify-items-center"
                        : "grid-cols-1 sm:grid-cols-2 justify-items-center"
                }`}
            >
                {/* OTIMIZAÇÃO 2: Usa o GameCard memoizado */}
                {localizedGames.map((game, index) => (
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
                <p className="text-gray-400 text-sm mb-2">{t('game_selection_subtitle')}</p>
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