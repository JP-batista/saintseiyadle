// src/utils/dailyGame.ts

const RESET_TIME = {
  hour: 0, 
  minute: 0, 
};

export function getCurrentDateInBrazil(): string {
  const now = new Date();
  const brazilTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

  const currentHour = brazilTime.getHours();
  const currentMinute = brazilTime.getMinutes();

  if (
    currentHour < RESET_TIME.hour ||
    (currentHour === RESET_TIME.hour && currentMinute < RESET_TIME.minute)
  ) {
    brazilTime.setDate(brazilTime.getDate() - 1);
  }

  const year = brazilTime.getFullYear();
  const month = String(brazilTime.getMonth() + 1).padStart(2, "0");
  const day = String(brazilTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getNextMidnightInBrazil(): Date {
  const now = new Date();
  const brazilTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

  const nextReset = new Date(brazilTime);
  nextReset.setHours(RESET_TIME.hour, RESET_TIME.minute, 0, 0);

  if (brazilTime >= nextReset) {
    nextReset.setDate(nextReset.getDate() + 1);
  }

  const offset = brazilTime.getTime() - now.getTime();
  return new Date(nextReset.getTime() - offset);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char | 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDailyCharacter<T>(
  date: string,
  characters: T[]
): { character: T; index: number } {
  const seed = simpleHash(date + "CLASSIC_CHARACTER");

  const random = seededRandom(seed);

  const selectedIndex = Math.floor(random() * characters.length);

  return {
    character: characters[selectedIndex],
    index: selectedIndex,
  };
}

export function getDailyQuote<T>(
  date: string,
  allQuotes: T[]
): { quote: T; index: number } {
  const seed = simpleHash(date + "QUOTE_OF_THE_DAY");

  const random = seededRandom(seed);

  const selectedIndex = Math.floor(random() * allQuotes.length);

  return {
    quote: allQuotes[selectedIndex],
    index: selectedIndex,
  };
}

export function getDailyAttack<T>(
  date: string,
  allAttacks: T[]
): { attack: T; index: number } {
  const seed = simpleHash(date + "ATTACK_OF_THE_DAY");

  const random = seededRandom(seed);

  const selectedIndex = Math.floor(random() * allAttacks.length);

  return {
    attack: allAttacks[selectedIndex],
    index: selectedIndex,
  };
}

export function getDailyArmor<T>(
  date: string,
  allArmors: T[]
): { armor: T; index: number } {
  const seed = simpleHash(date + "SILHOUETTE_OF_THE_DAY");

  const random = seededRandom(seed);

  const selectedIndex = Math.floor(random() * allArmors.length);

  return {
    armor: allArmors[selectedIndex],
    index: selectedIndex,
  };
}

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