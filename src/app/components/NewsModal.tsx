"use client";
import React, { memo, useMemo } from "react";
// Importa ícones Lucide (incluindo Component como fallback seguro)
import { 
  X,
  Trophy, 
  RefreshCw, 
  Flag, 
  Component, 
  Info, 
  Activity, 
  Menu, 
  Smartphone, 
  Sparkles, 
  BarChart2, 
  Save, 
  Shuffle, 
  Database, 
  Image, 
  Rocket,
  MessageSquare
} from "lucide-react"; 
import { useTranslation } from "../i18n/useTranslation";
import { getNewsData } from "../i18n/config"; // Importa a função para pegar o array de notícias
import { NewsItem } from "../i18n/types"; // Importa o tipo NewsItem

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mapeamento de strings (do JSON) para componentes Lucide
const IconMap: Record<string, React.FC<any>> = {
    Trophy: Trophy,
    RefreshCw: RefreshCw,
    Flag: Flag,
    Component: Component,
    Info: Info,
    Activity: Activity,
    Menu: Menu,
    Smartphone: Smartphone,
    Sparkles: Sparkles,
    BarChart2: BarChart2,
    Save: Save,
    Shuffle: Shuffle,
    Database: Database,
    Image: Image,
    Rocket: Rocket,
    MessageSquare: MessageSquare
};

const NewsModalComponent: React.FC<NewsModalProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useTranslation();

  // 💥 CORREÇÃO PRINCIPAL: OBTÉM AS NOTÍCIAS LOCALIZADAS DIRETAMENTE DO MAPA/CONFIG.TS
  // Isso garante que a lista de notícias mude ao trocar o 'locale'.
  const newsItems: NewsItem[] = useMemo(() => getNewsData(locale), [locale]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          backdrop-gradient backdrop-blur-custom border border-gray-700/50 
          rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] 
          overflow-y-auto custom-scrollbar flex flex-col
          transform scale-100 animate-fadeInUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-yellow-500/50 flex justify-between items-center sticky top-0 bg-gray-900/90 z-10">
          <h3 className="text-2xl font-bold text-yellow-400">
            {t("news_modal_title")} 
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:rotate-90"
            aria-label={t("stats_button_close")}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-left space-y-4 sm:space-y-6 text-gray-300">
          <p className="text-sm italic text-gray-400">
            {t("news_intro_message")}
          </p>

          {/* Lista de Novidades */}
          <div className="space-y-4">
            {newsItems.map((item) => {
                // Seleciona o componente de ícone com fallback seguro
                const IconComponent = IconMap[item.icon] || IconMap.Component;
                
               
                                  
                return (
                    <div
                        key={item.id}
                        className={`
                            flex items-start p-4 bg-gray-900/60 rounded-xl border-l-4 
                            transition-all duration-300 hover:bg-gray-800/80 ${item.glow}
                        `}
                    >
                        <div className="flex-shrink-0 mr-4 mt-1">
                            <IconComponent />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base text-white truncate">
                                {item.title} {/* Consome o texto do JSON de notícias */}
                            </h4>
                            <p className="text-xs text-gray-400 italic mb-1">
                                {item.date} {/* Consome o texto do JSON de notícias */}
                            </p>
                            <p className="text-sm text-gray-300">
                                {item.description} {/* Consome o texto do JSON de notícias */}
                            </p>
                        </div>
                    </div>
                );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-700/50 sticky bottom-0 bg-gray-900/90 z-10">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 py-2 rounded-lg font-bold hover:from-yellow-600 transition duration-300"
          >
            {t("stats_button_close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(NewsModalComponent);
