// src/app/components/LoadingSpinner.tsx
"use client"; 
import { useTranslation } from "../i18n/useTranslation";

const LoadingSpinner = () => {
  const { t } = useTranslation(); 
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-yellow-400 text-2xl">
        {t('loading_message')}
      </div>
    </div>
  );
};

export default LoadingSpinner;