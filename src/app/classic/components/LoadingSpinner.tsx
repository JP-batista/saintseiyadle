// srcapp/classicc/components/LoadingSpinner.tsx
"use client"; // Adicionado para usar o hook
import React from "react";
import { useTranslation } from "../../i18n/useTranslation"; // Importa o hook

const LoadingSpinner = () => {
  const { t } = useTranslation(); // Instancia a tradução
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-yellow-400 text-2xl">
        {/* I18N: Traduzido o texto de carregamento */}
        {t('loading_message')}
      </div>
    </div>
  );
};

export default LoadingSpinner;