// src/utils/dailyGame.ts

/**
 * CONFIGURAÇÃO: Defina aqui o horário de reset do jogo
 * Formato: { hour: 0-23, minute: 0-59 }
 */
const RESET_TIME = {
  hour: 0, // Hora do reset (0-23)
  minute: 0, // Minuto do reset (0-59)
};

/**
 * Retorna a data atual no fuso horário de São Paulo
 * Se o horário atual for antes do RESET_TIME, considera ainda o dia anterior
 */
export function getCurrentDateInBrazil(): string {
  const now = new Date();
  const brazilTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

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
  const month = String(brazilTime.getMonth() + 1).padStart(2, "0");
  const day = String(brazilTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Calcula o timestamp do próximo horário de reset em São Paulo
 */
export function getNextMidnightInBrazil(): Date {
  const now = new Date();
  const brazilTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

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
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * (Modo Clássico)
 * Seleciona o personagem do dia de forma determinística (depende SÓ da data)
 * @param date Data no formato YYYY-MM-DD
 * @param characters Lista completa de personagens
 * @returns Objeto com o personagem e seu índice
 */
export function getDailyCharacter<T>(
  date: string,
  characters: T[]
  // REMOVIDO: O parâmetro usedIndices foi removido daqui
): { character: T; index: number } {
  // 1. Gera um seed único baseado na data
  const seed = simpleHash(date);

  // 2. Cria um gerador de aleatoriedade baseado no seed
  const random = seededRandom(seed);

  // 3. Pega um índice aleatório (mas determinístico) do TOTAL de personagens
  // A seleção agora ignora completamente o usedIndices e depende apenas da data.
  const selectedIndex = Math.floor(random() * characters.length);

  return {
    character: characters[selectedIndex],
    index: selectedIndex,
  };
}

/**
 * (Modo Fala)
 * Seleciona a fala do dia de forma determinística (depende SÓ da data)
 * @param date Data no formato YYYY-MM-DD
 * @param allQuotes Lista completa de *todas* as falas (array "achatado")
 * @returns Objeto com a fala e seu índice
 */
export function getDailyQuote<T>(
  date: string,
  allQuotes: T[]
): { quote: T; index: number } {
  // 1. Gera um seed único baseado na data
  const seed = simpleHash(date);

  // 2. Cria um gerador de aleatoriedade baseado no seed
  const random = seededRandom(seed);

  // 3. Pega um índice aleatório (mas determinístico) do TOTAL de falas
  const selectedIndex = Math.floor(random() * allQuotes.length);

  return {
    quote: allQuotes[selectedIndex],
    index: selectedIndex,
  };
}

/**
 * (Modo Ataque)
 * Seleciona o ataque do dia de forma determinística (depende SÓ da data)
 * @param date Data no formato YYYY-MM-DD
 * @param allAttacks Lista completa de *todos* os ataques (array "achatado")
 * @returns Objeto com o ataque e seu índice
 */
export function getDailyAttack<T>(
  date: string,
  allAttacks: T[]
): { attack: T; index: number } {
  // 1. Gera um seed único baseado na data
  const seed = simpleHash(date);

  // 2. Cria um gerador de aleatoriedade baseado no seed
  const random = seededRandom(seed);

  // 3. Pega um índice aleatório (mas determinístico) do TOTAL de ataques
  const selectedIndex = Math.floor(random() * allAttacks.length);

  return {
    attack: allAttacks[selectedIndex],
    index: selectedIndex,
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

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}