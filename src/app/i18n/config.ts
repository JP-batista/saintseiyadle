import { Dictionary, NewsItem } from './types'; 

import pt_strings from './locales/pt.json';
// import en_strings from './locales/en.json';
// import jp_strings from './locales/jp.json';

import pt_news from '../data/news/news_pt.json'; // 💥 NOVO: Importa o array de notícias
// import en_news from './locales/news_en.json';
// import jp_news from './locales/news_jp.json';

import * as pt_data from '../data/characters/charactersDLE_pt'; 
// import * as en_data from '../data/characters/charactersDLE_en'; 
// import * as jp_data from '../data/characters/charactersDLE_jp'; 

// --- 1. Importar os novos dados de Falas ---
import * as pt_quotes from '../data/quotes/quotesDLE_pt'; 
// import * as en_quotes from '../data/quotes/quotesDLE_en'; 
// import * as jp_quotes from '../data/quotes/quotesDLE_jp'; 


export const locales = ['pt'] as const; 
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'pt';

export const localeMap: Record<Locale, { name: string; flag: string }> = {
  pt: { name: 'Português', flag: '/flags/br.png' }, 
  // en: { name: 'English', flag: '/flags/eua.png' }, 
  // jp: { name: 'Japones', flag: '/flags/jp.png' },
};

export const dictionaries: Record<Locale, Dictionary> = {
  pt: pt_strings,
  // en: en_strings,
  // jp: jp_strings,
};

// 💥 NOVO: Mapeamento dos dados de novidades (array)
export const newsDataMap: Record<Locale, NewsItem[]> = {
    'pt': pt_news as NewsItem[],
    // 'en': en_news as NewsItem[],
    // 'jp': jp_news as NewsItem[],
}

export const characterDataMap: Record<Locale, any> = {
    'pt': pt_data,
    // 'en': en_data,
    // 'jp': jp_data,
};

// --- 2. Criar o novo Mapeamento de Falas (Modo Fala) ---
export const quoteDataMap: Record<Locale, any> = {
    'pt': pt_quotes,
    // 'en': en_quotes,
    // 'jp': jp_quotes,
};


export const getDictionary = (locale: Locale) => dictionaries[locale] ?? dictionaries[defaultLocale];

// 💥 NOVO: Função para obter os dados de notícias localizados
export const getNewsData = (locale: Locale): NewsItem[] => {
    // Retorna os dados localizados ou o padrão (pt)
    return newsDataMap[locale] ?? newsDataMap[defaultLocale];
}

// --- 3. Criar a nova Função para obter dados de Falas ---
export const getQuoteData = (locale: Locale): any => {
    return quoteDataMap[locale] ?? quoteDataMap[defaultLocale];
}