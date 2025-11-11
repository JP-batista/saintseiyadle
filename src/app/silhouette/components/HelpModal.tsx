// src/app/silhouette/components/HelpModal.tsx
"use client";

import React, { memo } from "react";
import { X, ZoomIn, Eye, ShieldAlert } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModalComponent: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          bg-gray-900/90 border border-gray-700/50 rounded-2xl shadow-2xl 
          w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col 
          transform scale-100 animate-fadeInUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-yellow-500/50 flex justify-between items-center sticky top-0 bg-gray-900/90 z-10">
          <h3 className="text-2xl font-bold text-yellow-400">
            {t("help_modal_title")}
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
          
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <Eye className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-yellow-400">
                {t('silhouette_help_objective_title')}
              </h4>
              <p>{t('silhouette_help_objective_desc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <ZoomIn className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-yellow-400">
                {t('silhouette_help_how_title')}
              </h4>
              <p>{t('silhouette_help_how_desc')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <ShieldAlert className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-yellow-400">
                 {t("silhouette_help_controls_title")}
              </h4>
              <p>{t("silhouette_help_toggle_zoom_desc")}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <ShieldAlert className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-yellow-400">
                 {t("silhouette_help_no_hints_title")}
              </h4>
              <p>{t("silhouette_help_no_hints_desc")}</p>
            </div>
          </div>
          
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
    </div>
  );
};

export default memo(HelpModalComponent);