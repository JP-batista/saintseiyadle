// src/app/page.tsx
"use client";

import React, { useEffect, useState, memo, useMemo } from "react"; 
import Logo from "./components/Logo"; 
import GameCard from "./components/GameCard"; 
import { useTranslation } from "./i18n/useTranslation"; 

const generateParticles = () => {
    return [...Array(20)].map(() => ({
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
        animationDelay: Math.random() * 5 + "s",
        animationDuration: 5 + Math.random() * 10 + "s",
    }));
};

const GameSelectionPage = () => {
    const { t } = useTranslation(); 
    const [isLoaded, setIsLoaded] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);
    
    const localizedGames = useMemo(() => ([
        {
            name: t('mode_classic_name'),
            description: t('mode_classic_desc'),
            icon: "/dle_feed/classic_icon.png",
            link: "/classic", 
            gradient: "from-yellow-500/20 to-orange-500/20",
            hoverGlow: "shadow-yellow-500/50",
        },
        {
            name: t('mode_silhouette_name'),
            description: t('mode_silhouette_desc'),
            icon: "/dle_feed/silhouette_icon.png",
            link: "/silhouette", 
            gradient: "from-purple-500/20 to-indigo-500/20", 
            hoverGlow: "shadow-purple-500/50",
        },
        
        {
            name: t('mode_attack_name'),
            description: t('mode_attack_desc'),
            icon: "/dle_feed/attack_icon.png",
            link: "/attack",
            gradient: "from-blue-500/20 to-blue-500/20",
            hoverGlow: "shadow-blue-500/50",
        },
        {
            name: t('mode_quote_name'),
            description: t('mode_quote_desc'),
            icon: "/dle_feed/quote_icon.png", 
            link: "/quote",
            gradient: "from-green-500/20 to-emerald-500/20",
            hoverGlow: "shadow-green-500/50",
        },
    ]), [t]);

    useEffect(() => {
        setParticles(generateParticles());
    }, []);

    useEffect(() => {
        setIsLoaded(true);
    }, []);


    return (
        <div className="flex flex-col items-center justify-start text-white px-4 py-8 relative overflow-hidden min-h-[90vh]">
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

            <div className="mb-8 relative z-10">
                <Logo />
            </div>


            <div
                className={`w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl p-6 mb-10 relative overflow-hidden transition-all duration-700 delay-300 ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent" />
                
                <h3 className="text-xl sm:text-2xl font-bold text-center text-yellow-400 relative z-10">
                    {t('game_selection_title')}
                </h3>
            </div>

            <div
                className="w-full max-w-4xl flex flex-col items-center gap-6 px-2 relative z-10"
            >
                {localizedGames.map((game, index) => (
                    <GameCard
                    key={game.name}
                    game={game}
                    index={index}
                    isLoaded={isLoaded}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameSelectionPage;