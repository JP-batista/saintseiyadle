// src/hooks/useDataImportExport.ts
import { useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from 'next/navigation';

const APP_ID = 'SaintSeiyaDLE';
const DATA_VERSION = 1;

const CLASSIC_STATS_KEY = 'classic-game-stats-storage';
const CLASSIC_GAME_KEY = 'classic-game-daily-storage';
const QUOTE_STATS_KEY = 'quote-game-stats-storage';
const QUOTE_GAME_KEY = 'quote-game-daily-storage';
const ATTACK_STATS_KEY = 'attack-game-stats-storage';
const ATTACK_GAME_KEY = 'attack-game-daily-storage';
const SILHOUETTE_STATS_KEY = 'silhouette-game-stats-storage';
const SILHOUETTE_GAME_KEY = 'silhouette-game-daily-storage';

type ExportDataFormat = {
  appId: string;
  version: number;
  data: {
    classicStats: string | null;
    classicGame: string | null;
    quoteStats: string | null;
    quoteGame: string | null;
    attackStats: string | null;
    attackGame: string | null;
    silhouetteStats: string | null;
    silhouetteGame: string | null;
  };
};

export const useDataImportExport = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const exportData = useCallback(() => {
    try {
      const classicStatsData = localStorage.getItem(CLASSIC_STATS_KEY);
      const classicGameData = localStorage.getItem(CLASSIC_GAME_KEY);
      const quoteStatsData = localStorage.getItem(QUOTE_STATS_KEY);
      const quoteGameData = localStorage.getItem(QUOTE_GAME_KEY);
      const attackStatsData = localStorage.getItem(ATTACK_STATS_KEY);
      const attackGameData = localStorage.getItem(ATTACK_GAME_KEY);
      const silhouetteStatsData = localStorage.getItem(SILHOUETTE_STATS_KEY);
      const silhouetteGameData = localStorage.getItem(SILHOUETTE_GAME_KEY);


      if (
        !classicStatsData && !classicGameData && 
        !quoteStatsData && !quoteGameData && 
        !attackStatsData && !attackGameData &&
        !silhouetteStatsData && !silhouetteGameData // NOVO
      ) {
        throw new Error(t('import_export_error_no_data'));
      }

      const exportObject: ExportDataFormat = {
        appId: APP_ID,
        version: DATA_VERSION,
        data: {
          classicStats: classicStatsData,
          classicGame: classicGameData,
          quoteStats: quoteStatsData,
          quoteGame: quoteGameData,
          attackStats: attackStatsData,
          attackGame: attackGameData,
          silhouetteStats: silhouetteStatsData,
          silhouetteGame: silhouetteGameData,
        },
      };

      const jsonString = JSON.stringify(exportObject, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `SaintSeiyaDLE_backup_completo_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { success: true };
      
    } catch (error: any) {
      console.error("Export failed:", error);
      return { 
        success: false, 
        message: error.message || t('import_export_error_generic') 
      };
    }
  }, [t]);

  const importData = useCallback(async (file: File) => {
    if (file.type !== 'application/json') {
        return { success: false, message: t('import_export_error_invalid_format') };
    }

    try {
      const fileContent = await file.text();
      const importedObject: ExportDataFormat = JSON.parse(fileContent);

      if (importedObject.appId !== APP_ID || importedObject.version > DATA_VERSION) {
        return { success: false, message: t('import_export_error_incompatible') };
      }

      if (!importedObject.data) {
         return { success: false, message: t('import_export_error_corrupted') };
      }
      
      const keysToImport = [
        { key: CLASSIC_STATS_KEY, data: importedObject.data.classicStats },
        { key: CLASSIC_GAME_KEY, data: importedObject.data.classicGame },
        { key: QUOTE_STATS_KEY, data: importedObject.data.quoteStats },
        { key: QUOTE_GAME_KEY, data: importedObject.data.quoteGame },
        { key: ATTACK_STATS_KEY, data: importedObject.data.attackStats },
        { key: ATTACK_GAME_KEY, data: importedObject.data.attackGame },
        { key: SILHOUETTE_STATS_KEY, data: importedObject.data.silhouetteStats },
        { key: SILHOUETTE_GAME_KEY, data: importedObject.data.silhouetteGame },
      ];

      for (const item of keysToImport) {
        if (item.data) { 
          localStorage.setItem(item.key, item.data);
        } else { 
          localStorage.removeItem(item.key);
        }
      }
      
      router.refresh(); 
      
      return { success: true, message: t('import_export_success_reload') };

    } catch (error: any) {
      console.error("Import failed:", error);
      return { 
        success: false, 
        message: t('import_export_error_parse') 
      };
    }
  }, [t, router]);

  return { exportData, importData };
};