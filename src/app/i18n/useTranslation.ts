// src/i18n/useTranslation.ts
"use client";

import { useMemo } from 'react';
import { useLocaleStore } from '../stores/useLocaleStore'; // Importa o store que criamos
import { getDictionary, Locale } from './config';
import { Dictionary } from './types';

/**
 * Hook para obter a função de tradução (t) e o idioma ativo.
 */
export const useTranslation = () => {
    // Obtém o idioma ativo do store global (que persiste no localStorage)
    const locale = useLocaleStore((state) => state.locale);
    
    // O useMemo garante que o dicionário só será carregado/trocado quando o 'locale' mudar
    const dict: Dictionary = useMemo(() => {
        // Carrega o dicionário baseado no idioma do store
        return getDictionary(locale);
    }, [locale]);

    // Função de tradução principal
    const t = (key: keyof Dictionary, replacements?: { [key: string]: string | number }) => {
        let message = dict[key] || key; // Retorna a chave se a tradução for missing (fallback)

        if (replacements) {
            // Se houver substituições (placeholders), faz a troca
            Object.keys(replacements).forEach((k) => {
                const value = replacements[k];
                // Troca {key} pelo valor (ex: {count} por 5)
                message = message.replace(`{${k}}`, String(value));
            });
        }

        return message;
    };

    return { t, locale };
};