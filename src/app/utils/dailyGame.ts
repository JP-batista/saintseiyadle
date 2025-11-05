// src/utils/dailyGame.ts

/**
 * CONFIGURAÇÃO: Defina aqui o horário de reset do jogo
 * Formato: { hour: 0-23, minute: 0-59 }
 */
const RESET_TIME = {
  hour: 0,    // Hora do reset (0-23)
  minute: 0   // Minuto do reset (0-59)
};

/**
 * Retorna a data atual no fuso horário de São Paulo
 * Se o horário atual for antes do RESET_TIME, considera ainda o dia anterior
 */
export function getCurrentDateInBrazil(): string {
  const now = new Date();
  const brazilTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  
  // Se ainda não passou do horário de reset, considera o dia anterior
  const currentHour = brazilTime.getHours();
  const currentMinute = brazilTime.getMinutes();
  
  if (
    currentHour < RESET_TIME.hour || 
    (currentHour === RESET_TIME.hour && currentMinute < RESET_TIME.minute)
  ) {
    // Subtrai 1 dia
    brazilTime.setDate(brazilTime.getDate() - 1);
  }
  
  const year = brazilTime.getFullYear();
  const month = String(brazilTime.getMonth() + 1).padStart(2, '0');
  const day = String(brazilTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Calcula o timestamp do próximo horário de reset em São Paulo
 */
export function getNextMidnightInBrazil(): Date {
  const now = new Date();
  const brazilTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  
  const nextReset = new Date(brazilTime);
  nextReset.setHours(RESET_TIME.hour, RESET_TIME.minute, 0, 0);
  
  // Se o horário de reset já passou hoje, vai para amanhã
  if (brazilTime >= nextReset) {
    nextReset.setDate(nextReset.getDate() + 1);
  }
  
  // Converte de volta para o fuso local do usuário
  const offset = brazilTime.getTime() - now.getTime();
  return new Date(nextReset.getTime() - offset);
}

/**
 * Gera um hash simples a partir de uma string (compatível com seeded random)
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // OTIMIZAÇÃO DE PERFORMANCE: O bitwise OR (| 0) é uma forma mais curta
    // e comum em JS para garantir que a operação retorna um inteiro de 32 bits.
    hash = ((hash << 5) - hash) + char | 0; 
  }
  return Math.abs(hash);
}

/**
 * Implementação de gerador pseudo-aleatório com seed (Mulberry32)
 * Garante que a mesma data sempre gere o mesmo resultado
 */
function seededRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Embaralha um array usando algoritmo Fisher-Yates com seed
 */
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Seleciona o personagem do dia de forma determinística mas verdadeiramente aleatória
 * @param date Data no formato YYYY-MM-DD
 * @param characters Lista completa de personagens
 * @param usedIndices Índices já usados no ciclo atual
 * @returns Objeto com o personagem e seu índice
 */
export function getDailyCharacter<T>(
  date: string,
  characters: T[],
  usedIndices: number[] = []
): { character: T; index: number } {
  // Se todos foram usados, reinicia o ciclo
  const availableIndices = usedIndices.length >= characters.length
    ? Array.from({ length: characters.length }, (_, i) => i)
    : Array.from({ length: characters.length }, (_, i) => i)
        .filter(i => !usedIndices.includes(i));
  
  // Gera um seed único baseado na data
  const seed = simpleHash(date);
  
  // Embaralha os índices disponíveis de forma determinística
  const shuffledIndices = shuffleWithSeed(availableIndices, seed);
  
  // Pega o primeiro índice embaralhado
  const selectedIndex = shuffledIndices[0];
  
  return {
    character: characters[selectedIndex],
    index: selectedIndex
  };
}

/**
 * Formata o tempo restante para o próximo personagem
 */
export function formatTimeRemaining(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return "00:00:00";
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}