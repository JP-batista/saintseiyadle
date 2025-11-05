"use client";
import React from "react";

// Mock Link component (substitui next/link)
// Copiado de page.tsx para tornar este componente independente no ambiente de mock
const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

type ClassicHeaderProps = {
  isLoaded: boolean;
  setShowStatsModal: (show: boolean) => void;
  currentStreak: number | null | undefined;
};

const ClassicHeader: React.FC<ClassicHeaderProps> = ({
  isLoaded,
  setShowStatsModal,
  currentStreak,
}) => {
  return (
    <>
      {/* Logo com animação de entrada */}
      <div className="flex justify-center items-center mb-2 relative z-10">
        <Link href="/" passHref>
          <img
            src="/dle_feed/logo_dle.png"
            alt="Logo Os Cavaleiros do Zodíaco"
            className={`w-auto h-32 sm:h-40 md:h-32 transition-all duration-1000 ${
              isLoaded
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-75 -rotate-12"
            } hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] cursor-pointer`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onError={(e) => (e.currentTarget.src = "https://placehold.co/200x160/3B3B3B/FFF?text=Logo+DLE")}
          />
        </Link>
      </div>

      {/* Botões de modos - Fundo de "vidro" e animações melhoradas */}
      <div
        className="
         gap-4 sm:gap-6 
         rounded-xl       /* Bordas mais suaves */
         p-3 
         flex items-center justify-center flex-wrap
       "
      >
        {/* Modo Clássico */}
        <div className="relative group">
          <button
            className="rounded-full w-16 h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
            onClick={() => (window.location.href = "/SaintSeiyaDLE/classic")}
          >
            <img
              src="/dle_feed/classic_icon.png"
              alt="Modo Classic"
              className="
                 border-2 border-yellow-500 rounded-full w-full h-full object-contain 
                 transition-transform duration-300 
                 group-hover:scale-110 
                 animate-border-dance  /* Animação de borda que já existia */
                 animate-subtle-scale  /* Nova Animação: pulsação sutil constante */
               "
              onError={(e) => (e.currentTarget.src = "https://placehold.co/64x64/3B3B3B/FFF?text=Classic")}
            />
          </button>
          <div className="glass-tooltip">Modo Classic</div>
        </div>

        {/* Modo Silhueta (ícone pequeno) */}
        <div className="relative group">
          <button
            className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
            onClick={() => (window.location.href = "/SaintSeiyaDLE/silhueta")}
          >
            <img
              src="/dle_feed/silhouette_icon.png"
              alt="Modo Silhouette"
              className="
                 w-full h-full object-contain rounded-lg 
                 transition-transform duration-300 
                 group-hover:scale-110 
                 group-hover:shadow-glow-yellow /* Brilho no hover que já existia */
                 animate-subtle-scale         /* Nova Animação: pulsação sutil constante */
               "
              onError={(e) => (e.currentTarget.src = "https://placehold.co/64x64/3B3B3B/FFF?text=Silhueta")}
            />
          </button>
          <div className="glass-tooltip">Silhuetas</div>
        </div>
      </div>

      {/* Assumindo que currentStreak e setShowStatsModal estão disponíveis aqui */}
      <div
        className="
         backdrop-gradient backdrop-blur-custom 
         border border-gray-700/50 
         rounded-2xl shadow-2xl 
         p-3 sm:p-4 mb-8 
         flex items-center justify-center gap-4 sm:gap-6
         animate-fadeInUp /* Animação de entrada do seu CSS */
       "
      >
        {/* 1. Estatísticas */}
        <div className="relative group">
          <button
            onClick={() => setShowStatsModal(true)}
            className="
               w-14 h-14 sm:w-16 sm:h-16 
               rounded-full bg-gray-900/50 border-2 border-gray-700/50 
               flex items-center justify-center 
               text-3xl sm:text-4xl
               focus:outline-none transition-ultra-smooth hover-lift-rotate
               group-hover:shadow-glow-yellow group-hover:border-yellow-500/50
             "
          >
            📊
          </button>
          <div className="glass-tooltip">Estatísticas</div>
        </div>

        {/* 2. Sequência Atual */}
        <div className="relative group">
          <div
            className="
           w-14 h-14 sm:w-16 sm:h-16 
           rounded-full bg-gray-900/50 border-2 border-gray-700/50 
           flex flex-col items-center justify-center 
           transition-all duration-300
           animate-subtle-scale /* Animação de pulsação */
           shadow-glow-yellow    /* Brilho constante para destaque */
         "
          >
            <span className="text-3xl">🔥</span>
            <span className="font-bold text-yellow-400 text-sm -mt-1">
              {currentStreak || 0}
            </span>
          </div>
          <div className="glass-tooltip">Sequência Atual</div>
        </div>

        {/* 3. Novidades (Notas de Atualização) */}
        <div className="relative group">
          <button
            onClick={() => alert("Modal de novidades em breve!")} // Ação futura
            className="
               w-14 h-14 sm:w-16 sm:h-16 
               rounded-full bg-gray-900/50 border-2 border-gray-700/50 
               flex items-center justify-center 
               text-3xl sm:text-4xl
               focus:outline-none transition-ultra-smooth hover-lift-rotate
               group-hover:shadow-glow-yellow group-hover:border-yellow-500/50
             "
          >
            ✨
          </button>
          <div className="glass-tooltip">Novidades</div>
        </div>

        {/* 4. Como Jogar */}
        <div className="relative group">
          <button
            onClick={() => alert("Modal de 'Como Jogar' em breve!")} // Ação futura
            className="
               w-14 h-14 sm:w-16 sm:h-16 
               rounded-full bg-gray-900/50 border-2 border-gray-700/50 
               flex items-center justify-center 
               text-3xl sm:text-4xl
               focus:outline-none transition-ultra-smooth hover-lift-rotate
               group-hover:shadow-glow-yellow group-hover:border-yellow-500/50
             "
          >
            ❓
          </button>
          <div className="glass-tooltip">Como Jogar</div>
        </div>
      </div>
    </>
  );
};

export default ClassicHeader;
