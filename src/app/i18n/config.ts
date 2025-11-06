// src/i18n/config.ts
import { Dictionary } from './types'; 

// 1. Dicionários de strings (Importações diretas dos JSON)
import pt_strings from './locales/pt.json';
import en_strings from './locales/en.json';
import jp_strings from './locales/jp.json';
// import es_strings from './locales/es.json'; <-- Para um novo idioma

// 2. Importações de dados de personagens (Importações diretas dos TS)
// Você deve criar um arquivo para centralizar estas importações estáticas.
import * as pt_data from '../data/charactersDLE_pt'; // Use * as pt_data
import * as en_data from '../data/charactersDLE_en'; // Use * as en_data
import * as jp_data from '../data/charactersDLE_jp'; // Use * as en_data
// import * as es_data from '../data/charactersDLE_es'; <-- Para um novo idioma

// ===========================================
// ESTA É A ÚNICA ÁREA QUE VOCÊ MEXERÁ
// ===========================================
export const locales = ['pt', 'en', 'jp'] as const; // Adicionar 'es' aqui para um novo idioma
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'pt';

// Mapeamento de visual e strings
export const localeMap: Record<Locale, { name: string; flag: string }> = {
  pt: { name: 'Português', flag: '/flags/br.png' }, 
  en: { name: 'English', flag: '/flags/eua.png' }, 
  jp: { name: 'Japones', flag: '/flags/jp.png' },
  // es: { name: 'Español', flag: '/flags/es.svg' }, <-- Adicionar aqui
};

// 3. Objeto Principal (Combina strings e dados)
export const dictionaries: Record<Locale, Dictionary> = {
  pt: pt_strings,
  en: en_strings,
  jp: jp_strings,
  // es: es_strings, <-- Adicionar aqui
};

// Objeto de Dados de Personagens (para uso no GamePage)
export const characterDataMap: Record<Locale, any> = {
    'pt': pt_data,
    'en': en_data,
    'jp': jp_data,
    // 'es': es_data, <-- Adicionar aqui
};

// Função helper para obter o dicionário (usado no hook)
export const getDictionary = (locale: Locale) => dictionaries[locale] ?? dictionaries[defaultLocale];
// ===========================================