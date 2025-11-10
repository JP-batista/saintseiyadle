// src/i18n/useTranslation.ts
"use client";

import { useMemo } from 'react';
import { useLocaleStore } from '../stores/useLocaleStore'; // Importa o store que criamos
import { getDictionary, Locale } from './config';
import { Dictionary } from './types';

export const useTranslation = () => {
    const locale = useLocaleStore((state) => state.locale);
    
    const dict: Dictionary = useMemo(() => {
        return getDictionary(locale);
    }, [locale]);

    const t = (key: keyof Dictionary, replacements?: { [key: string]: string | number }) => {
        let message = dict[key] || key; 

        if (replacements) {
            Object.keys(replacements).forEach((k) => {
                const value = replacements[k];
                message = message.replace(`{${k}}`, String(value));
            });
        }

        return message;
    };

    return { t, locale };
};