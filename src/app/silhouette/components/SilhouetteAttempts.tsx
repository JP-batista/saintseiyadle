// src/app/silhouette/components/SilhouetteAttempts.tsx
"use client";

// 1. Importa 'useMemo' para otimização e 'Armor' para os tipos
import React, { memo, useMemo } from 'react';
import { Armor, Attempt } from '../../silhouette/types'; 
import { useTranslation } from '../../i18n/useTranslation';

// --- SUB-COMPONENTE DE LINHA (ATUALIZADO) ---
type SilhouetteAttemptRowProps = {
  // 2. Prop alterada: Agora espera o objeto 'Armor' completo
  attempt: Armor; 
  isLatest: boolean;
};

/**
 * Um sub-componente para renderizar uma única linha de tentativa
 * (Imagem ao lado do Nome)
 */
const SilhouetteAttemptRow: React.FC<SilhouetteAttemptRowProps> = memo(({ attempt, isLatest }) => {
  return (
    <div 
      className={`
        flex items-center w-full bg-gray-800/60 border-2 rounded-xl p-3 shadow-lg 
        transition-all duration-300 transform-gpu
        ${isLatest ? 'border-yellow-500/50 scale-105' : 'border-gray-700/50'}
      `}
      style={{
        // Reutiliza a animação de entrada do CSS global
        animation: isLatest ? 'slideInTopEnhanced 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
        opacity: isLatest ? 0 : 1 // Garante que apenas o último item anime
      }}
    >
      {/* 3. IMAGEM ADICIONADA */}
      <img
        src={attempt.revealedImg}
        alt={attempt.name}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border-2 border-gray-600/50 flex-shrink-0 shadow-lg"
        loading="lazy"
      />
      {/* 4. Nome e Cavaleiro (Subtexto) ADICIONADOS */}
      <div className="flex flex-col min-w-0 ml-4">
        <span className="font-bold text-white text-base sm:text-lg truncate">
          {attempt.name}
        </span>
        <span className="text-xs text-gray-400 truncate">
          {attempt.knight}
        </span>
      </div>
    </div>
  );
});
SilhouetteAttemptRow.displayName = 'SilhouetteAttemptRow';
// --- FIM DO SUB-COMPONENTE ---


type SilhouetteAttemptsProps = {
  attempts: Attempt[]; // Recebe a lista de tentativas ({ name: string }[])
  // 5. NOVA PROP ADICIONADA: Lista de todas as armaduras
  allArmors: Armor[];
};

/**
 * Componente para exibir os palpites (tentativas) do usuário no Modo Silhueta.
 */
const SilhouetteAttemptsComponent: React.FC<SilhouetteAttemptsProps> = ({ attempts, allArmors }) => {
  const { t } = useTranslation();

  // 6. Otimização: Cria um "Mapa" para encontrar rapidamente
  // os dados da armadura (Imagem, Cavaleiro) a partir do nome.
  const armorsMap = useMemo(() => 
    new Map(allArmors.map(armor => [armor.name, armor])), 
    [allArmors]
  );

  // 7. Converte o array 'attempts' (que só tem nomes) 
  // em um array de objetos 'Armor' completos para renderização.
  const fullAttemptsData = useMemo(() => 
    attempts
      .map(attempt => armorsMap.get(attempt.name)) // Encontra o objeto Armor pelo nome
      .filter(Boolean) as Armor[], // Remove qualquer 'undefined' (se houver erro)
    [attempts, armorsMap]
  );


  // Não renderiza nada se não houver tentativas
  if (fullAttemptsData.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mt-6 animate-fadeInUp">
      <h3 className="text-xl font-bold text-center mb-4 text-yellow-400">
        {t('silhouette_attempts_title')} 
      </h3>
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4
        flex flex-col space-y-3">
        
        {/* 8. Mapeia os dados completos */}
        {fullAttemptsData.map((armor, index) => (
          <SilhouetteAttemptRow
            key={`${armor.name}-${index}`} 
            attempt={armor} // Passa o objeto Armor completo
            isLatest={index === 0} // Destaca o último palpite
          />
        ))}
      </div>
    </div>
  );
};

export default memo(SilhouetteAttemptsComponent);