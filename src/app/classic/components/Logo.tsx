// src/app/classico/components/Logo.tsx
"use client";
import Link from "next/link";
import React, { useState, useEffect, memo } from "react";
import { useTranslation } from "../../i18n/useTranslation"; // Importa o hook

const LogoComponent = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation(); // Instancia a tradução

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex justify-center items-center mb-2 relative z-10">
      <Link href="/" passHref>
        <img
          src="/dle_feed/logo_dle.png"
          // I18N: Traduzido o alt text
          alt={t('app_logo_alt')}
          loading="eager"
          fetchPriority="high"
          className={`w-auto h-32 sm:h-40 md:h-32 transition-all duration-1000 ${
            isLoaded
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-75 -rotate-12"
          } hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] cursor-pointer`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            willChange: "transform, opacity",
          }}
        />
      </Link>
    </div>
  );
};

export default memo(LogoComponent);