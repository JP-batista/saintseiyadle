// src/app/classico/components/AttemptRow.tsx
import React, { useMemo, memo } from "react"; // Importa useMemo e memo
import { AttemptComparison } from "../types";
import FeedbackCell from "./FeedbackCell";
import CharacterCell from "./CharacterCell";

type AttemptRowProps = {
  attempt: AttemptComparison;
  isLatest: boolean;
  animationDelay: number;
};

// Renomeado para component base
const AttemptRowComponent: React.FC<AttemptRowProps> = ({
  attempt,
  isLatest,
  animationDelay,
}) => {
  const { guessCharacter } = attempt;

  // OTIMIZAÇÃO 2: useMemo
  // O array agora só é criado uma vez por componente,
  // a menos que 'attempt' ou 'guessCharacter' mudem.
  const feedbackData = useMemo(
    () => [
      // OTIMIZAÇÃO 3: Chave estável adicionada
      { key: "genero", status: attempt.genero, value: guessCharacter.genero },
      { key: "idade", status: attempt.idade, value: guessCharacter.idade },
      { key: "altura", status: attempt.altura, value: guessCharacter.altura },
      { key: "peso", status: attempt.peso, value: guessCharacter.peso },
      { key: "signo", status: attempt.signo, value: guessCharacter.signo },
      { key: "patente", status: attempt.patente, value: guessCharacter.patente },
      { key: "exercito", status: attempt.exercito, value: guessCharacter.exercito },
      {
        key: "localDeTreinamento",
        status: attempt.localDeTreinamento,
        value: guessCharacter.localDeTreinamento,
      },
      {
        key: "saga",
        status: attempt.saga,
        value: guessCharacter.saga || "N/A",
      },
    ],
    [attempt, guessCharacter] // Dependências do useMemo
  );

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
      {feedbackData.map((data) => (
        <FeedbackCell
          key={data.key} // OTIMIZAÇÃO 3: Usando a chave estável
          status={data.status}
          value={data.value}
          isLatest={isLatest}
          animationDelay={animationDelay}
        />
      ))}
    </React.Fragment>
  );
};

// OTIMIZAÇÃO 1: React.memo
// Impede a re-renderização desta linha se suas props não mudarem.
export const AttemptRow = memo(AttemptRowComponent);
export default AttemptRow;