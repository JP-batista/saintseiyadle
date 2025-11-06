import { useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../stores/useGameStore';
import { useStatsStore } from '../stores/useStatsStore';

// CONFIGURAÇÃO
const APP_ID = 'SaintSeiyaDLE';
const DATA_VERSION = 1;
// Use the actual persistent storage keys directly instead of trying to access internal persist helpers
const STATS_KEY = 'classic-game-stats-storage';
const GAME_KEY = 'classic-game-daily-storage';

// Definimos o formato esperado no arquivo JSON de exportação
type ExportDataFormat = {
  appId: string;
  version: number;
  data: {
    stats: string; // Conteúdo raw string de classic-game-stats-storage
    game: string;  // Conteúdo raw string de classic-game-daily-storage
  };
};

/**
 * Hook para gerenciar a exportação e importação de dados do localStorage.
 * Usa chaves fixas para garantir a portabilidade.
 */
export const useDataImportExport = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // ==============================
  // 1. EXPORTAR DADOS
  // ==============================
  const exportData = useCallback(() => {
    try {
      // 1. Acessa as strings RAW salvas pelo Zustand no localStorage
      const statsData = localStorage.getItem(STATS_KEY);
      const gameData = localStorage.getItem(GAME_KEY);

      if (!statsData || !gameData) {
        throw new Error(t('import_export_error_no_data'));
      }

      // 2. Monta o objeto de exportação com metadados
      const exportObject: ExportDataFormat = {
        appId: APP_ID,
        version: DATA_VERSION,
        data: {
          stats: statsData,
          game: gameData,
        },
      };

      // 3. Cria o blob JSON e força o download
      const jsonString = JSON.stringify(exportObject, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `SaintSeiyaDLE_backup_${new Date().toISOString().split('T')[0]}.json`;
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

  // ==============================
  // 2. IMPORTAR DADOS
  // ==============================
  const importData = useCallback(async (file: File) => {
    if (file.type !== 'application/json') {
        return { success: false, message: t('import_export_error_invalid_format') };
    }

    try {
      const fileContent = await file.text();
      const importedObject: ExportDataFormat = JSON.parse(fileContent);

      // 1. Validação de formato e versão
      if (importedObject.appId !== APP_ID || importedObject.version !== DATA_VERSION) {
        return { success: false, message: t('import_export_error_incompatible') };
      }

      // 2. Validação da integridade dos dados
      if (!importedObject.data || !importedObject.data.stats || !importedObject.data.game) {
         return { success: false, message: t('import_export_error_corrupted') };
      }
      
      // 3. Injeção no localStorage
      // Injetamos as strings RAW do arquivo diretamente nas chaves persistidas.
      localStorage.setItem(STATS_KEY, importedObject.data.stats);
      localStorage.setItem(GAME_KEY, importedObject.data.game);
      
      // 4. Forçar reidratação do Zustand/Recarregar App
      // A forma mais confiável de fazer o Zustand reidratar é recarregar a página.
      router.refresh(); 
      // Alternativa: window.location.reload();
      
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