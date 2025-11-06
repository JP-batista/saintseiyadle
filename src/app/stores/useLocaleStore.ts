// src/stores/useLocaleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, defaultLocale } from '../i18n/config'; // Importaremos 'Locale' e 'defaultLocale' daqui

interface LocaleState {
    locale: Locale;
    setLocale: (newLocale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            // O idioma padrão será 'pt' (ou o que estiver em config.ts)
            locale: defaultLocale, 

            setLocale: (newLocale) => set({ locale: newLocale }),
        }),
        {
            name: 'app-locale-storage', // Nome da chave no localStorage
            // O getStorage é opcional se você estiver usando o padrão (localStorage)
            // mas garante que a persistência está ativa.
        }
    )
);

// NOTA: Certifique-se de atualizar o path de importação para 'i18n/config' 
// se ele não estiver na raiz de 'src'. Se estiver, use '@/i18n/config'.