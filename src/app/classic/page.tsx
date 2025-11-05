// src/app/classico/page.tsx
"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import characters from "../data/charactersDLE";
import React from "react";
import { useGameStore } from "../stores/useGameStore";
import { useStatsStore } from "../stores/useStatsStore";
import StatsModal from "../components/StatsModal";
import { 
  getCurrentDateInBrazil, 
  getNextMidnightInBrazil, 
  getDailyCharacter,
  formatTimeRemaining 
} from "../utils/dailyGame";
import VictoryEffects from "../components/VictoryEffects";

// Importe os novos tipos e componentes
import { Character, AttemptComparison } from "./types";
import LoadingSpinner from "./components/LoadingSpinner";
import Logo from "./components/Logo";
import GameModeButtons from "./components/GameModeButtons";
import StatsBar from "./components/StatsBar";
import HintBlock from "./components/HintBlock";
import GuessForm from "./components/GuessForm";
import AttemptsGrid from "./components/AttemptsGrid";
import ResultCard from "./components/ResultCard"; 
import GameLegend from "./components/GameLegend"; // <-- Importe o novo componente

export default function GamePage() {
  // ... (Estados, Refs, Stores, e Hooks permanecem os mesmos) ...
  // [SEU CÓDIGO DE ESTADOS, STORES, REFS, HOOKS, ETC.]
  
  // State (Zustand)
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

  // Refs
  const characteristicsRef = useRef<HTMLDivElement | null>(null);
  
  // Estado local
  const [selectedSuggestion, setSelectedSuggestion] = useState<Character | null>(null);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  // Dicas calculadas dinamicamente
  const dica1 = useMemo(() => {
    return attempts.length >= 5 ? selectedCharacter?.dica1 : null;
  }, [attempts.length, selectedCharacter]);

  const dica2 = useMemo(() => {
    return attempts.length >= 10 ? selectedCharacter?.dica2 : null;
  }, [attempts.length, selectedCharacter]);

  // useEffects (permanecem os mesmos)
  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (!isClient) return;
    const todayDate = getCurrentDateInBrazil();
    if (currentGameDate !== todayDate || !selectedCharacter) {
      const { character, index } = getDailyCharacter(
        todayDate,
        characters,
        usedCharacterIndices
      );
      resetDailyGame(character, todayDate);
      addUsedCharacterIndex(index);
    }
  }, [isClient, currentGameDate, selectedCharacter, usedCharacterIndices, resetDailyGame, addUsedCharacterIndex]);

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
        window.location.reload();
      }
    };
    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, [isClient, currentGameDate]);

  useEffect(() => {
    if (won && !gaveUp && attempts.length > 0 && isClient) {
      setShowVictoryEffects(true);
      const scrollTimer = setTimeout(() => {
        characteristicsRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "center"
        });
      }, 500);
      return () => clearTimeout(scrollTimer);
    }
  }, [won, gaveUp, attempts.length, isClient]);

  useEffect(() => {
    if (!isClient) return;
    if ((won || gaveUp) && currentGameDate && attempts.length > 0 && selectedCharacter) {
      const existingGame = getGameByDate(currentGameDate);
      if (!existingGame) {
        addGameResult(
          currentGameDate,
          attempts.length,
          won && !gaveUp,
          selectedCharacter.nome,
          selectedCharacter.imgSrc
        );
      }
    }
  }, [isClient, won, gaveUp, currentGameDate, attempts.length, addGameResult, getGameByDate, selectedCharacter]);
  
  // Funções de Comparação e Handlers (permanecem as mesmas)
  // [SEU CÓDIGO DE FUNÇÕES DE COMPARAÇÃO E HANDLERS]
  const parseHeight = useCallback((height: string): number => {
    if (height.toLowerCase() === "desconhecido") return NaN;
    return parseFloat(height.replace(",", ".").replace(" m", "").trim());
  }, []);

  const compareAge = useCallback((value: string, target: string): string => {
    const valueLower = value.toLowerCase();
    const targetLower = target.toLowerCase();
    if (valueLower === "desconhecida" && targetLower === "desconhecida") return "green";
    if (valueLower === "desconhecida" || targetLower === "desconhecida") return "red";
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
    if (valueLower === "desconhecido" && targetLower === "desconhecido") return "green";
    if (valueLower === "desconhecido" || targetLower === "desconhecido") return "ignore";
    const numericValue = parseFloat(value);
    const numericTarget = parseFloat(target);
    if (isNaN(numericValue) || isNaN(numericTarget)) return "ignore";
    if (numericValue === numericTarget) return "green";
    return numericValue < numericTarget ? "up" : "down";
  }, []);

  const compareHeight = useCallback((value: string, target: string): string => {
    const valueLower = value.toLowerCase();
    const targetLower = target.toLowerCase();
    if (valueLower === "desconhecida" && targetLower === "desconhecida") return "green";
    if (valueLower === "desconhecida" || targetLower === "desconhecida") return "red";
    const numericValue = parseHeight(value);
    const numericTarget = parseHeight(target);
    if (isNaN(numericValue) || isNaN(numericTarget)) return "red";
    if (numericValue === numericTarget) return "green";
    return numericValue < numericTarget ? "up" : "down";
  }, [parseHeight]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !selectedSuggestion || !selectedCharacter) return;
    const guess = characters.find(
      (char: Character) => char.nome.toLowerCase() === selectedSuggestion.nome.toLowerCase()
    );
    if (!guess) {
      alert("Personagem não encontrado!");
      return;
    }
    if (attempts.some((attempt) => attempt.nome.toLowerCase() === guess.nome.toLowerCase())) {
      alert("Você já tentou esse personagem!");
      return;
    }

    const correct = guess.nome === selectedCharacter.nome;

    const comparison: AttemptComparison = {
      nome: guess.nome,
      idade: compareAge(guess.idade, selectedCharacter.idade),
      altura: compareHeight(guess.altura, selectedCharacter.altura),
      peso: compareWeight(guess.peso, selectedCharacter.peso),
      genero: guess.genero === selectedCharacter.genero ? "green" : "red",
      signo: guess.signo === selectedCharacter.signo ? "green" : "red",
      localDeTreinamento:
        guess.localDeTreinamento === selectedCharacter.localDeTreinamento ? "green" : "red",
      patente: guess.patente === selectedCharacter.patente ? "green" : "red",
      exercito: guess.exercito === selectedCharacter.exercito ? "green" : "red",
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
    setSelectedSuggestion(null);
  }, [input, selectedSuggestion, selectedCharacter, attempts, compareAge, compareHeight, compareWeight, addAttempt, setWon]);

  const normalizeText = useCallback((text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .toLowerCase();
  }, []);

  const getFilteredSuggestions = useCallback((value: string) => {
    const normalizedValue = normalizeText(value);
    const alreadyTried = new Set(attempts.map(a => a.nome.toLowerCase()));

    const filterAndSlice = (filterFn: (char: Character) => boolean) => {
      return characters
        .filter(char => !alreadyTried.has(char.nome.toLowerCase()) && filterFn(char))
        .slice(0, 5);
    };

    let matches = filterAndSlice(char => normalizeText(char.nome).startsWith(normalizedValue));
    if (matches.length > 0) return matches;

    matches = filterAndSlice(char => normalizeText(char.patente).includes(normalizedValue));
    if (matches.length > 0) return matches;

    matches = filterAndSlice(char => typeof char.titulo === "string" && normalizeText(char.titulo).includes(normalizedValue));
    return matches;
    
  }, [attempts, normalizeText]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

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
  }, [getFilteredSuggestions]);

  const handleSuggestionClick = useCallback((suggestion: Character) => {
    setInput(suggestion.nome);
    setSelectedSuggestion(suggestion);
    setShowDropdown(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    let newIndex: number;
    const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      newIndex = (currentIndex + 1) % suggestions.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      newIndex = (currentIndex - 1 + suggestions.length) % suggestions.length;
    } else {
      return;
    }
    
    setSelectedSuggestion(suggestions[newIndex]);
    setInput(suggestions[newIndex].nome);
  }, [suggestions, selectedSuggestion]);

  // Renderização
  if (!isClient || !selectedCharacter) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6">
      {showVictoryEffects && (
        <VictoryEffects 
          isActive={true} // Podemos deixar 'true' ou remover, já que o componente só existe se for pra estar ativo
          onComplete={() => setShowVictoryEffects(false)}
        />
      )}

      <StatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} />
      
      <Logo />
      
      <GameModeButtons />

      <StatsBar
        currentStreak={currentStreak}
        onShowStats={() => setShowStatsModal(true)}
        onShowNews={() => alert("Modal de novidades em breve!")}
        onShowHelp={() => alert("Modal de 'Como Jogar' em breve!")}
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
            showDropdown={showDropdown}
            onSuggestionClick={handleSuggestionClick}
          />
          <AttemptsGrid
            attempts={attempts}
            gridRef={null}
          />
          {/* Card de Legenda e Navegação aparece abaixo do resultado */}
          <GameLegend />
        </>
      ) : (
        <>
          {/* Jogo finalizado */}
          <AttemptsGrid
            attempts={attempts}
            gridRef={null} 
          />
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