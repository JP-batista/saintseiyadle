// srcapp/classicc/components/FeedbackCell.tsx
import React, { memo, useMemo } from "react";
import { useTranslation } from "../../i18n/useTranslation"; // Importa o hook

type FeedbackCellProps = {
  status: string;
  value: string;
  isLatest: boolean;
  animationDelay: number;
};

const FeedbackCell: React.FC<FeedbackCellProps> = ({
  status,
  value,
  isLatest,
  animationDelay,
}) => {
  const { t } = useTranslation(); // Instancia a tradução
  const isCorrect = status === "green";

  // OTIMIZAÇÃO: Memoização do valor de 'iconSrc'.
  const iconSrc = useMemo(() => {
    switch (status) {
      case "green":
        return "/dle_feed/certo.png";
      case "up":
        return "/dle_feed/mais.png";
      case "down":
        return "/dle_feed/menos.png";
      case "red":
      case "ignore":
      default:
        return "/dle_feed/errado.png";
    }
  }, [status]);

  return (
    <div
      className="flex flex-col items-center gap-2 attempt-row-enhanced transform-gpu will-change-transform"
      style={{
        animationDelay: `${animationDelay}s`,
        contain: "layout style paint",
      }}
    >
      <div className="relative group">
        {isCorrect && (
          <div className="absolute inset-0 rounded-xl blur-lg animate-pulse-success" />
        )}
        <img
          src={iconSrc}
          // I18N: Traduzido o texto alternativo
          alt={t('feedback_icon_alt')} 
          loading="eager"
          decoding="async"
          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
            isCorrect
              ? "border-2 border-green-500 correct-indicator-enhanced c"
              : status === "up" || status === "down"
              ? "border-2 border-gray-600/50"
              : "border-2 border-gray-600/50"
          }`}
        />
      </div>
      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
        {value} {/* O valor já vem traduzido do array de dados */}
      </span>
    </div>
  );
};

export default memo(FeedbackCell);