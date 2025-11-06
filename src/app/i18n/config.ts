// src/i18n/config.ts

import { Dictionary } from './types'; 

import pt_strings from './locales/pt.json';
// import en_strings from './locales/en.json';
// import jp_strings from './locales/jp.json';

import * as pt_data from '../data/charactersDLE_pt'; 
// import * as en_data from '../data/charactersDLE_en'; 
// import * as jp_data from '../data/charactersDLE_jp'; 

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

export const characterDataMap: Record<Locale, any> = {
    'pt': pt_data,
    // 'en': en_data,
    // 'jp': jp_data,
};

export const getDictionary = (locale: Locale) => dictionaries[locale] ?? dictionaries[defaultLocale];
