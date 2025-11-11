// src/app/silhouette/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSilhouetteGameStore } from "../stores/useSilhouetteGameStore";
import { useSilhouetteStatsStore } from "../stores/useSilhouetteStatsStore";
import { useDailySilhouette } from "../hooks/useDailySilhouette";
import { useTranslation } from "../i18n/useTranslation";
import { getArmorData } from "../i18n/config";
import {
  getNextMidnightInBrazil,
  formatTimeRemaining,
} from "../utils/dailyGame";
import { Armor, Attempt } from "./types"; 
import Logo from "../components/Logo";
import GameModeButtons from "../components/GameModeButtons";
import StatsBar from "../components/StatsBar";
import VictoryEffects from "../components/VictoryEffects";
import StatsModal from "../components/StatsModal";
import NewsModal from "../components/NewsModal";
import LoadingSpinner from "../components/LoadingSpinner";
import SilhouetteDisplay from "./components/SilhouetteDisplay";
import SilhouetteAttempts from "./components/SilhouetteAttempts";
import ResultCard from "./components/ResultCard";
import HelpModal from "./components/HelpModal";
import YesterdaySilhouette from "./components/YesterdaySilhouette";
import SilhouetteGuessForm from "./components/SilhouetteGuessForm";

const INITIAL_ZOOM_LEVEL = 3;

export default function SilhouettePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  const allArmors = useMemo(() => {
    const dataModule = getArmorData(locale);
    return ((dataModule as any).default as Armor[]) || [];
  }, [locale]);

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

  const { addGameResult, getGameByDate, currentStreak } = useSilhouetteStatsStore();

  const { isInitialized } = useDailySilhouette();

  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Armor[]>([]); 
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const resultCardRef = useRef<HTMLDivElement | null>(null);

  const currentZoomLevel = useMemo(() => {
    if (!autoDecreaseActive) {
      return INITIAL_ZOOM_LEVEL;
    }
    return attemptZoomLevel;
  }, [autoDecreaseActive, attemptZoomLevel]);

  useEffect(() => {
    const updateCountdown = () => {
      const nextMidnight = getNextMidnightInBrazil();
      setTimeRemaining(formatTimeRemaining(nextMidnight));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

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
  
  const normalizeText = useCallback((text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      setError(null);

      if (value.length >= 1) { 
        const normalizedValue = normalizeText(value);
        const alreadyTried = new Set(attempts.map((a) => normalizeText(a.name)));

        const filtered = allArmors
          .filter((armor) => !alreadyTried.has(normalizeText(armor.name)))
          .filter((armor) => normalizeText(armor.name).includes(normalizedValue));
        
        setSuggestions(filtered.slice(0, 5)); 
        setShowDropdown(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    },
    [allArmors, attempts, normalizeText]
  );

  const handleSubmitGuess = (guessName: string) => {
    if (!selectedArmor) return;

    const normalizedGuess = normalizeText(guessName);
    const normalizedAnswer = normalizeText(selectedArmor.name);

    const isValidName = allArmors.some(name => normalizeText(name.name) === normalizedGuess);
    if (!isValidName) {
      setError(t('form_error_not_found')); 
      return;
    }

    const alreadyTried = attempts.some(a => normalizeText(a.name) === normalizedGuess);
    if (alreadyTried) {
      setError(t('form_error_already_tried')); 
      setInput("");
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const newAttempt: Attempt = { name: guessName.trim() };
    addAttempt(newAttempt);

    if (normalizedGuess === normalizedAnswer) {
      setWon(true);
    }

    setInput("");
    setSuggestions([]);
    setShowDropdown(false);
    setError(null);
  };

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

      {!won && !gaveUp && (
        <>
          <SilhouetteDisplay
            imgSrc={selectedArmor.silhouetteImg}
            altText={t('silhouette_alt_text')} 
            currentZoomLevel={currentZoomLevel}
            autoDecreaseActive={autoDecreaseActive}
            onToggleAutoDecrease={toggleAutoDecrease}
          />

          <SilhouetteGuessForm
            input={input}
            onInputChange={handleInputChange}
            suggestions={suggestions}
            showDropdown={showDropdown}
            onSubmit={handleSubmitGuess}
            error={error}
          />
          
          <SilhouetteAttempts attempts={attempts} allArmors={allArmors} />
          
          <div className="mt-8 w-full max-w-md">
            <YesterdaySilhouette />
          </div>
        </>
      )}

      {(won || gaveUp) && (
        <>
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