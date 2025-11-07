"use client";

import React, { memo } from "react";
import { X } from "lucide-react";
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
        {/* Header */}
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

        {/* Content */}
        <div className="p-4 sm:p-6 text-left space-y-4 text-gray-300">
          <p>{t("help_rule_1")}</p>

          {/* Indicadores de Cor */}
          <h4 className="font-bold text-lg text-yellow-400 pt-2">
            {t("help_indicators_title")}
          </h4>
          <ul className="space-y-2 pl-4">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">🟢</span>
              {t("help_indicator_green")}
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">🔴</span>
              {t("help_indicator_red")}
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">🔺</span>
              {t("help_indicator_up")}
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">🔻</span>
              {t("help_indicator_down")}
            </li>
          </ul>

          <h4 className="font-bold text-lg text-yellow-400 pt-2">
            {t("help_tips_title")}
          </h4>
          <p>{t("help_rule_2")}</p>

          <p>{t("help_available_hints_msg", { hint1: 3, hint2: 6 })}</p>

          <h4 className="font-bold text-lg text-yellow-400 pt-2">
            {t("help_properties_title")}
          </h4>
          <p className="text-sm text-gray-400">{t("help_properties_intro")}</p>

          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-300">
            <li>
              <strong>{t("prop_gender_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_gender_type")}</span> —{" "}
              {t("prop_gender_desc")}
            </li>

            <li>
              <strong>{t("prop_age_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_age_type")}</span> —{" "}
              {t("prop_age_desc")}
            </li>

            <li>
              <strong>{t("prop_height_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_height_type")}</span> —{" "}
              {t("prop_height_desc")}
            </li>

            <li>
              <strong>{t("prop_weight_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_weight_type")}</span> —{" "}
              {t("prop_weight_desc")}
            </li>

            <li>
              <strong>{t("prop_sign_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_sign_type")}</span> —{" "}
              {t("prop_sign_desc")}
            </li>

            <li>
              <strong>{t("prop_rank_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_rank_type")}</span> —{" "}
              {t("prop_rank_desc")}
            </li>

            <li>
              <strong>{t("prop_army_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_army_type")}</span> —{" "}
              {t("prop_army_desc")}
            </li>

            <li>
              <strong>{t("prop_training_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_training_type")}</span> —{" "}
              {t("prop_training_desc")}
            </li>

            <li>
              <strong>{t("prop_saga_title")}:</strong>{" "}
              <span className="font-semibold">{t("prop_saga_type")}</span> —{" "}
              {t("prop_saga_desc")}
            </li>
          </ul>

          <p className="pt-2 text-sm italic text-gray-400">{t("help_footer_tip")}</p>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-700/50">
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
