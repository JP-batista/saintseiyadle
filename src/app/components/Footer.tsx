"use client";

import { Instagram, Linkedin } from "lucide-react";
import React, { memo } from "react";
import { useTranslation } from "../i18n/useTranslation"; 

const socialLinks = [
  { 
    href: "https://x.com/jotape_rba", 
    label: "Twitter",
    icon: 
    <svg 
      className="w-4 h-4" 
      fill="currentColor" 
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
    </svg>
  },
  { 
    href: "https://www.instagram.com/jp_batista20/", 
    label: "Instagram",
    icon: <Instagram className="w-5 h-5" /> 
  },
  { 
    href: "https://www.linkedin.com/in/joao-pedro-ribeiro-batista-araujo-1583b1332/", 
    label: "Linkedin",
    icon: <Linkedin className="w-5 h-5" /> 
  },
];

const FooterComponent = () => {
  const { t } = useTranslation(); 

  return (
    <footer
      className="
      backdrop-gradient backdrop-blur-custom 
      border-t-2 border-yellow-500/50
      text-white py-8 mt-16
    "
    >
      <div className="container mx-auto text-center flex flex-col items-center gap-4 px-4">
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer_social_link', { network: link.label })} 
              className="
                w-10 h-10 rounded-full 
                bg-gray-900/50 
                border border-gray-700/50
                flex items-center justify-center
                text-gray-300 
                transition-all duration-300 
                hover:text-yellow-400
                hover:border-yellow-500/50
                hover:shadow-glow-yellow
                hover:scale-110
                hover:-translate-y-1
              "
            >
              {link.icon}
            </a>
          ))}
        </div>

        <p className="text-sm text-gray-300">
          {t('footer_developed_by')}{" "}
          <span className="font-semibold text-white">João Pedro R. Batista Araújo</span>
        </p>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} saintseiyadle.
          </p>
          <p className="mt-2 text-xs text-gray-400 max-w-2xl">
            {t('footer_legal_disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(FooterComponent);