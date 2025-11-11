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
import AttackGuessForm from './components/AttackGuessForm';
import AttackAttemptsList from './components/AttackAttemptsList';
import YesterdayAttack from './components/YesterdayAttack';
import GuessForm from "../classic/components/GuessForm";


export default function AttackGamePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // MODIFICADO: 'allAttacks' (fonte da verdade) e 'allCharacters' (para sugestões)
  const allAttacks = useMemo(() => {
    const dataModule = getAttackData(locale);
    
    const flattenAttackData = (dataModule: any): SelectedAttack[] => {
      const charactersWithAttacks = (dataModule as any).default as CharacterWithAttacks[] || [];
      const allAttacks: SelectedAttack[] = [];

      for (const character of charactersWithAttacks) {
          const characterInfo: CharacterBaseInfo = { // Garante que o tipo CharacterBaseInfo está correto
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

  // MODIFICADO: Cria uma lista de personagens únicos para as sugestões
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
    attempts, // Agora é CharacterBaseInfo[]
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
  
  // MODIFICADO: Estado para sugestões de Personagem
  const [selectedSuggestion, setSelectedSuggestion] = useState<CharacterBaseInfo | null>(null);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CharacterBaseInfo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0); // Para navegação por teclado
  
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

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

  // Lógica de salvar o jogo (permanece a mesma, pois o stats store já salva o personagem)
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
  
  // MODIFICADO: Lógica do handleSubmit para checar o PERSONAGEM
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!input.trim() || !selectedSuggestion || !selectedAttack) return;
      
      // MODIFICADO: Compara o ID do personagem sugerido com o ID do personagem correto
      const correct = selectedSuggestion.idKey === selectedAttack.character.idKey;
      
      // MODIFICADO: Verifica se o PERSONAGEM já foi tentado
      if (attempts.some((attempt) => attempt.idKey === selectedSuggestion.idKey)) {
        // (Use uma nova chave de tradução para "Personagem já tentado")
        setError(t("form_error_already_tried_character")); 
        setInput("");
        setShowDropdown(false);
        return;
      }
      
      // MODIFICADO: 'attempt' agora é o objeto CharacterBaseInfo
      const attempt: CharacterBaseInfo = selectedSuggestion;

      if (correct) {
        setWon(true);
      }

      addAttempt(attempt); // Adiciona o personagem à lista de tentativas
      setInput("");
      setSuggestions([]);
      setShowDropdown(false);
      setError(null);

    },
    [
      input,
      selectedSuggestion,
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

  // MODIFICADO: getFilteredSuggestions para retornar PERSONAGENS
  const getFilteredSuggestions = useCallback(
    (value: string): CharacterBaseInfo[] => {
      const normalizedValue = normalizeText(value);
      // MODIFICADO: 'alreadyTried' agora é um Set de ID-chaves de personagens
      const alreadyTried = new Set(attempts.map((a) => a.idKey));
      
      // MODIFICADO: Filtra a lista 'allCharacters'
      return allCharacters
        .filter(
          (character) =>
            !alreadyTried.has(character.idKey) && // Verifica se já foi tentado
            normalizeText(character.nome).includes(normalizedValue) // Verifica o nome
        )
        .slice(0, 5); // Limita a 5 sugestões
    },
    [attempts, normalizeText, allCharacters] // Usa allCharacters
  );
  
  // MODIFICADO: handleInputChange para lidar com sugestões de Personagem
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      setError(null);

      if (value.length >= 1) {
        const filteredSuggestions = getFilteredSuggestions(value);
        setSuggestions(filteredSuggestions);
        setShowDropdown(filteredSuggestions.length > 0);
        
        // MODIFICADO: Define o primeiro personagem como sugestão ativa
        setSelectedSuggestion(filteredSuggestions[0] || null);
        setActiveIndex(0); // Reseta o índice do teclado
      } else {
        setSuggestions([]);
        setShowDropdown(false);
        setSelectedSuggestion(null);
      }
    },
    [getFilteredSuggestions]
  );

  // MODIFICADO: handleSuggestionClick para lidar com ID de Personagem
  const handleSuggestionClick = useCallback(
    (idKey: string) => { // Recebe idKey
      // MODIFICADO: Procura em 'allCharacters'
      const character = allCharacters.find((c) => c.idKey === idKey);

      if (character) {
        setInput(character.nome);
        setSelectedSuggestion(character); // Define o personagem
        setShowDropdown(false);
        setError(null);
      }
    },
    [allCharacters] // Usa allCharacters
  );

  // MODIFICADO: handleKeyDown para navegação por teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || !suggestions.length) return;
      
      let newIndex = activeIndex;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        newIndex = (activeIndex + 1) % suggestions.length;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        newIndex = (activeIndex - 1 + suggestions.length) % suggestions.length;
      } else if (e.key === "Enter") {
        e.preventDefault();
         if (selectedSuggestion) {
           // Simula o clique na sugestão ativa para submeter
           handleSuggestionClick(selectedSuggestion.idKey);
           // O formulário será submetido pelo 'useEffect' em AttackGuessForm
         }
        return;
      } else {
        return;
      }

      setActiveIndex(newIndex);
      setSelectedSuggestion(suggestions[newIndex]);
    },
    [suggestions, activeIndex, selectedSuggestion, showDropdown, handleSuggestionClick]
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
            onKeyDown={handleKeyDown} // Passa o handler de setas
            suggestions={suggestions} 
            showDropdown={showDropdown && !error}
            onSuggestionClick={handleSuggestionClick} // Passa o handler de clique
            // REVERTIDO: Não passa mais 'activeIndex'
          />
          {error && !showDropdown && (
            <div className="relative w-full max-w-md -mt-4 mb-8">
              <div className="absolute left-0 right-0 p-3 bg-red-800/90 backdrop-blur-md border border-red-500/50 rounded-xl shadow-2xl text-center text-white font-semibold animate-shake-error">
                {error}
              </div>
            </div>
          )}
          
          {/* MODIFICADO: Passa o ID do personagem correto para a lista de tentativas */}
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
          
          {/* MODIFICADO: Passa o ID do personagem correto para a lista de tentativas */}
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