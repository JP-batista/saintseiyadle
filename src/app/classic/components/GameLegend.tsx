// src/app/classic/components/GameLegend.tsx
"use client"; // Necessário para o hook useRouter
import React, { memo } from "react";
import { useRouter } from "next/navigation";
import GameModeButtons from "../../components/GameModeButtons";
import { useTranslation } from "../../i18n/useTranslation"; // Importa o hook de tradução
import YesterdayClassic from '../components/YesterdayClassic';

const GameLegendComponent = () => {
  const router = useRouter();
  const { t } = useTranslation(); // Instancia a tradução

  // Handler para garantir que o path é limpo, se /SaintSeiyaDLE/ ainda estiver sendo usado
  const navigateToMode = (path: string) => {
    // Usa um path absoluto limpo para garantir a navegação correta (ex: /silhouette)
    router.push(path);
  }

  return (
    <div
      className={`mt-6 sm:mt-8 backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-gray-100 p-4 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-md mx-auto animate-fadeInUp`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* TÍTULO: Indicadores */}
        <h3 className="text-xl font-bold mb-4 text-center text-yellow-400">
          {t('legend_indicators')} 
        </h3>

        <div className="flex items-center justify-around space-x-4 w-full">
          {/* ÍCONES */}
          {/* Correto */}
          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/certo.png"
                // I18N: Traduzido alt
                alt={t('legend_correct')} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">{t('legend_correct')}</span>
          </div>
          
          {/* Incorreto */}
          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/errado.png"
                // I18N: Traduzido alt
                alt={t('legend_incorrect')} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">{t('legend_incorrect')}</span>
          </div>

          {/* Mais Alto */}
          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/mais.png"
                // I18N: Traduzido alt
                alt={t('legend_higher')} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">{t('legend_higher')}</span>
          </div>

          {/* Mais Baixo */}
          <div className="flex flex-col items-center hover-lift transition-transform duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
              <img
                src="/dle_feed/menos.png"
                // I18N: Traduzido alt
                alt={t('legend_lower')} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm text-white mt-2">{t('legend_lower')}</span>
          </div>
        </div>

        {/* TÍTULO: Próximo modo: */}
        <h3 className="text-lg font-bold mb-2 text-yellow-400 pt-4">
          {t('legend_next_mode')}
        </h3>

        {/* LINK 1: Modo Ataque (Novo) */}
        <div
          className="rounded-full flex items-center space-x-3 sm:space-x-4 cursor-pointer group w-full max-w-[380px] hover-lift-rotate transition-ultra-smooth"
          onClick={() => navigateToMode("/attack")}
        >
          {/* ÍCONE LINK 1 */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition-ultra-smooth flex-shrink-0">
            <img
              src="/dle_feed/attack_icon.png" // Ícone do Modo Ataque
              alt={t('mode_attack_name')} 
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          {/* TEXTO LINK 1 */}
          <div className="bg-gray-800/50 border-2 border-gray-700 p-3 sm:p-4 rounded-lg shadow-lg flex-1 group-hover:border-yellow-500 transition-ultra-smooth h-16 sm:h-20 flex flex-col justify-center">
            <h3 className="text-base sm:text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
              {t('mode_attack_name')}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              {t('mode_attack_desc')}
            </p>
          </div>
        </div>

        {/* LINK 2: Silhueta (Movido para baixo, usando o path limpo) */}
        <div
          className="rounded-full flex items-center space-x-3 sm:space-x-4 cursor-pointer group w-full max-w-[380px] hover-lift-rotate transition-ultra-smooth"
          onClick={() => navigateToMode("/silhouette")}
        >
          {/* ÍCONE LINK 2 */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition-ultra-smooth flex-shrink-0">
            <img
              src="/dle_feed/silhouette_icon.png"
              alt={t('mode_silhouette_name')} 
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          {/* TEXTO LINK 2 */}
          <div className="bg-gray-800/50 border-2 border-gray-700 p-3 sm:p-4 rounded-lg shadow-lg flex-1 group-hover:border-yellow-500 transition-ultra-smooth h-16 sm:h-20 flex flex-col justify-center">
            <h3 className="text-base sm:text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
              {t('mode_silhouette_name')}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              {t('mode_silhouette_desc')}
            </p>
          </div>
        </div>
        
        <YesterdayClassic />

        {/* Botões de modos */}
        <GameModeButtons />
      </div>
    </div>
  );
};

export default memo(GameLegendComponent);