// src/app/silhouette/components/ShareSection.tsx
"use client";

import React, { memo, useState, useMemo } from "react";
import { Copy, Twitter } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";

// Define as props que o componente espera
interface ShareSectionProps {
  attemptsCount: number;
  // A prop 'isWin' foi removida, pois só exibimos na vitória
}

const ShareSectionComponent: React.FC<ShareSectionProps> = ({ attemptsCount }) => {
  const { t } = useTranslation();
  
  const [copyButtonText, setCopyButtonText] = useState(t('share_button_copy')); // "Copiar 📋"
  const [isCopied, setIsCopied] = useState(false); // Estado para feedback visual

  // Gerar a string de compartilhamento (SEM GRID DE EMOJIS)
  const shareString = useMemo(() => {
    
    // ⬇️⬇️⬇️ CORREÇÃO APLICADA AQUI ⬇️⬇️⬇️
    // Removemos a lógica 'isWin' e usamos apenas a chave de vitória
    const title = t('share_title_silhouette_win', { count: attemptsCount });
    // ⬆️⬆️⬆️ FIM DA CORREÇÃO ⬆️⬆️⬆️
    
    const url = "https://saintseiyadle.vercel.app"; 

    // Junta apenas o título e a URL
    return [title, url].filter(Boolean).join('\n\n');
  }, [attemptsCount, t]); // 'isWin' removido das dependências

  // Função para Copiar
  const handleCopy = () => {
    navigator.clipboard.writeText(shareString)
      .then(() => {
        setCopyButtonText(t('share_button_copied'));
        setIsCopied(true);
        setTimeout(() => {
          setCopyButtonText(t('share_button_copy'));
          setIsCopied(false); 
        }, 2000);
      })
      .catch(err => console.error("Falha ao copiar: ", err));
  };

  // Função para Compartilhar no Twitter
  const handleShareTwitter = () => {
    const encodedText = encodeURIComponent(shareString);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    // O container principal da nova seção
    <div
      className="
        backdrop-gradient backdrop-blur-custom border border-gray-700/50 
        rounded-2xl shadow-2xl w-full max-w-md 
        overflow-hidden flex flex-col
        transform scale-100 animate-fadeInUp mt-6 sm:mt-8
      "
    >
      {/* Header */}
      <div className="p-4 border-b border-yellow-500/50">
        <h3 className="text-xl font-bold text-yellow-400 text-center">
          {t('share_modal_title')} {/* "Compartilhe seu Resultado" */}
        </h3>
      </div>

      {/* Conteúdo (A prévia do texto) */}
      <div className="p-4 bg-gray-900/50">
        <div className="bg-gray-800/50 border border-yellow-500/50 rounded-lg p-4 text-left shadow-lg shadow-black/50">
          <pre 
            className="
              text-base 
              text-gray-200 
              whitespace-pre-wrap 
              break-words 
              font-sans 
              leading-relaxed
            "
            data-cy="share-text-preview"
          >
            {shareString}
          </pre>
        </div>
      </div>

      {/* Footer (Os botões de ação) */}
      <div className="p-4 border-t border-gray-700/50 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCopy}
          className={`
            flex-1 flex items-center justify-center gap-2 
            px-5 py-3 rounded-lg font-bold text-base 
            transition-all duration-300 button-press hover-lift
            border ${isCopied 
              ? 'bg-green-600 border-green-500 text-white'
              : 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500 text-white hover:shadow-lg hover:shadow-yellow-500/20'
            }
          `}
        >
          <Copy size={18} />
          {copyButtonText}
        </button>
        <button
          onClick={handleShareTwitter}
          className="
            flex-1 flex items-center justify-center gap-2 
            bg-black hover:bg-gray-900 text-white /* ⬅️ Cor Preta */
            px-5 py-3 rounded-lg font-bold text-base 
            transition-all duration-300 button-press hover-lift
            border border-gray-800 hover:border-gray-700 /* ⬅️ Borda Escura */
            hover:shadow-lg hover:shadow-gray-500/10 /* ⬅️ Sombra Sutil */
          "
        >
          {/* 3. ÍCONE SVG DO 'X' (Logo) */}
          <svg 
            className="w-4 h-4" 
            fill="currentColor" 
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
          </svg>
          {/* (Você pode querer atualizar a chave 'share_button_twitter' no pt.json para "Compartilhar no X") */}
          {t('share_button_twitter')}
        </button>
      </div>
    </div>
  );
};

export default memo(ShareSectionComponent);