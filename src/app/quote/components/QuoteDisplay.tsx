"use client";

import React, { memo } from 'react';

// Props agora aceita uma lista (array) de strings
type QuoteDisplayProps = {
  quotes: string[];
};

/**
 * Componente para exibir uma LISTA de citações (falas) do dia,
 * uma abaixo da outra (verticalmente).
 */
const QuoteDisplayComponent: React.FC<QuoteDisplayProps> = ({ quotes }) => {
  return (
    // Animação de entrada, container principal
    <div className="w-full max-w-xl text-center mb-8 animate-fadeInUp">
      
      {/* Container flexível para empilhar os cards verticalmente.
        'flex-col' organiza os itens em uma coluna.
        'space-y-4' adiciona um espaçamento vertical entre cada card.
      */}
      <div className="flex flex-col items-center space-y-4">
        
        {/* Itera (faz um loop) sobre a lista de citações */}
        {quotes.map((text, index) => (
          
          // Estilo de card de vidro para CADA citação
          // Usamos a 'key={index}' para otimização de performance do React
          <div 
            key={index} 
            className="w-full backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-6"
          >
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 italic">
              {/* Adiciona aspas estilizadas (entidades HTML) */}
              &ldquo;{text}&rdquo;
            </p>
          </div>

        ))}
        
      </div>
    </div>
  );
};

// Exporta a versão memoizada para otimização de performance
export default memo(QuoteDisplayComponent);