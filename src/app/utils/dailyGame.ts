// src/utils/dailyGame.ts

/**
 * CONFIGURAÇÃO: Defina aqui o horário de reset do jogo
 * Formato: { hour: 0-23, minute: 0-59 }
 * Exemplos:
 * - Meia-noite: { hour: 0, minute: 0 }
 * - 6 da manhã: { hour: 6, minute: 0 }
 * - Meio-dia: { hour: 12, minute: 0 }
 * - 18h: { hour: 18, minute: 0 }
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
 * Gera um hash simples a partir de uma string
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Converte para inteiro de 32 bits
  }
  return Math.abs(hash);
}

/**
 * Seleciona o personagem do dia de forma determinística
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
  
  // Gera um hash determinístico baseado na data
  const seed = simpleHash(date);
  
  // Seleciona um índice disponível usando o hash
  const selectedIndex = availableIndices[seed % availableIndices.length];
  
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