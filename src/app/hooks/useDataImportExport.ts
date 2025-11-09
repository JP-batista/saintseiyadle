import { useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from 'next/navigation';
// Removidos imports desnecessários do useGameStore e useStatsStore

// CONFIGURAÇÃO
const APP_ID = 'SaintSeiyaDLE';
const DATA_VERSION = 1;

// ===================================
// ATUALIZAÇÃO 1: Definir todas as chaves
// ===================================
// Agora definimos explicitamente as chaves para TODOS os modos
const CLASSIC_STATS_KEY = 'classic-game-stats-storage';
const CLASSIC_GAME_KEY = 'classic-game-daily-storage';
const QUOTE_STATS_KEY = 'quote-game-stats-storage';
const QUOTE_GAME_KEY = 'quote-game-daily-storage';
// NOVO: Chaves para o Modo Ataque
const ATTACK_STATS_KEY = 'attack-game-stats-storage';
const ATTACK_GAME_KEY = 'attack-game-daily-storage';

// ===================================
// ATUALIZAÇÃO 2: Atualizar o formato de exportação
// ===================================
// O formato agora inclui os dados do Modo Fala e Ataque.
// Também permite 'null' caso o usuário nunca tenha jogado um modo.
type ExportDataFormat = {
  appId: string;
  version: number;
  data: {
    classicStats: string | null;
    classicGame: string | null;
    quoteStats: string | null;
    quoteGame: string | null;
    // NOVO: Chaves para Modo Ataque
    attackStats: string | null;
    attackGame: string | null;
  };
};

/**
 * Hook para gerenciar a exportação e importação de dados do localStorage.
 * Exporta/Importa dados de TODOS os modos de jogo.
 */
export const useDataImportExport = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // ==============================
  // 1. EXPORTAR DADOS (ATUALIZADO)
  // ==============================
  const exportData = useCallback(() => {
    try {
      // 1. Acessa as strings RAW de TODOS os modos
      const classicStatsData = localStorage.getItem(CLASSIC_STATS_KEY);
      const classicGameData = localStorage.getItem(CLASSIC_GAME_KEY);
      const quoteStatsData = localStorage.getItem(QUOTE_STATS_KEY);
      const quoteGameData = localStorage.getItem(QUOTE_GAME_KEY);
      // NOVO: Obtém dados do Modo Ataque
      const attackStatsData = localStorage.getItem(ATTACK_STATS_KEY);
      const attackGameData = localStorage.getItem(ATTACK_GAME_KEY);

      // 2. Validação: Só exporta se houver *pelo menos um* dado salvo
      if (!classicStatsData && !classicGameData && !quoteStatsData && !quoteGameData && !attackStatsData && !attackGameData) {
        throw new Error(t('import_export_error_no_data'));
      }

      // 3. Monta o objeto de exportação com metadados
      const exportObject: ExportDataFormat = {
        appId: APP_ID,
        version: DATA_VERSION,
        data: {
          classicStats: classicStatsData,
          classicGame: classicGameData,
          quoteStats: quoteStatsData,
          quoteGame: quoteGameData,
          // NOVO: Inclui dados do Modo Ataque
          attackStats: attackStatsData,
          attackGame: attackGameData,
        },
      };

      // 4. Cria o blob JSON e força o download
      const jsonString = JSON.stringify(exportObject, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      // Nome do arquivo atualizado para refletir o backup completo
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

  // ==============================
  // 2. IMPORTAR DADOS (ATUALIZADO)
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
      // Apenas checa se o objeto 'data' existe
      if (!importedObject.data) {
         return { success: false, message: t('import_export_error_corrupted') };
      }
      
      // ===================================
      // ATUALIZAÇÃO 3: Injeção de TODOS os dados
      // ===================================
      // Lista de todos os dados a serem importados
      const keysToImport = [
        { key: CLASSIC_STATS_KEY, data: importedObject.data.classicStats },
        { key: CLASSIC_GAME_KEY, data: importedObject.data.classicGame },
        { key: QUOTE_STATS_KEY, data: importedObject.data.quoteStats },
        { key: QUOTE_GAME_KEY, data: importedObject.data.quoteGame },
        // NOVO: Inclui o Modo Ataque
        { key: ATTACK_STATS_KEY, data: importedObject.data.attackStats },
        { key: ATTACK_GAME_KEY, data: importedObject.data.attackGame },
      ];

      // Itera e injeta no localStorage
      // Se a data for 'null' ou 'undefined' no JSON, remove a chave do localStorage
      for (const item of keysToImport) {
        if (item.data) { // Se a string de dados existir (não null ou undefined)
          localStorage.setItem(item.key, item.data);
        } else { // Se for null ou undefined no arquivo
          localStorage.removeItem(item.key);
        }
      }
      
      // 4. Forçar reidratação do Zustand/Recarregar App
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