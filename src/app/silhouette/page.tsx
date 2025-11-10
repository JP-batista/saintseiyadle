// src/app/silhouette/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// Stores
import { useSilhouetteGameStore } from "../stores/useSilhouetteGameStore";
import { useSilhouetteStatsStore } from "../stores/useSilhouetteStatsStore";

// Hooks
import { useDailySilhouette } from "../hooks/useDailySilhouette";
import { useTranslation } from "../i18n/useTranslation";
import { getArmorData } from "../i18n/config";
import {
  getNextMidnightInBrazil,
  formatTimeRemaining,
} from "../utils/dailyGame";

// Tipos
import { Armor, Attempt } from "./types"; 

// Componentes Globais
import Logo from "../components/Logo";
import GameModeButtons from "../components/GameModeButtons";
import StatsBar from "../components/StatsBar";
import VictoryEffects from "../components/VictoryEffects";
import StatsModal from "../components/StatsModal";
import NewsModal from "../components/NewsModal";
import LoadingSpinner from "../components/LoadingSpinner";

// Componentes Específicos do Modo
import SilhouetteDisplay from "./components/SilhouetteDisplay";
import SilhouetteAttempts from "./components/SilhouetteAttempts";
import ResultCard from "./components/ResultCard";
import HelpModal from "./components/HelpModal";
import YesterdaySilhouette from "./components/YesterdaySilhouette";
//
// ⬇️⬇️⬇️ 1. IMPORTAR O NOVO FORMULÁRIO ⬇️⬇️⬇️
//
import SilhouetteGuessForm from "./components/SilhouetteGuessForm";

const INITIAL_ZOOM_LEVEL = 3;

export default function SilhouettePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // 1. DADOS E STORES
  const allArmors = useMemo(() => {
    const dataModule = getArmorData(locale);
    return ((dataModule as any).default as Armor[]) || [];
  }, [locale]);

  // (allArmorNames não é mais necessário aqui, pois o filtro usa allArmors)

  // Store do Jogo Diário
  const {
    selectedArmor,
    attempts,
    won,
    gaveUp,
    currentGameDate,
    attemptZoomLevel,
    autoDecreaseActive,
    addAttempt,
    setWon,
    setGaveUp,
    toggleAutoDecrease,
  } = useSilhouetteGameStore();

  // Store de Estatísticas
  const { addGameResult, getGameByDate, currentStreak } = useSilhouetteStatsStore();

  // Hook de Inicialização
  const { isInitialized } = useDailySilhouette();

  // 2. ESTADOS DA UI
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  //
  // ⬇️⬇️⬇️ 2. ATUALIZAR TIPO DAS SUGESTÕES ⬇️⬇️⬇️
  //
  const [suggestions, setSuggestions] = useState<Armor[]>([]); // Mudar de string[] para Armor[]
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const resultCardRef = useRef<HTMLDivElement | null>(null);

  // 3. LÓGICA DE JOGO
  const currentZoomLevel = useMemo(() => {
    if (!autoDecreaseActive) {
      return INITIAL_ZOOM_LEVEL;
    }
    return attemptZoomLevel;
  }, [autoDecreaseActive, attemptZoomLevel]);

  // (Efeitos de Contagem, Mudança de Dia, Vitória e Salvar Jogo permanecem idênticos)
  // Efeito: Contagem regressiva
  useEffect(() => {
    const updateCountdown = () => {
      const nextMidnight = getNextMidnightInBrazil();
      setTimeRemaining(formatTimeRemaining(nextMidnight));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Efeito: Verifica mudança de dia
  useEffect(() => {
    const checkDayChange = () => {
      const todayDate = new Date().toISOString().split('T')[0];
      if (currentGameDate && currentGameDate !== todayDate) {
        router.refresh(); 
      }
    };
    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, [currentGameDate, router]);

  // Efeito: Efeitos de vitória e scroll
  useEffect(() => {
    if (won && !gaveUp && attempts.length > 0) {
      setShowVictoryEffects(true);
      const scrollTimer = setTimeout(() => {
        resultCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
      return () => clearTimeout(scrollTimer);
    }
  }, [won, gaveUp, attempts.length]);

  // Efeito: Salva o resultado no store de estatísticas
  useEffect(() => {
    if (
      (won || gaveUp) &&
      currentGameDate &&
      attempts.length > 0 &&
      selectedArmor
    ) {
      const existingGame = getGameByDate(currentGameDate);
      if (!existingGame) {
        addGameResult(
          currentGameDate,
          attempts.length,
          won && !gaveUp,
          selectedArmor.name,
          selectedArmor.revealedImg,
          selectedArmor.knight
        );
      }
    }
  }, [
    won,
    gaveUp,
    currentGameDate,
    attempts,
    addGameResult,
    getGameByDate,
    selectedArmor,
  ]);

  // 4. HANDLERS DO FORMULÁRIO
  
  const normalizeText = useCallback((text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }, []);

  //
  // ⬇️⬇️⬇️ 3. ATUALIZAR HANDLEINPUTCHANGE ⬇️⬇️⬇️
  //
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      setError(null);

      // Começa a buscar com 1 letra
      if (value.length >= 1) { 
        const normalizedValue = normalizeText(value);
        const alreadyTried = new Set(attempts.map((a) => normalizeText(a.name)));

        // Filtra a lista completa de ARMADURAS
        const filtered = allArmors
          .filter((armor) => !alreadyTried.has(normalizeText(armor.name)))
          .filter((armor) => normalizeText(armor.name).includes(normalizedValue));
        
        setSuggestions(filtered.slice(0, 5)); // Salva os objetos Armor[]
        setShowDropdown(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    },
    [allArmors, attempts, normalizeText]
  );

  //
  // ⬇️⬇️⬇️ 4. ATUALIZAR HANDLESUBMITGUESS ⬇️⬇️⬇️
  // (A lógica de clique foi movida para dentro do GuessForm)
  //
  const handleSubmitGuess = (guessName: string) => {
    if (!selectedArmor) return;

    // Normaliza o nome recebido do componente
    const normalizedGuess = normalizeText(guessName);
    const normalizedAnswer = normalizeText(selectedArmor.name);

    // Validação 1: O nome existe?
    // (O formulário já deve garantir isso, mas é uma boa checagem)
    const isValidName = allArmors.some(name => normalizeText(name.name) === normalizedGuess);
    if (!isValidName) {
      setError(t('form_error_not_found')); 
      return;
    }

    // Validação 2: Já foi tentado?
    const alreadyTried = attempts.some(a => normalizeText(a.name) === normalizedGuess);
    if (alreadyTried) {
      setError(t('form_error_already_tried')); 
      // Limpa o input mesmo se já tentou
      setInput("");
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Processar tentativa
    const newAttempt: Attempt = { name: guessName.trim() };
    addAttempt(newAttempt);

    // Acertou?
    if (normalizedGuess === normalizedAnswer) {
      setWon(true);
    }

    // Limpar
    setInput("");
    setSuggestions([]);
    setShowDropdown(false);
    setError(null);
  };


  // 5. RENDERIZAÇÃO

  if (!isInitialized || !selectedArmor) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6 pt-20 sm:pt-24">
      {showVictoryEffects && (
        <VictoryEffects
          isActive={true}
          onComplete={() => setShowVictoryEffects(false)}
        />
      )}

      {/* Modais */}
      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        mode="silhouette"
      />
      <NewsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
      />
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <Logo />
      <GameModeButtons />

      <StatsBar
        currentStreak={currentStreak}
        onShowStats={() => setShowStatsModal(true)}
        onShowNews={() => setIsNewsModalOpen(true)}
        onShowHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Conteúdo do Jogo (Antes de vencer) */}
      {!won && !gaveUp && (
        <>
          <SilhouetteDisplay
            imgSrc={selectedArmor.silhouetteImg}
            altText={t('silhouette_alt_text')} 
            currentZoomLevel={currentZoomLevel}
            autoDecreaseActive={autoDecreaseActive}
            onToggleAutoDecrease={toggleAutoDecrease}
          />

          {/* // ⬇️⬇️⬇️ 5. SUBSTITUIR O FORMULÁRIO ⬇️⬇️⬇️
          //
          // O <form> antigo foi removido
          */}
          <SilhouetteGuessForm
            input={input}
            onInputChange={handleInputChange}
            suggestions={suggestions}
            showDropdown={showDropdown}
            onSubmit={handleSubmitGuess}
            error={error}
          />
          
          {/* A mensagem de erro agora é renderizada DENTRO do SilhouetteGuessForm */}

          <SilhouetteAttempts attempts={attempts} allArmors={allArmors} />
          
          <div className="mt-8 w-full max-w-md">
            <YesterdaySilhouette />
          </div>
        </>
      )}

      {/* Jogo Finalizado (Vitória/Derrota) */}
      {(won || gaveUp) && (
        <>
          {/* Mostra a silhueta no estado final */}
          <SilhouetteDisplay
            imgSrc={selectedArmor.silhouetteImg}
            altText={t('silhouette_alt_text')} 
            currentZoomLevel={currentZoomLevel}
            autoDecreaseActive={autoDecreaseActive}
            onToggleAutoDecrease={toggleAutoDecrease}
          />
          
          <SilhouetteAttempts attempts={attempts} allArmors={allArmors} />

          <ResultCard
            cardRef={resultCardRef}
            isWin={won && !gaveUp}
            selectedArmor={selectedArmor}
            attemptsCount={attempts.length}
            timeRemaining={timeRemaining}
            onShowStats={() => setShowStatsModal(true)}
          />
          
        </>
      )}

    </div>
  );
}