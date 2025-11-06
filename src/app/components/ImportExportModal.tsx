"use client";
import React, { memo, useState, useRef } from "react";
import { X, Upload, Download, Check, AlertTriangle, Disc } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
// Certifique-se de que o caminho abaixo esteja correto no seu projeto!
import { useDataImportExport } from "../hooks/useDataImportExport"; 

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tipo para mensagens de feedback
type Feedback = {
  success: boolean;
  message: string;
} | null;

const ImportExportModalComponent: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { exportData, importData } = useDataImportExport();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // ======================================
  // 1. Lógica de Exportação (Download)
  // ======================================
  const handleExport = () => {
    setFeedback(null);
    const result = exportData();
    
    if (result.success) {
      setFeedback({ success: true, message: t('export_success') });
    } else {
      setFeedback({ success: false, message: result.message || t('import_export_error_generic') });
    }
  };
  
  // ======================================
  // 2. Lógica de Importação (Upload)
  // ======================================
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const result = await importData(file);
      
      // A importação bem-sucedida recarrega a página (via router.refresh ou window.reload),
      // então este bloco só é atingido em caso de falha de validação/parse.
      if (result.success) {
          // Se for sucesso, a página já recarregou, o código aqui não deve ser atingido.
          // Colocamos um feedback de precaução caso o refresh seja bloqueado.
          setFeedback({ success: true, message: t('import_success_reload') });
      } else {
          setFeedback({ success: false, message: result.message || t('import_export_error_generic') });
      }
    } catch (error) {
        setFeedback({ success: false, message: t('import_export_error_parse') });
    } finally {
        setIsLoading(false);
        // Limpa o input file para permitir importações subsequentes do mesmo arquivo
        if (fileInputRef.current) {
             fileInputRef.current.value = '';
        }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // ======================================
  // Renderização
  // ======================================

  const renderFeedback = () => {
    if (!feedback) return null;
    
    const Icon = feedback.success ? Check : AlertTriangle;
    const color = feedback.success ? "text-green-400 border-green-700/50" : "text-red-400 border-red-700/50";

    return (
      <div className={`flex items-center p-3 mt-4 rounded-lg border bg-gray-800/70 ${color} animate-fadeInUp`}>
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-200">
          {feedback.message}
        </span>
      </div>
    );
  };
  
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          backdrop-gradient backdrop-blur-custom border border-gray-700/50 
          rounded-2xl shadow-2xl w-full max-w-sm max-h-[95vh] sm:max-h-[90vh] 
          overflow-y-auto custom-scrollbar flex flex-col
          transform scale-100 animate-fadeInUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-yellow-500/50 flex justify-between items-center sticky top-0 bg-gray-900/90 z-10">
          <h3 className="text-xl font-bold text-yellow-400">
            {t("data_modal_title")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:rotate-90"
            aria-label={t("stats_button_close")}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-left space-y-5 text-gray-300">
          {renderFeedback()}
          
          {/* Exportar Dados */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white flex items-center">
              <Download className="w-5 h-5 mr-2 text-yellow-400" />
              {t("export_title")}
            </h4>
            <p className="text-sm text-gray-400">{t("export_desc")}</p>
            <button
              onClick={handleExport}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {t("export_button")}
            </button>
          </div>

          <div className="border-t border-gray-700/50 pt-5 space-y-3">
            {/* Importar Dados */}
            <h4 className="text-lg font-bold text-white flex items-center">
              <Upload className="w-5 h-5 mr-2 text-yellow-400" />
              {t("import_title")}
            </h4>
            <p className="text-sm text-gray-400">{t("import_desc")}</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
              disabled={isLoading}
            />
            
            <button
              onClick={handleImportClick}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Disc className="w-5 h-5 mr-2 animate-spin" />
                  {t("import_loading")}
                </>
              ) : (
                t("import_button")
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-700/50 sticky bottom-0 bg-gray-900/90 z-10">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 py-2 rounded-lg font-bold hover:from-yellow-600 transition duration-300"
          >
            {t("stats_button_close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ImportExportModalComponent);
