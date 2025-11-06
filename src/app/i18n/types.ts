// src/i18n/types.ts
import pt from './locales/pt.json';

// Cria um tipo baseado no arquivo de idioma em português (o mais completo)
export type Dictionary = typeof pt;

// NOVO: Define a estrutura de um item de notícia
export type NewsItem = {
    id: string;
    icon: string; // Componente Lucide (ex: 'Trophy')
    title: string;
    date: string;
    description: string;
    glow: string; // Tailwind glow classes
};