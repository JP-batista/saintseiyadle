// src/app/quote/page.tsx
"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import React from 'react';

import { useQuoteGameStore } from '../stores/useQuoteGameStore';
import { useDailyQuote } from '../hooks/useDailyQuote';
import { useQuoteStatsStore } from '../stores/useQuoteStatsStore'; 

import { useTranslation } from '../i18n/useTranslation';
import { useLocaleStore } from '../stores/useLocaleStore';
import { quoteDataMap } from '../i18n/config'; 
import { getCurrentDateInBrazil, formatTimeRemaining, getNextMidnightInBrazil } from '../utils/dailyGame';

import { Character } from '../classic/types'; 
import { CharacterWithQuotes } from '../i18n/types';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';
import StatsBar from '../components/StatsBar';
import HintBlock from '../classic/components/HintBlock';
import GuessForm from '../classic/components/GuessForm';
import ResultCard from './components/ResultCard';
import VictoryEffects from '../components/VictoryEffects';
import StatsModal from '../components/StatsModal';
import NewsModal from '../components/NewsModal';
import HelpModal from './components/HelpModal';
import QuoteAttemptsList from './components/QuoteAttempts'; 
import GameModeButtons from '../components/GameModeButtons';
import YesterdayQuote from './components/YesterdayQuote';

import ShareSection from "./components/ShareSection";

const QuoteDisplay = React.memo(({ text }: { text: string }) => {
  return (
    <div className="w-full max-w-xl text-center mb-8 animate-fadeInUp">
      <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-6">
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 italic">
          &ldquo;{text}&rdquo;
        </p>
      </div>
    </div>
  );
});
QuoteDisplay.displayName = 'QuoteDisplay';

export default function QuoteGamePage() {
  const { t, locale } = useTranslation();

  const allCharacters = useMemo(() => {
    const dataModule = quoteDataMap[locale] || quoteDataMap['pt'];
    return (dataModule as any).default as CharacterWithQuotes[] || [];
  }, [locale]);

  const { isInitialized, selectedQuote, won: dailyWon } = useDailyQuote();
  
  const {
    attempts,
    won,
    gaveUp,
    addAttempt,
    setWon,
  } = useQuoteGameStore();

  const { currentStreak, addGameResult, getGameByDate } = useQuoteStatsStore(); // Adicionado getGameByDate

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  // 1. A 'characteristicsRef' foi renomeada para 'resultCardRef' para clareza
  const resultCardRef = useRef<HTMLDivElement | null>(null);

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState("00:00:00");

  useEffect(() => {
    const updateTimer = () => {
      const nextMidnight = getNextMidnightInBrazil();
      setTimeRemaining(formatTimeRemaining(nextMidnight));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  //
  // ⬇️⬇️⬇️ CORREÇÃO APLICADA AQUI ⬇️⬇️⬇️
  //
  // 2. Efeito para rolar a tela para o ResultCard ao vencer
  useEffect(() => {
    if (won && !gaveUp && attempts.length > 0) {
      const scrollTimer = setTimeout(() => {
        resultCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500); // Atraso de 500ms para a animação de vitória começar
      return () => clearTimeout(scrollTimer);
    }
  }, [won, gaveUp, attempts.length]);
  // ⬆️⬆️⬆️ FIM DA CORREÇÃO ⬆️⬆️⬆️

  // Efeito para salvar o resultado (corrigido para não salvar repetidamente)
  useEffect(() => {
    if ((won || gaveUp) && selectedQuote && attempts.length > 0) {
      const today = getCurrentDateInBrazil();
      const existingGame = getGameByDate(today);

      if (!existingGame) {
        addGameResult(
          today,
          attempts.length, // Usamos o tamanho atual
          won && !gaveUp,
          selectedQuote.character.nome,
          selectedQuote.character.imgSrc,
          selectedQuote.character.idKey,
          selectedQuote.quote.texts,
          selectedQuote.quote.idQuote
        );
      }
    }
  }, [won, gaveUp, selectedQuote, attempts.length, addGameResult, getGameByDate]);
  

  const attemptedIdKeys = useMemo(() => {
    return new Set(attempts.map(a => a.idKey));
  }, [attempts]); 
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError(null);
    setActiveSuggestionIndex(-1);

    if (value.length > 0) {
      const filtered = allCharacters
        .filter((c) => c.nome.toLowerCase().includes(value.toLowerCase()))
         .filter((c) => !attemptedIdKeys.has(c.idKey))
        .slice(0, 5); 
      setSuggestions(filtered as Character[]);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [allCharacters, attemptedIdKeys]);

  const processGuess = (guessName: string) => {
    if (!selectedQuote) return; 

    const guessedCharacter = allCharacters.find(
      (c) => c.nome.toLowerCase() === guessName.toLowerCase()
    );

    if (!guessedCharacter) {
      setError(t('form_error_not_found'));
      setShowDropdown(false);
      return;
    }

    if (attempts.find((a) => a.idKey === guessedCharacter.idKey)) {
      setError(t('form_error_already_tried'));
      setShowDropdown(false);
      return;
    }

    addAttempt(guessedCharacter);

    if (guessedCharacter.idKey === selectedQuote.character.idKey) {
      setWon(true);
      // A lógica de salvar o resultado foi movida para o useEffect
    } 
    setInput('');
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.length === 0) return;

    if (suggestions.length > 0 && activeSuggestionIndex === -1) {
      const selectedName = suggestions[0].nome;
      setInput(selectedName);
      processGuess(selectedName);
    } else if (activeSuggestionIndex > -1) {
      const selectedName = suggestions[activeSuggestionIndex].nome;
      setInput(selectedName);
      processGuess(selectedName);
    } else {
      processGuess(input);
    }
  };

  const handleSuggestionClick = (idKey: string) => {
    const suggestion = allCharacters.find((c) => c.idKey === idKey);
    if (suggestion) {
      setInput(suggestion.nome); 
      processGuess(suggestion.nome); 
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (activeSuggestionIndex > -1) {
        const selectedName = suggestions[activeSuggestionIndex].nome;
        setInput(selectedName);
        processGuess(selectedName);
      } else if (suggestions.length > 0) {
        const selectedName = suggestions[0].nome;
        setInput(selectedName);
        processGuess(selectedName);
      } else {
        processGuess(input);
      }
      return; 
    }

    if (e.key === 'Escape') {
      setShowDropdown(false);
      return;
    }

    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    }
  };

  if (!isInitialized || !selectedQuote) {
    return <LoadingSpinner />;
  }

  const { dica1, dica2 } = selectedQuote.quote;

  return (
    <div className="relative overflow-hidden min-h-screen py-12">
      <VictoryEffects isActive={won} />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        mode="quote" 
      />
      <NewsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
      />
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8 md:py-12">

        <Logo />
        <div>
          <GameModeButtons />
        </div>

        <StatsBar
          currentStreak={currentStreak} // Vindo do useQuoteStatsStore
          onShowStats={() => setIsStatsModalOpen(true)} // Vindo do estado local
          onShowNews={() => setIsNewsModalOpen(true)}
          onShowHelp={() => setIsHelpModalOpen(true)}
        />

        <HintBlock
          attemptsCount={attempts.length}
          dica1={dica1}
          dica2={dica2}
        />

        {!won && !gaveUp ? (
          <div className="w-full flex flex-col items-center">
            <QuoteDisplay text={selectedQuote.quote.texts} />
            
            <GuessForm
              onSubmit={handleSubmit}
              input={input}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              suggestions={suggestions}
              showDropdown={showDropdown && !error}
              onSuggestionClick={handleSuggestionClick}
            />
            {error && !showDropdown && (
              <div className="relative w-full max-w-md -mt-4 mb-8">
                <div className="absolute left-0 right-0 p-3 bg-red-800/90 backdrop-blur-md border border-red-500/50 rounded-xl shadow-2xl text-center text-white font-semibold animate-shake-error">
                  {error}
                </div>
              </div>
            )}
            
            <QuoteAttemptsList attempts={attempts} />

            <div className="mt-6">
              <YesterdayQuote />
            </div>
            
          </div>

        ) : (
          <div className="w-full flex flex-col items-center">
            <QuoteDisplay text={selectedQuote.quote.texts} />
            
            <QuoteAttemptsList attempts={attempts} />

            <ResultCard
              cardRef={resultCardRef} // 3. Passa a ref para o ResultCard
              isWin={won && !gaveUp}
              selectedCharacter={selectedQuote.character as Character}
              attemptsCount={attempts.length}
              timeRemaining={timeRemaining}
              onShowStats={() => setIsStatsModalOpen(true)}
            />
            
            <ShareSection
              attemptsCount={attempts.length}
              isWin={won && !gaveUp}
            />

            <div className="mt-6">
              <YesterdayQuote />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}