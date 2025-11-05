// src/components/VictoryEffects.tsx
"use client";
// OTIMIZAÇÃO 2: Importado 'memo'
import { useEffect, useState, memo } from 'react';

interface VictoryEffectsProps {
  isActive: boolean;
  onComplete?: () => void;
}

// Renomeado para usar com 'memo'
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

    // Gera confetes
    const confettiColors = [
      '#fbbf24', // amarelo
      '#f59e0b', // laranja
      '#ef4444', // vermelho
      '#3b82f6', // azul
      '#10b981', // verde
      '#8b5cf6', // roxo
    ];

    // OTIMIZAÇÃO 1: Contagem reduzida de 50 para 30
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 1,
    }));

    setConfettiPieces(newConfetti);

    // Gera brilhos
    // OTIMIZAÇÃO 1: Contagem reduzida de 30 para 20
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 1.5,
    }));

    setSparkles(newSparkles);

    // Limpa após 3 segundos
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
      {/* Confetes */}
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

      {/* Brilhos */}
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

// OTIMIZAÇÃO 2: Envolvido com 'memo'
export default memo(VictoryEffectsComponent);