// src/app/classico/components/FeedbackCell.tsx
import React, { memo, useCallback } from "react";

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
  const isCorrect = status === "green";

  const getIconSrc = useCallback(() => {
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

  const iconSrc = getIconSrc();

  return (
    <div
      className="flex flex-col items-center gap-2 attempt-row-enhanced transform-gpu will-change-transform"
      style={{ 
        animationDelay: `${animationDelay}s`,
        contain: 'layout style paint'
      }}
    >
      <div className="relative group">
        {isCorrect && (
          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
        )}
        <img
          src={iconSrc}
          alt="Feedback"
          loading="eager"
          decoding="async"
          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
            isCorrect
              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110 hover:shadow-green-500/50"
              : status === "up" || status === "down"
              ? "border-2 border-gray-600/50 hover:scale-105"
              : "border-2 border-gray-600/50"
          }`}
        />
      </div>
      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
        {value}
      </span>
    </div>
  );
};

export default memo(FeedbackCell, (prevProps, nextProps) => {
  return (
    prevProps.status === nextProps.status &&
    prevProps.value === nextProps.value &&
    prevProps.isLatest === nextProps.isLatest &&
    prevProps.animationDelay === nextProps.animationDelay
  );
});