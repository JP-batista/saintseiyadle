// src/app/classico/components/FeedbackCell.tsx
import React from "react";

type FeedbackCellProps = {
  status: string; // "green", "red", "up", "down", "ignore"
  value: string;
  isLatest: boolean;
  animationDelay: number;
};

const FeedbackCell: React.FC<FeedbackCellProps> = ({ status, value, isLatest, animationDelay }) => {
  // O seu código original trata 'up' e 'down' como "errado"
  const isCorrect = status === "green";
  const iconSrc = isCorrect ? "/dle_feed/certo.png" : "/dle_feed/errado.png";
  
  // Você poderia adicionar lógica aqui para ícones "up" e "down" se quisesse
  // Ex: if (status === 'up') iconSrc = '/dle_feed/up.png';
  // Ex: if (status === 'down') iconSrc = '/dle_feed/down.png';

  return (
    <div
      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="relative group">
        {isCorrect && (
          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
        )}
        <img
          src={iconSrc}
          alt="Feedback"
          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
            isCorrect
              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110 hover:shadow-green-500/50"
              : "border-2 border-gray-600/50 hover:scale-105"
          }`}
        />
      </div>
      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
        {value}
      </span>
    </div>
  );
};

export default FeedbackCell;