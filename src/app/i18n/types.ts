// src/i18n/types.ts
import pt from './locales/pt.json';

export type Dictionary = typeof pt;

export type NewsItem = {
    id: string;
    icon: string; 
    title: string;
    date: string;
    description: string;
    glow: string; 
};

export type CharacterBaseInfo = {
    patente: any;
    titulo: any;
    idKey: string;
    nome: string;
    imgSrc: string;
};

export type Attack = {
    idAttack: string;
    name: string; 
    gifSrc: string; 
};

export type CharacterWithAttacks = CharacterBaseInfo & {
    attacks: Attack[];
};

export type SelectedAttack = {
    attack: Attack; 
    character: CharacterBaseInfo; 
};

export type AttackGameHistory = {
    date: string; 
    attempts: number;
    won: boolean;
    firstTry: boolean;
    attackName: string; 
    attackId: string;
    characterName: string;
    characterImage: string;
    characteridKey: string;
};

export type Quote = {
    idQuote: string; 
    texts: string;
    dica1: string;
    dica2: string;
};

export type CharacterWithQuotes = CharacterBaseInfo & {
    titulo?: string;
    idade: string;
    altura: string;
    genero: string;
    peso: string;
    signo: string;
    localDeTreinamento: string;
    patente: string;
    exercito: string;
    saga?: string;
    quotes: Quote[];
};

export type SelectedQuote = {
    patente: any;
    titulo: any;
    quote: Quote; 
    character: CharacterBaseInfo; 
};

export type QuoteGameHistory = {
    date: string; 
    attempts: number;
    won: boolean;
    firstTry: boolean;
    
    characterName: string; 
    characterImage: string;
    characteridKey: string;
    quoteText: string; 
    quoteId: string; 
};

export type Armor = {
  name: string; 
  category: string;
  description: string;
  knight: string; 
  saga: string;
  silhouetteImg: string; 
  revealedImg: string;  
};

export type SelectedArmor = Armor;

export type SilhouetteGameHistory = {
  date: string; 
  attempts: number;
  won: boolean;
  firstTry: boolean;
  
  name: string; 
  revealedImg: string; 
  knight: string; 
};