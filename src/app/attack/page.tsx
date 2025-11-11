"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAttackGameStore } from '../stores/useAttackGameStore';
import { useAttackStatsStore } from '../stores/useAttackStatsStore'; 
import { useDailyAttack } from '../hooks/useDailyAttack'; 
import { useTranslation } from '../i18n/useTranslation';
import { getAttackData } from '../i18n/config'; 
import { getCurrentDateInBrazil, formatTimeRemaining, getNextMidnightInBrazil } from '../utils/dailyGame';
// MODIFICADO: Importa CharacterBaseInfo
import { SelectedAttack, CharacterWithAttacks, CharacterBaseInfo } from '../i18n/types';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';
import StatsBar from '../components/StatsBar';
import VictoryEffects from '../components/VictoryEffects';
import StatsModal from '../components/StatsModal';
import NewsModal from '../components/NewsModal';
import HelpModal from './components/HelpModal';
import GameModeButtons from '../components/GameModeButtons';
import AttackDisplay from './components/AttackDisplay';
import AttackResultCard from './components/AttackResultCard';
// MODIFICADO: Importa o novo AttackGuessForm
import AttackGuessForm from './components/AttackGuessForm'; 
import AttackAttemptsList from './components/AttackAttemptsList';
import YesterdayAttack from './components/YesterdayAttack';


export default function AttackGamePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // 'allAttacks' (fonte da verdade)
  const allAttacks = useMemo(() => {
    const dataModule = getAttackData(locale);
    
    const flattenAttackData = (dataModule: any): SelectedAttack[] => {
      const charactersWithAttacks = (dataModule as any).default as CharacterWithAttacks[] || [];
      const allAttacks: SelectedAttack[] = [];

      for (const character of charactersWithAttacks) {
          const characterInfo: CharacterBaseInfo = { 
              idKey: character.idKey,
              nome: character.nome,
              patente: character.patente,
              imgSrc: character.imgSrc,
              titulo: character.titulo,
          };
          for (const attack of character.attacks) {
              allAttacks.push({
                attack: {
                  idAttack: attack.idAttack,
                  name: attack.name,
                  gifSrc: attack.gifSrc,
                },
                character: characterInfo,
              });
          }
      }
      return allAttacks;
    };

    return flattenAttackData(dataModule);
  }, [locale]);

  // 'allCharacters' (para sugestões)
  const allCharacters = useMemo(() => {
    const charMap = new Map<string, CharacterBaseInfo>();
    allAttacks.forEach((item) => {
      if (!charMap.has(item.character.idKey)) {
        charMap.set(item.character.idKey, item.character);
      }
    });
    return Array.from(charMap.values());
  }, [allAttacks]);


  const {
    selectedAttack,
    attempts, // É CharacterBaseInfo[]
    won,
    gaveUp,
    currentGameDate,
    addAttempt,
    setWon,
    setGaveUp,
  } = useAttackGameStore();
  const { addGameResult, getGameByDate, currentStreak } = useAttackStatsStore();
  const { isInitialized } = useDailyAttack();
  const characteristicsRef = useRef<HTMLDivElement | null>(null);
  
  // Estado para sugestões de Personagem
  const [selectedSuggestion, setSelectedSuggestion] = useState<CharacterBaseInfo | null>(null);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CharacterBaseInfo[]>([]);
  
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // ... (useEffect para countdown - sem alteração)
  useEffect(() => {
    if (!isInitialized) return;
    const updateCountdown = () => {
      const nextMidnight = getNextMidnightInBrazil();
      setTimeRemaining(formatTimeRemaining(nextMidnight));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isInitialized]);

  // ... (useEffect para checkDayChange - sem alteração)
  useEffect(() => {
    if (!isInitialized) return;
    const checkDayChange = () => {
      const todayDate = getCurrentDateInBrazil();
      if (currentGameDate && currentGameDate !== todayDate) {
        router.refresh(); 
      }
    };
    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, [isInitialized, currentGameDate, router]);

  // ... (useEffect para showVictoryEffects - sem alteração)
  useEffect(() => {
    if (won && !gaveUp && attempts.length > 0 && isInitialized) {
      setShowVictoryEffects(true);
      const scrollTimer = setTimeout(() => {
        characteristicsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
      return () => clearTimeout(scrollTimer);
    }
  }, [won, gaveUp, attempts.length, isInitialized]);

  // ... (useEffect para addGameResult - sem alteração)
  useEffect(() => {
    if (
      (won || gaveUp) &&
      currentGameDate &&
      attempts.length > 0 &&
      selectedAttack
    ) {
      const existingGame = getGameByDate(currentGameDate);
      if (!existingGame) {
        addGameResult(
          currentGameDate,
          attempts.length,
          won && !gaveUp,
          selectedAttack.attack.name,
          selectedAttack.attack.idAttack,
          selectedAttack.character.nome,
          selectedAttack.character.imgSrc,
          selectedAttack.character.idKey,
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
    selectedAttack,
  ]);
  
  // REVERTIDO: Lógica do handleSubmit (depende de 'selectedSuggestion')
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Verifica 'selectedSuggestion'
      if (!selectedSuggestion || !selectedAttack) return;
      
      const correct = selectedSuggestion.idKey === selectedAttack.character.idKey;
      
      if (attempts.some((attempt) => attempt.idKey === selectedSuggestion.idKey)) {
        setError(t("form_error_already_tried_character")); 
        setInput("");
        setShowDropdown(false);
        return;
      }
      
      const attempt: CharacterBaseInfo = selectedSuggestion;

      if (correct) {
        setWon(true);
      }

      addAttempt(attempt); 
      setInput("");
      setSuggestions([]);
      setShowDropdown(false);
      setError(null);
    },
    [
      selectedSuggestion, // Depende de selectedSuggestion
      selectedAttack,
      attempts,
      addAttempt,
      setWon,
      t,
    ]
  );
  
  const normalizeText = useCallback((text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .toLowerCase();
  }, []);

  // Lógica de getFilteredSuggestions (igual)
  const getFilteredSuggestions = useCallback(
    (value: string): CharacterBaseInfo[] => {
      const normalizedValue = normalizeText(value);
      const alreadyTried = new Set(attempts.map((a) => a.idKey));
      
      return allCharacters
        .filter(
          (character) =>
            !alreadyTried.has(character.idKey) && 
            normalizeText(character.nome).includes(normalizedValue)
        )
        .slice(0, 5); 
    },
    [attempts, normalizeText, allCharacters] 
  );
  
  // Lógica de handleInputChange (igual)
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      setError(null);

      if (value.length >= 1) {
        const filteredSuggestions = getFilteredSuggestions(value);
        setSuggestions(filteredSuggestions);
        setShowDropdown(filteredSuggestions.length > 0);
        
        // Define a *primeira* sugestão como a selecionada (para a lógica antiga)
        setSelectedSuggestion(filteredSuggestions[0] || null);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
        setSelectedSuggestion(null);
      }
    },
    [getFilteredSuggestions]
  );

  // REVERTIDO: 'handleSuggestionClick' agora só atualiza o input
  const handleSuggestionClick = useCallback(
    (idKey: string) => { 
      const character = allCharacters.find((c) => c.idKey === idKey);

      if (character) {
        setInput(character.nome); // Atualiza o input
        setSelectedSuggestion(character); // Define o personagem
        setShowDropdown(false);
        setError(null);
      }
    },
    [allCharacters] 
  );

  // REVERTIDO: 'handleKeyDown' (lógica do modo Clássico)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestions.length || !showDropdown) return;

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
      } else if (e.key === "Enter") {
         e.preventDefault(); 
         // A lógica de submissão está no 'AttackGuessForm' (via 'useEffect')
         // Aqui, apenas garantimos que a sugestão ativa seja selecionada
         if (selectedSuggestion) {
            handleSuggestionClick(selectedSuggestion.idKey);
         }
         return;
      } else {
        return;
      }
      
      setSelectedSuggestion(suggestions[newIndex]);
    },
    [suggestions, selectedSuggestion, showDropdown, handleSuggestionClick]
  );


  if (!isInitialized || !selectedAttack || allCharacters.length === 0) {
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
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        mode="attack"
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
        onShowStats={() => setIsStatsModalOpen(true)}
        onShowNews={() => setIsNewsModalOpen(true)}
        onShowHelp={() => setIsHelpModalOpen(true)}
      />

      <AttackDisplay
        gifSrc={selectedAttack.attack.gifSrc}
        attackName={selectedAttack.attack.name}
        isWonOrGaveUp={won || gaveUp}
      />

      {!won && !gaveUp ? (
        <div className="w-full flex flex-col items-center">
          
          <AttackGuessForm
            onSubmit={handleSubmit}
            input={input}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown} // Passa o handler de setas/Enter
            suggestions={suggestions} 
            showDropdown={showDropdown && !error}
            onSuggestionClick={handleSuggestionClick} // Passa o handler de clique
          />
          {error && !showDropdown && (
            <div className="relative w-full max-w-md -mt-4 mb-8">
              <div className="absolute left-0 right-0 p-3 bg-red-800/90 backdrop-blur-md border border-red-500/50 rounded-xl shadow-2xl text-center text-white font-semibold animate-shake-error">
                {error}
              </div>
            </div>
          )}
          
          <AttackAttemptsList 
            attempts={attempts} 
            correctCharacterIdKey={selectedAttack.character.idKey}
          />

          <div className="mt-6">
            <YesterdayAttack />
          </div>
          
        </div>

      ) : (
        <div className="w-full flex flex-col items-center">
          
          <AttackAttemptsList 
            attempts={attempts} 
            correctCharacterIdKey={selectedAttack.character.idKey}
          />

          <AttackResultCard
            cardRef={characteristicsRef}
            isWin={won && !gaveUp}
            selectedAttack={selectedAttack}
            attemptsCount={attempts.length}
            timeRemaining={timeRemaining}
            onShowStats={() => setIsStatsModalOpen(true)}
          />

        </div>
      )}
    </div>
  );
}