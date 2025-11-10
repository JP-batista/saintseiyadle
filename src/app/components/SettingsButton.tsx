"use client";
import React, { memo, useState } from "react";
import { X, Database } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
import ImportExportModal from "./ImportExportModal"; 

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModalComponent: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          backdrop-gradient backdrop-blur-custom border border-gray-700/50 
          rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto 
          custom-scrollbar flex flex-col transform scale-100 animate-fadeInUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-yellow-500/50 flex justify-between items-center sticky top-0 bg-gray-900/90 z-10">
          <h3 className="text-2xl font-bold text-yellow-400">
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

        <div className="p-4 sm:p-6 text-left space-y-4 text-gray-300">
          <button
            onClick={() => setIsDataModalOpen(true)}
            className="w-full flex items-center justify-between p-4 bg-gray-800/70 border border-gray-700/50 rounded-xl transition-all duration-300 hover:bg-gray-700/80 hover:border-yellow-500/50"
          >
            <span className="flex items-center font-semibold text-white">
              <Database className="w-5 h-5 mr-3 text-yellow-400" />
              {t("data_modal_title")}
            </span>
            <span className="text-gray-400 text-sm">»</span>
          </button>
        </div>
        
        <div className="p-4 sm:p-6 border-t border-gray-700/50 sticky bottom-0 bg-gray-900/90 z-10">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 py-2 rounded-lg font-bold hover:from-yellow-600 transition duration-300"
          >
            {t("stats_button_close")}
          </button>
        </div>
      </div>

      <ImportExportModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
};

export default memo(SettingsModalComponent);