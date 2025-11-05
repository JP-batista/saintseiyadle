// src/app/classico/components/AttemptRow.tsx
import React from "react";
import { AttemptComparison } from "../types";
import FeedbackCell from "./FeedbackCell"; // O próximo componente
import CharacterCell from "./CharacterCell"; // O próximo componente

type AttemptRowProps = {
  attempt: AttemptComparison;
  isLatest: boolean;
  animationDelay: number;
};

const AttemptRow: React.FC<AttemptRowProps> = ({ attempt, isLatest, animationDelay }) => {
  const { guessCharacter } = attempt;
  
  // Mapeamento para facilitar a renderização
  const feedbackData = [
    { status: attempt.genero, value: guessCharacter.genero },
    { status: attempt.idade, value: guessCharacter.idade },
    { status: attempt.altura, value: guessCharacter.altura },
    { status: attempt.peso, value: guessCharacter.peso },
    { status: attempt.signo, value: guessCharacter.signo },
    { status: attempt.patente, value: guessCharacter.patente },
    { status: attempt.exercito, value: guessCharacter.exercito },
    { status: attempt.localDeTreinamento, value: guessCharacter.localDeTreinamento },
    { status: attempt.saga, value: guessCharacter.saga || 'N/A' }, // Tratando saga opcional
  ];

  return (
    <React.Fragment>
      {/* Coluna 1: Personagem */}
      <CharacterCell
        imgSrc={attempt.imgSrc}
        nome={attempt.nome}
        isLatest={isLatest}
        animationDelay={animationDelay}
      />

      {/* Colunas 2-10: Feedback */}
      {feedbackData.map((data, index) => (
        <FeedbackCell
          key={index}
          status={data.status}
          value={data.value}
          isLatest={isLatest}
          animationDelay={animationDelay}
        />
      ))}
    </React.Fragment>
  );
};

export default AttemptRow;