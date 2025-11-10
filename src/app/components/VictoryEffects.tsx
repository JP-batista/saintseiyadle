// src/components/VictoryEffects.tsx
"use client";

import { useEffect, useState, memo } from 'react';

interface VictoryEffectsProps {
  isActive: boolean;
  onComplete?: () => void;
}

const VictoryEffectsComponent = ({ isActive, onComplete }: VictoryEffectsProps) => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    id: number;
    left: number;
    color: string;
    delay: number;
    duration: number;
  }>>([]);

  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) return;

    const confettiColors = [
      '#fbbf24',
      '#f59e0b', 
      '#ef4444',
      '#3b82f6', 
      '#10b981', 
      '#8b5cf6', 
    ];

    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 1,
    }));

    setConfettiPieces(newConfetti);

    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 1.5,
    }));

    setSparkles(newSparkles);

    const timer = setTimeout(() => {
      setConfettiPieces([]);
      setSparkles([]);
      onComplete?.();
    }, 3500);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <>
      <div className="confetti-container">
        {confettiPieces.map((piece) => (
          <div
            key={`confetti-${piece.id}`}
            className="confetti"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="sparkle-container">
        {sparkles.map((sparkle) => (
          <div
            key={`sparkle-${sparkle.id}`}
            className="sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default memo(VictoryEffectsComponent);