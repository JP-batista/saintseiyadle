import React, { memo } from "react";

type CharacterCellProps = {
  imgSrc: string;
  nome: string;
  isLatest: boolean;
  animationDelay: number;
};

const CharacterCellComponent: React.FC<CharacterCellProps> = ({
  imgSrc,
  nome,
  isLatest,
  animationDelay,
}) => {
  return (
    <div
      className="flex flex-col items-center gap-2 attempt-row-enhanced transform-gpu will-change-transform"
      style={{
        animationDelay: `${animationDelay}s`,
        contain: 'layout style paint'
      }}
    >
      <div className="relative group">
        {isLatest && (
          <div className="absolute inset-0 rounded-xl blur-xl animate-pulse-glow" />
        )}
        <img
          src={imgSrc}
          alt={nome}
          loading="eager"
          decoding="async"
          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 border-gray-600/50 shadow-lg transition-all duration-300 hover:shadow-2xl"
        />
      </div>
      <span className="text-[10px] sm:text-xs md:text-sm text-gray-200 font-semibold text-center break-words leading-tight max-w-[80px] sm:max-w-none">
        {nome}
      </span>
    </div>
  );
};

export default memo(CharacterCellComponent);
