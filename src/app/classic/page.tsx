// src/app/classico/page.tsx
"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import React from "react";
import { useGameStore } from "../stores/useGameStore";
import { useStatsStore } from "../stores/useStatsStore";
import StatsModal from "../components/StatsModal";
import { useTranslation } from "../i18n/useTranslation";
import { characterDataMap } from "../i18n/config";
import {
  getCurrentDateInBrazil,
  getNextMidnightInBrazil,
  getDailyCharacter,
  formatTimeRemaining,
} from "../utils/dailyGame";
import VictoryEffects from "../components/VictoryEffects";

// Importe os tipos e componentes
import { Character, AttemptComparison } from "./types";
import LoadingSpinner from "./components/LoadingSpinner";
import Logo from "./components/Logo";
import GameModeButtons from "./components/GameModeButtons";
import StatsBar from "./components/StatsBar";
import HintBlock from "./components/HintBlock";
import GuessForm from "./components/GuessForm";
import AttemptsGrid from "./components/AttemptsGrid";
import ResultCard from "./components/ResultCard";
import GameLegend from "./components/GameLegend";
import { useRouter } from "next/navigation";
// 💥 REMOVIDO: ImportExportModal não é mais gerenciado aqui.

export default function GamePage() {
  const { t, locale } = useTranslation();

  // 1. DADOS LOCALIZADOS: Obtém a lista de personagens baseada no idioma ativo.
  const characters = useMemo(() => {
    const dataModule = characterDataMap[locale] || characterDataMap["pt"];
    return ((dataModule as any).default as Character[]) || [];
  }, [locale]);

  // 2. STORES E ESTADOS
  const {
    selectedCharacter,
    attempts,
    won,
    gaveUp,
    currentGameDate,
    usedCharacterIndices,
    addAttempt,
    setWon,
    resetDailyGame,
    addUsedCharacterIndex,
  } = useGameStore();

  const { addGameResult, getGameByDate, currentStreak } = useStatsStore();
  const characteristicsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Character | null>(null);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  // 💥 REMOVIDO: [showDataModal, setShowDataModal] = useState<boolean>(false);
  const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dica1 = useMemo(() => {
    return attempts.length >= 5 ? selectedCharacter?.dica1 : null;
  }, [attempts.length, selectedCharacter]);

  const dica2 = useMemo(() => {
    return attempts.length >= 10 ? selectedCharacter?.dica2 : null;
  }, [attempts.length, selectedCharacter]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 3. EFEITO DE INICIALIZAÇÃO E DETERMINISMO
  useEffect(() => {
    if (!isClient || !characters.length) return;

    const todayDate = getCurrentDateInBrazil();

    if (currentGameDate !== todayDate || !selectedCharacter) {
      // Seleção determinística baseada apenas na data e no array de personagens
      const { character, index } = getDailyCharacter(
        todayDate,
        characters // Usa o array de dados LOCALIZADO
      );

      resetDailyGame(character, todayDate);

      if (!usedCharacterIndices.includes(index)) {
        addUsedCharacterIndex(index);
      }
    }
  }, [
    isClient,
    currentGameDate,
    selectedCharacter,
    usedCharacterIndices,
    resetDailyGame,
    addUsedCharacterIndex,
    characters,
  ]);

  // ... (Outros useEffects de Contagem, Mudança de Dia e Efeitos de Vitória permanecem os mesmos) ...
  useEffect(() => {
    if (!isClient) return;
    const updateCountdown = () => {
      const nextMidnight = getNextMidnightInBrazil();
      setTimeRemaining(formatTimeRemaining(nextMidnight));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const checkDayChange = () => {
      const todayDate = getCurrentDateInBrazil();
      if (currentGameDate && currentGameDate !== todayDate) {
        router.refresh();
      }
    };
    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, [isClient, currentGameDate, router]);

  useEffect(() => {
    if (won && !gaveUp && attempts.length > 0 && isClient) {
      setShowVictoryEffects(true);
      const scrollTimer = setTimeout(() => {
        characteristicsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
      return () => clearTimeout(scrollTimer);
    }
  }, [won, gaveUp, attempts.length, isClient]);

  // 4. EFEITO DE SALVAR O RESULTADO (Passa o idKey)
  useEffect(() => {
    if (
      (won || gaveUp) &&
      currentGameDate &&
      attempts.length > 0 &&
      selectedCharacter
    ) {
      const existingGame = getGameByDate(currentGameDate);
      if (!existingGame) {
        addGameResult(
          currentGameDate,
          attempts.length,
          won && !gaveUp,
          selectedCharacter.nome,
          selectedCharacter.imgSrc,
          selectedCharacter.idKey
        );
      }
    }
  }, [
    won,
    gaveUp,
    currentGameDate,
    attempts.length,
    addGameResult,
    getGameByDate,
    selectedCharacter,
  ]);

  // ... (Funções de Comparação e Normalização permanecem os mesmos) ...
  const parseHeight = useCallback((height: string): number => {
    if (height.toLowerCase() === "desconhecido") return NaN;
    return parseFloat(height.replace(",", ".").replace(" m", "").trim());
  }, []);

  const compareAge = useCallback((value: string, target: string): string => {
    const valueLower = value.toLowerCase();
    const targetLower = target.toLowerCase();
    if (valueLower === "desconhecida" && targetLower === "desconhecida")
      return "green";
    if (valueLower === "desconhecida" || targetLower === "desconhecida")
      return "red";
    if (valueLower === "imortal" && targetLower === "imortal") return "green";
    if (valueLower === "imortal") return "down";
    if (targetLower === "imortal") return "up";
    const numericValue = parseFloat(value);
    const numericTarget = parseFloat(target);
    if (isNaN(numericValue) || isNaN(numericTarget)) return "red";
    if (numericValue === numericTarget) return "green";
    return numericValue < numericTarget ? "up" : "down";
  }, []);

  const compareWeight = useCallback((value: string, target: string): string => {
    const valueLower = value.toLowerCase();
    const targetLower = target.toLowerCase();
    if (valueLower === "desconhecido" && targetLower === "desconhecido")
      return "green";
    if (valueLower === "desconhecido" || targetLower === "desconhecido")
      return "ignore";
    const numericValue = parseFloat(value);
    const numericTarget = parseFloat(target);
    if (isNaN(numericValue) || isNaN(numericTarget)) return "ignore";
    if (numericValue === numericTarget) return "green";
    return numericValue < numericTarget ? "up" : "down";
  }, []);

  const compareHeight = useCallback(
    (value: string, target: string): string => {
      const valueLower = value.toLowerCase();
      const targetLower = target.toLowerCase();
      if (valueLower === "desconhecida" && targetLower === "desconhecida")
        return "green";
      if (valueLower === "desconhecida" || targetLower === "desconhecida")
        return "red";
      const numericValue = parseHeight(value);
      const numericTarget = parseHeight(target);
      if (isNaN(numericValue) || isNaN(numericTarget)) return "red";
      if (numericValue === numericTarget) return "green";
      return numericValue < numericTarget ? "up" : "down";
    },
    [parseHeight]
  );

  // 5. LÓGICA DE SUBMISSÃO (Usa idKey para checar tentativa repetida)
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim() || !selectedSuggestion || !selectedCharacter) return;

      const guess = characters.find(
        (char: Character) =>
          char.nome.toLowerCase() === selectedSuggestion.nome.toLowerCase()
      );

      if (!guess) {
        setError(t("form_error_not_found"));
        return;
      }

      // CORREÇÃO CRÍTICA DO BUG DE IDIOMA/TENTATIVA REPETIDA
      if (
        attempts.some(
          // Checa se o idKey do palpite já está na lista de tentativas
          (attempt) => attempt.guessCharacter.idKey === guess.idKey
        )
      ) {
        setError(t("form_error_already_tried"));
        setInput("");
        setShowDropdown(false);
        return;
      }

      const correct = guess.nome === selectedCharacter.nome;

      const comparison: AttemptComparison = {
        nome: guess.nome,
        idKey: guess.idKey,
        idade: compareAge(guess.idade, selectedCharacter.idade),
        altura: compareHeight(guess.altura, selectedCharacter.altura),
        peso: compareWeight(guess.peso, selectedCharacter.peso),
        genero: guess.genero === selectedCharacter.genero ? "green" : "red",
        signo: guess.signo === selectedCharacter.signo ? "green" : "red",
        localDeTreinamento:
          guess.localDeTreinamento === selectedCharacter.localDeTreinamento
            ? "green"
            : "red",
        patente: guess.patente === selectedCharacter.patente ? "green" : "red",
        exercito:
          guess.exercito === selectedCharacter.exercito ? "green" : "red",
        saga: guess.saga === selectedCharacter.saga ? "green" : "red",
        imgSrc: guess.imgSrc,
        guessCharacter: guess,
      };

      if (correct) {
        setWon(true);
      }

      addAttempt(comparison);
      setInput("");
      setSuggestions([]);
      setShowDropdown(false);
      setError(null);
    },
    [
      input,
      selectedSuggestion,
      selectedCharacter,
      attempts,
      compareAge,
      compareHeight,
      compareWeight,
      addAttempt,
      setWon,
      t,
      characters,
    ]
  );

  // ... (Outras funções de input e sugestões permanecem os mesmos) ...

  const normalizeText = useCallback((text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .toLowerCase();
  }, []);

  const getFilteredSuggestions = useCallback(
    (value: string) => {
      const normalizedValue = normalizeText(value);
      const alreadyTried = new Set(attempts.map((a) => a.nome.toLowerCase()));

      const filterAndSlice = (filterFn: (char: Character) => boolean) => {
        return characters
          .filter(
            (char) =>
              !alreadyTried.has(char.nome.toLowerCase()) && filterFn(char)
          )
          .slice(0, 5);
      };

      let matches = filterAndSlice((char) =>
        normalizeText(char.nome).startsWith(normalizedValue)
      );
      if (matches.length > 0) return matches;

      matches = filterAndSlice((char) =>
        normalizeText(char.patente).includes(normalizedValue)
      );
      if (matches.length > 0) return matches;

      matches = filterAndSlice(
        (char) =>
          typeof char.titulo === "string" &&
          normalizeText(char.titulo).includes(normalizedValue)
      );
      return matches;
    },
    [attempts, normalizeText, characters]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      setError(null);

      if (value.length >= 1) {
        const filteredSuggestions = getFilteredSuggestions(value);
        setSuggestions(filteredSuggestions);
        setShowDropdown(filteredSuggestions.length > 0);
        setSelectedSuggestion(filteredSuggestions[0] || null);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
        setSelectedSuggestion(null);
      }
    },
    [getFilteredSuggestions]
  );

  // 6. HANDLER DE SUGESTÃO (Usa idKey para localizar no array 'characters')
  const handleSuggestionClick = useCallback(
    (idKey: string) => {
      const suggestion = characters.find((c) => c.idKey === idKey);

      if (suggestion) {
        setInput(suggestion.nome);
        setSelectedSuggestion(suggestion);
        setShowDropdown(false);
        setError(null);
      }
    },
    [characters]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestions.length) return;
      let newIndex: number;
      const currentIndex = suggestions.findIndex(
        (s) => s === selectedSuggestion
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        newIndex = (currentIndex + 1) % suggestions.length;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        newIndex =
          (currentIndex - 1 + suggestions.length) % suggestions.length;
      } else {
        return;
      }

      setSelectedSuggestion(suggestions[newIndex]);
    },
    [suggestions, selectedSuggestion]
  );

  // Renderização
  if (!isClient || !selectedCharacter || !characters.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6 pt-20 sm:pt-24"> {/* Ajuste o padding-top para compensar botões fixos */}
      {showVictoryEffects && (
        <VictoryEffects
          isActive={true}
          onComplete={() => setShowVictoryEffects(false)}
        />
      )}

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
      />
      
      {/* 💥 REMOVIDO: ImportExportModal não é mais renderizado aqui */}

      <Logo />

      <GameModeButtons />

      <StatsBar
        currentStreak={currentStreak}
        onShowStats={() => setShowStatsModal(true)}
        onShowNews={() => {
          /* Modal de novidades em breve! */
        }}
        onShowHelp={() => {
          /* Modal de 'Como Jogar' em breve! */
        }}
        // 💥 REMOVIDO: Prop onShowData não é mais passado para StatsBar
      />

      <HintBlock
        attemptsCount={attempts.length}
        dica1={dica1}
        dica2={dica2}
      />

      {!won && !gaveUp ? (
        <>
          {/* Jogo em andamento */}
          <GuessForm
            onSubmit={handleSubmit}
            input={input}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            suggestions={suggestions}
            showDropdown={showDropdown && !error}
            onSuggestionClick={handleSuggestionClick}
          />
          {/* Renderiza o erro no lugar do dropdown */}
          {error && !showDropdown && (
            <div className="relative w-full max-w-md -mt-4 mb-8">
              <div className="absolute left-0 right-0 p-3 bg-red-800/90 backdrop-blur-md border border-red-500/50 rounded-xl shadow-2xl text-center text-white font-semibold animate-shake-error">
                {error}
              </div>
            </div>
          )}
          <AttemptsGrid attempts={attempts} gridRef={null} />
          <GameLegend />
        </>
      ) : (
        <>
          {/* Jogo finalizado */}
          <AttemptsGrid attempts={attempts} gridRef={null} />
          <ResultCard
            cardRef={characteristicsRef}
            isWin={won && !gaveUp}
            selectedCharacter={selectedCharacter}
            attemptsCount={attempts.length}
            timeRemaining={timeRemaining}
            onShowStats={() => setShowStatsModal(true)}
          />
        </>
      )}
    </div>
  );
}