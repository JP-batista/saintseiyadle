// src/app/classico/components/GameLegend.tsx
"use client"; // Necessário para o hook useRouter
import React, { memo } from "react"; // Importa memo
import { useRouter } from "next/navigation"; // Importa useRouter
import GameModeButtons from "./GameModeButtons";

// Renomeado para usar com memo
const GameLegendComponent = () => {
  const router = useRouter(); // Instancia o hook

  return (
    <div
      className={`mt-6 sm:mt-8 backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-gray-100 p-4 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-md mx-auto animate-fadeInUp`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* OTIMIZAÇÃO: Removido 'animate-text-glow' para performance */}
        <h3 className="text-xl font-bold mb-4 text-center text-yellow-400">
          Indicadores
        </h3>

        <div className="flex items-center justify-around space-x-4 w-full">
          {/* ÍCONES */}
          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-15 h-15 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/certo.png"
                alt="Correto"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">Correto</span>
          </div>
          {/* ... (outros ícones) ... */}
          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-15 h-15 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/errado.png"
                alt="Incorreto"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">Incorreto</span>
          </div>

          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-15 h-15 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/mais.png"
                alt="Mais Alto"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">Mais alto</span>
          </div>

          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-15 h-15 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/menos.png"
                alt="Mais Baixo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">Mais baixo</span>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 text-yellow-400 pt-4">
          Próximo modo:
        </h3>

        {/* LINK 1 */}
        <div
          className="rounded-full flex items-center space-x-3 sm:space-x-4 cursor-pointer group w-full max-w-[380px] hover-lift-rotate transition-ultra-smooth"
          // OTIMIZAÇÃO: Trocado window.location.href por router.push
          onClick={() => router.push("/SaintSeiyaDLE/silhueta")}
        >
          {/* ÍCONE LINK 1 - OTIMIZAÇÃO: Removido 'animate-wave-glow' */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition-ultra-smooth flex-shrink-0">
            <img
              src="/dle_feed/silhouette_icon.png"
              alt="Advinhe as Silhuetas"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          {/* TEXTO LINK 1 */}
          <div className="bg-gray-800/50 border-2 border-gray-700 p-3 sm:p-4 rounded-lg shadow-lg flex-1 group-hover:border-yellow-500 transition-ultra-smooth h-16 sm:h-20 flex flex-col justify-center">
            <h3 className="text-base sm:text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
              Advinhe as Silhuetas
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Adivinhe a armadura pela silhueta
            </p>
          </div>
        </div>

        {/* Botões de modos */}
        <GameModeButtons /> 
        {/* ^ Substitui todo o 'div' com os dois botões */}
      </div>
    </div>
  );
};

// OTIMIZAÇÃO: Envolvido com memo para evitar re-renders desnecessários
export default memo(GameLegendComponent);