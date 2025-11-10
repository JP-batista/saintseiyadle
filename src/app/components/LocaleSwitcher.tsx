// src/app/components/LocaleSwitcher.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { locales, Locale, localeMap } from '../i18n/config'; 
import { useLocaleStore } from '../stores/useLocaleStore';
import { useTranslation } from '../i18n/useTranslation';

const LocaleSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocaleStore();
  const { t } = useTranslation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentLocaleInfo = localeMap[locale]; 

  const handleChangeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsModalOpen(false); 
  };

  return (
    <div className="relative z-50">
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          p-1 rounded-sm bg-gray-900/70 border-2 border-yellow-500/50 
          transition-all duration-300 hover:scale-105 hover:bg-gray-800/80
          shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400
        "
        aria-label={t('switch_language_open', { lang: currentLocaleInfo.name })}
      >
        <Image 
          src={currentLocaleInfo.flag} 
          alt={currentLocaleInfo.name} 
          width={24} 
          height={24} 
          className="rounded-sm object-cover"
        />
      </button>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)} 
        >
          <div 
            className="
              bg-gray-900/90 border border-gray-700/50 rounded-2xl shadow-2xl 
              p-6 w-full max-w-sm relative transform scale-100 animate-fadeInUp
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-3 mb-4">
              <h3 className="text-xl font-bold text-yellow-400">
                {t('switch_language_modal_title')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} aria-label={t('stats_button_close')}>
                <X className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>

            <div className="space-y-3">
              {locales.map((localeOption) => (
                <button
                  key={localeOption}
                  onClick={() => handleChangeLocale(localeOption)}
                  className={`
                    flex items-center justify-start w-full p-3 rounded-xl border-2 transition-all duration-200
                    ${locale === localeOption 
                      ? 'border-yellow-400 bg-yellow-500/20 text-white font-bold' 
                      : 'border-gray-700/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/70'
                    }
                  `}
                >
                  <Image 
                    src={localeMap[localeOption].flag} 
                    alt={localeMap[localeOption].name} 
                    width={30} 
                    height={30} 
                    className="rounded-sm object-cover mr-4 shadow-md"
                  />
                  <span>{localeMap[localeOption].name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocaleSwitcher;