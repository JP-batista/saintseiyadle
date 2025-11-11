// src/stores/useLocaleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, defaultLocale } from '../i18n/config'; 

interface LocaleState {
    locale: Locale;
    setLocale: (newLocale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: defaultLocale, 

            setLocale: (newLocale) => set({ locale: newLocale }),
        }),
        {
            name: 'app-locale-storage',
        }
    )
);
