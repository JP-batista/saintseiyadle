// src/app/classico/components/GameLegend.tsx
import React from "react";

const GameLegend = () => {
  return (
    <div
      // Removi a ref e classes de 'victory' daqui,
      // pois este é um card de legenda/navegação.
      className={`mt-6 sm:mt-8 backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-gray-100 p-4 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-md mx-auto animate-fadeInUp`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* TÍTULO: Adicionada animação de brilho */}
        <h3 className="text-xl font-bold mb-4 text-center text-yellow-400 animate-text-glow">
          Indicadores
        </h3>

        <div className="flex items-center justify-around space-x-4 w-full">
          {/* ÍCONES: Adicionado efeito hover-lift e transição */}
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

        {/* TÍTULO: Cor alterada para consistência */}
        <h3 className="text-lg font-bold mb-2 text-yellow-400 pt-4">
          Próximo modo:
        </h3>

        {/* LINK 1: Adicionado hover-lift-rotate e transição ultra-suave */}
        <div
          className="rounded-full flex items-center space-x-3 sm:space-x-4 cursor-pointer group w-full max-w-[380px] hover-lift-rotate transition-ultra-smooth"
          onClick={() => (window.location.href = "/SaintSeiyaDLE/silhueta")}
        >
          {/* ÍCONE LINK 1 */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition-ultra-smooth flex-shrink-0 animate-wave-glow">
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
        <div className="gap-4 sm:gap-6 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 flex items-center justify-center flex-wrap">
          {/* Modo Clássico */}
          <div className="relative group">
            <button
              className="rounded-full w-16 h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
              onClick={() => (window.location.href = "/SaintSeiyaDLE/classic")}
            >
              <img
                src="/dle_feed/classic_icon.png"
                alt="Modo Classic"
                className="border-2 border-yellow-500 rounded-full w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 animate-border-dance animate-subtle-scale"
              />
            </button>
            <div className="glass-tooltip">Modo Classic</div>
          </div>

          {/* Modo Silhueta */}
          <div className="relative group">
            <button
              className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate"
              onClick={() => (window.location.href = "/SaintSeiyaDLE/silhueta")}
            >
              <img
                src="/dle_feed/silhouette_icon.png"
                alt="Modo Silhouette"
                className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow-yellow animate-subtle-scale"
              />
            </button>
            <div className="glass-tooltip">Silhuetas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLegend;