// src/app/quote/components/QuoteAttempts.tsx
"use client";

import React, { memo } from 'react';
import { Character } from '../../classic/types'; // Importa o tipo Character
// REMOVIDO: Não usaremos mais o CharacterCell aqui
// import CharacterCell from '../../classic/components/CharacterCell'; 
import { useTranslation } from '../../i18n/useTranslation'; // Importa o hook de tradução

// --- NOVO SUB-COMPONENTE DE LINHA ---
type QuoteAttemptRowProps = {
  attempt: Character;
  isLatest: boolean;
};

/**
 * Um sub-componente para renderizar uma única linha de tentativa
 * (Imagem ao lado do Nome)
 */
const QuoteAttemptRow: React.FC<QuoteAttemptRowProps> = memo(({ attempt, isLatest }) => {
  return (
    <div 
      className={`
        flex items-center w-full bg-gray-800/60 border-2 rounded-xl p-3 shadow-lg 
        transition-all duration-300 transform-gpu
        ${isLatest ? 'border-yellow-500/50 scale-105' : 'border-gray-700/50'}
      `}
      style={{
        // Reutiliza a animação de entrada do CSS global para a última tentativa
        animation: isLatest ? 'slideInTopEnhanced 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
        opacity: isLatest ? 0 : 1 // Garante que apenas o último item anime
      }}
    >
      <img
        src={attempt.imgSrc}
        alt={attempt.nome}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border-2 border-gray-600/50 flex-shrink-0 shadow-lg"
        loading="lazy"
      />
      <div className="flex flex-col min-w-0 ml-4">
        <span className="font-bold text-white text-base sm:text-lg truncate">
          {attempt.nome}
        </span>
        <span className="text-xs text-gray-400 truncate">
          {/* Mostra o título ou a patente como subtexto, se disponível */}
          {attempt.titulo || attempt.patente}
        </span>
      </div>
    </div>
  );
});
QuoteAttemptRow.displayName = 'QuoteAttemptRow';
// --- FIM DO SUB-COMPONENTE ---


type QuoteAttemptsProps = {
  attempts: Character[]; // Recebe a lista de personagens tentados
};

/**
 * Componente para exibir os palpites (tentativas) do usuário no Modo Fala.
 * Mostra uma LISTA VERTICAL com os personagens que já foram tentados.
 */
const QuoteAttemptsComponent: React.FC<QuoteAttemptsProps> = ({ attempts }) => {
  const { t } = useTranslation();

  // Não renderiza nada se não houver tentativas
  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mt-6 animate-fadeInUp">
      <h3 className="text-xl font-bold text-center mb-4 text-yellow-400">
        {t('quote_attempts_title')}
      </h3>
      {/* Card de vidro */}
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4
        flex flex-col space-y-3">
        {/* ^^^ ALTERADO para flex-col e space-y-3 */}
        
        {attempts.map((attempt, index) => (
          // USA O NOVO COMPONENTE DE LINHA
          <QuoteAttemptRow
            key={`${attempt.idKey}-${index}`}
            attempt={attempt}
            isLatest={index === 0} // Destaca o último palpite
          />
        ))}
      </div>
    </div>
  );
};

export default memo(QuoteAttemptsComponent);