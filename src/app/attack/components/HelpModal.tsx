"use client";

import React, { memo } from "react";
import { X, Brain, Target, SlidersHorizontal, Info } from "lucide-react";
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
            <Target className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-yellow-400">
                {t('attack_help_objective_title')}
              </h4>
              <p>{t('attack_help_objective_desc')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <Brain className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-yellow-400">
                {t('attack_help_how_title')}
              </h4>
              <p>{t('attack_help_how_desc')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <SlidersHorizontal className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-yellow-400">
                 {t("attack_help_controls_title")}
              </h4>
              <p className="mb-2">{t("attack_help_controls_desc")}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>{t("attack_toggle_blur")}:</strong> {t("attack_help_toggle_blur_desc")}
                </li>
                 <li>
                  <strong>{t("attack_toggle_color")}:</strong> {t("attack_help_toggle_color_desc")}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <Info className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-yellow-400">
                 {t("attack_help_no_hints_title")}
              </h4>
              <p>{t("attack_help_no_hints_desc")}</p>
            </div>
          </div>
          
          <p className="pt-2 text-sm italic text-gray-400">{t("help_footer_tip")}</p>
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