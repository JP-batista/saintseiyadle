// src/hooks/useDailyAttack.ts
import { useEffect, useState, useMemo } from 'react';
import { useAttackGameStore } from '../stores/useAttackGameStore';
import { getCurrentDateInBrazil, getDailyAttack } from '../utils/dailyGame';
import { useLocaleStore } from '../stores/useLocaleStore';
import { getAttackData } from '../i18n/config'; 

// 1. IMPORTA OS TIPOS GLOBAIS de i18n/types.ts
import { 
    SelectedAttack, 
    CharacterWithAttacks, 
    CharacterBaseInfo,
    Attack 
} from '../i18n/types';

// 2. Remove os tipos locais (que causavam o conflito)
/*
type AttackCharacter = { ... };
type Attack = { ... };
type SelectedAttack = { ... };
type CharacterWithAttacks = { ... };
*/

/**
 * "Achata" (flattens) a estrutura de dados dos ataques.
 * Transforma: Character[] (com Attacks[] aninhado)
 * Para: SelectedAttack[] (um array plano de ataques individuais)
 */
const flattenAttackData = (dataModule: any): SelectedAttack[] => {
    // dataModule.default é o array 'attacks' de 'attackDLE_pt.ts'
    // 3. Usa o tipo global importado
    const charactersWithAttacks = (dataModule as any).default as CharacterWithAttacks[] || [];
    const allAttacks: SelectedAttack[] = [];

    for (const character of charactersWithAttacks) {
        // Prepara o objeto 'character' (o personagem-pai)
        // 4. Usa o tipo global importado (CharacterBaseInfo)
        const characterInfo: CharacterBaseInfo = {
            idKey: character.idKey,
            nome: character.nome,
            patente: character.patente,
            imgSrc: character.imgSrc,
            titulo: character.titulo, // Campo 'titulo' agora está incluído
        };

        // Adiciona cada ataque individual, combinado com os dados do personagem
        for (const attack of character.attacks) {
            allAttacks.push({
                // O ataque sorteado
                attack: {
                    idAttack: attack.idAttack,
                    name: attack.name,
                    gifSrc: attack.gifSrc,
                },
                // O personagem correto (a resposta)
                character: characterInfo,
            });
        }
    }
    return allAttacks;
};

/**
 * Hook personalizado para gerenciar o jogo diário do Modo Ataque.
 * Garante que o ataque do dia seja inicializado corretamente
 * e que o estado de vitória/filtros persista ao recarregar a página.
 */
export function useDailyAttack() {
  // 1. Obter estado do store específico do Modo Ataque
  const {
    selectedAttack,
    currentGameDate,
    won,
    resetDailyGame,
    setSelectedAttack,
    setCurrentGameDate,
  } = useAttackGameStore();

  // 2. Estado de inicialização local
  const [isInitialized, setIsInitialized] = useState(false);

  // 3. Obter o locale atual
  const locale = useLocaleStore((state) => state.locale);

  // 4. Carregar e "achatar" os dados de ataques (baseado no locale)
  const allAttacks = useMemo(() => {
    // Pega o módulo de dados (ex: 'attackDLE_pt') para o locale atual
    const dataModule = getAttackData(locale);
    
    // "Achata" os dados para criar a lista de sorteio
    return flattenAttackData(dataModule);
  }, [locale]); // Recalcula apenas se o idioma mudar

  // 5. Lógica de inicialização do jogo diário
  useEffect(() => {
    // Se não houver ataques carregados (ex: erro de dados), não faz nada
    if (allAttacks.length === 0) {
      console.warn("Nenhum ataque carregado, aguardando dados...");
      return;
    }

    const todayDate = getCurrentDateInBrazil();

    // Cenário 1: Dia mudou - novo jogo
    if (currentGameDate && currentGameDate !== todayDate) {
      // Sorteia o novo ataque do dia
      const { attack } = getDailyAttack(todayDate, allAttacks);
      // Reseta o store com o novo ataque (Tipos agora correspondem)
      resetDailyGame(attack, todayDate);
      setIsInitialized(true);
      return;
    }

    // Cenário 2: Mesmo dia, ataque já existe - mantém estado (incluindo filtros e vitória)
    if (currentGameDate === todayDate && selectedAttack) {
      setIsInitialized(true);
      return;
    }

    // Cenário 3: Primeira visita ou estado inválido - inicializa
    if (!currentGameDate || !selectedAttack) {
      // Sorteia o ataque do dia
      const { attack } = getDailyAttack(todayDate, allAttacks);
      // Define o ataque e a data no store (Tipos agora correspondem)
      setSelectedAttack(attack);
      setCurrentGameDate(todayDate);
      setIsInitialized(true);
    }
    
  }, [
    allAttacks, // Depende dos dados carregados e achatados
    currentGameDate,
    selectedAttack,
    resetDailyGame,
    setSelectedAttack,
    setCurrentGameDate,
  ]);

  // 6. Retorna o estado para a página
  return {
    isInitialized, // Informa à UI quando pode parar de mostrar "Carregando..."
    selectedAttack, // O objeto do ataque do dia (inclui a resposta)
    won, // O estado de vitória
  };
}