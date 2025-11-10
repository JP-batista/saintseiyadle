// src/i18n/config.ts
import { Dictionary, NewsItem } from './types'; 

import pt_strings from './locales/pt.json';
import en_strings from './locales/en.json';
import jp_strings from './locales/jp.json';

import pt_news from '../data/news/news_pt.json';
import en_news from '../data/news/news_en.json';
import jp_news from '../data/news/news_jp.json';

import * as pt_data from '../data/characters/charactersDLE_pt'; 
import * as en_data from '../data/characters/charactersDLE_en'; 
import * as jp_data from '../data/characters/charactersDLE_jp'; 

import * as pt_quotes from '../data/quotes/quotesDLE_pt'; 
import * as en_quotes from '../data/quotes/quotesDLE_en'; 
import * as jp_quotes from '../data/quotes/quotesDLE_jp'; 

import * as pt_attacks from '../data/attack/attackDLE_pt'; 
import * as en_attacks from '../data/attack/attackDLE_en'; 
import * as jp_attacks from '../data/attack/attackDLE_jp'; 

import * as pt_armors from '../data/armors/armorsDLE_pt';
import * as en_armors from '../data/armors/armorsDLE_en';
import * as jp_armors from '../data/armors/armorsDLE_jp';


export const locales = ['pt', 'jp', 'en'] as const; 
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'pt';

export const localeMap: Record<Locale, { name: string; flag: string }> = {
  pt: { name: 'Português', flag: '/flags/portugues.png' }, 
  en: { name: 'English', flag: '/flags/ingles.png' }, 
  jp: { name: 'Japones', flag: '/flags/japones.png' },
  // es: { name: 'Espanhol', flag: '/flags/espanhol.png' },
  // fr: { name: 'Frances', flag: '/flags/frances.png' },
  // it: { name: 'Italiano', flag: '/flags/italiano.png' },
  // al: { name: 'Alemão', flag: '/flags/alemao.png' },
  // ch: { name: 'Chines', flag: '/flags/chines.png' },
};

export const dictionaries: Record<Locale, Dictionary> = {
  pt: pt_strings,
  en: en_strings,
  jp: jp_strings,
};

export const newsDataMap: Record<Locale, NewsItem[]> = {
    'pt': pt_news as NewsItem[],
    'en': en_news as NewsItem[],
    'jp': jp_news as NewsItem[],
}

export const characterDataMap: Record<Locale, any> = {
    'pt': pt_data,
    'en': en_data,
    'jp': jp_data,
};

export const quoteDataMap: Record<Locale, any> = {
    'pt': pt_quotes,
    'en': en_quotes,
    'jp': jp_quotes,
};

export const attackDataMap: Record<Locale, any> = {
    'pt': pt_attacks,
    'en': en_attacks,
    'jp': jp_attacks,
};

export const armorDataMap: Record<Locale, any> = {
    'pt': pt_armors,
    'en': en_armors,
    'jp': jp_armors,
};


export const getDictionary = (locale: Locale) => dictionaries[locale] ?? dictionaries[defaultLocale];

export const getNewsData = (locale: Locale): NewsItem[] => {
    return newsDataMap[locale] ?? newsDataMap[defaultLocale];
}

export const getQuoteData = (locale: Locale): any => {
    return quoteDataMap[locale] ?? quoteDataMap[defaultLocale];
}

export const getAttackData = (locale: Locale): any => {
    return attackDataMap[locale] ?? attackDataMap[defaultLocale];
}

export const getArmorData = (locale: Locale): any => {
    return armorDataMap[locale] ?? armorDataMap[defaultLocale];
}