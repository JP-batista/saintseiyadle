"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';

// --- Imports dos Hooks e Stores Específicos do Modo Ataque ---
import { useAttackGameStore } from '../stores/useAttackGameStore';
import { useAttackStatsStore } from '../stores/useAttackStatsStore'; 
import { useDailyAttack } from '../hooks/useDailyAttack'; 

// --- Imports de Hooks e Stores Globais ---
import { useTranslation } from '../i18n/useTranslation';
import { getAttackData } from '../i18n/config'; 
import { getCurrentDateInBrazil, formatTimeRemaining, getNextMidnightInBrazil } from '../utils/dailyGame';

// --- Imports de Tipos e Componentes ---
import { Attack, SelectedAttack, CharacterWithAttacks } from '../i18n/types';
import LoadingSpinner from '../classic/components/LoadingSpinner';
import Logo from '../classic/components/Logo';
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


export default function AttackGamePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // --- 1. DADOS DE ATAQUES (Flattened) ---
  const allAttacks = useMemo(() => {
    // A função getAttackData já faz o fallback para 'pt' se o locale não existir
    const dataModule = getAttackData(locale);
    
    // Funcao auxiliar para achatar os dados (copiada do useDailyAttack)
    const flattenAttackData = (dataModule: any): SelectedAttack[] => {
      const charactersWithAttacks = (dataModule as any).default as CharacterWithAttacks[] || [];
      const allAttacks: SelectedAttack[] = [];

      for (const character of charactersWithAttacks) {
          const characterInfo = {
              idKey: character.idKey,
              nome: character.nome,
              patente: character.patente,
              imgSrc: character.imgSrc,
              titulo: character.titulo, // Adicionado para consistência, se existir
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


  // --- 2. STORES E ESTADOS ---
  const {
    selectedAttack,
    attempts,
    won,
    gaveUp,
    currentGameDate,
    addAttempt,
    setWon,
    setGaveUp,
  } = useAttackGameStore();

  const { addGameResult, getGameByDate, currentStreak } = useAttackStatsStore();

  // Use o hook de lógica diária
  const { isInitialized } = useDailyAttack();

  // Ref para scrollar a tela em caso de vitória
  const characteristicsRef = useRef<HTMLDivElement | null>(null);

  // Estados da UI
  const [selectedSuggestion, setSelectedSuggestion] = useState<Attack | null>(null);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Attack[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados dos Modais (Controlados pela Page)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // --- 3. EFEITOS DE CONTAGEM E VITÓRIA ---
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
        // Força recarregar para rodar a lógica de reset do useDailyAttack
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

  // --- 4. EFEITO DE SALVAR O RESULTADO ---
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
  
  // --- 5. LÓGICA DE SUBMISSÃO ---
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Validação básica
      if (!input.trim() || !selectedSuggestion || !selectedAttack) return;
      
      // Checa se o nome do golpe sugerido é o correto
      const correct = selectedSuggestion.name.toLowerCase() === selectedAttack.attack.name.toLowerCase();
      
      // Checa se já tentou
      if (attempts.some((attempt) => attempt.attackName.toLowerCase() === input.trim().toLowerCase())) {
        setError(t("form_error_already_tried"));
        setInput("");
        setShowDropdown(false);
        return;
      }
      
      // Cria a tentativa (apenas o nome é salvo, pois não há comparação de atributos)
      const attempt: { attackName: string } = {
        attackName: selectedSuggestion.name,
      };

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
      input,
      selectedSuggestion,
      selectedAttack,
      attempts,
      addAttempt,
      setWon,
      t,
    ]
  );
  
  // --- 6. LÓGICA DE INPUT E SUGESTÕES ---
  const normalizeText = useCallback((text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .toLowerCase();
  }, []);

  const getFilteredSuggestions = useCallback(
    (value: string): Attack[] => {
      const normalizedValue = normalizeText(value);
      const alreadyTried = new Set(attempts.map((a) => normalizeText(a.attackName)));
      
      // Lista todos os ataques (aplanados) para o locale atual
      const allPossibleAttacks = allAttacks.map(a => a.attack);

      return allPossibleAttacks
        .filter(
          (attack) =>
            !alreadyTried.has(normalizeText(attack.name)) && 
            normalizeText(attack.name).includes(normalizedValue)
        )
        .slice(0, 5);
    },
    [attempts, normalizeText, allAttacks]
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
        
        // Seta a primeira sugestão para navegação com setas
        setSelectedSuggestion(filteredSuggestions[0] || null); 
      } else {
        setSuggestions([]);
        setShowDropdown(false);
        setSelectedSuggestion(null);
      }
    },
    [getFilteredSuggestions]
  );

  const handleSuggestionClick = useCallback(
    (idAttack: string) => {
      const attack = allAttacks.map(a => a.attack).find((a) => a.idAttack === idAttack);

      if (attack) {
        setInput(attack.name);
        setSelectedSuggestion(attack);
        setShowDropdown(false);
        setError(null);
      }
    },
    [allAttacks]
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


  // --- 7. RENDERIZAÇÃO ---
  if (!isInitialized || !selectedAttack || allAttacks.length === 0) {
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
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        mode="attack" // MODO ATAQUE
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

      {/* Stats Bar */}
      <StatsBar
        currentStreak={currentStreak}
        onShowStats={() => setIsStatsModalOpen(true)}
        onShowNews={() => setIsNewsModalOpen(true)}
        onShowHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Display do GIF (Visível em todos os estados) */}
      <AttackDisplay
        gifSrc={selectedAttack.attack.gifSrc}
        attackName={selectedAttack.attack.name}
        isWonOrGaveUp={won || gaveUp}
      />

      {!won && !gaveUp ? (
        // --- Estado: Jogo em Andamento ---
        <div className="w-full flex flex-col items-center">
          
          <AttackGuessForm
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
          
          <AttackAttemptsList attempts={attempts} />

          <div className="mt-6">
            <YesterdayAttack />
          </div>
          
        </div>

      ) : (
        // --- Estado: Jogo Finalizado (Vitória ou Desistência) ---
        <div className="w-full flex flex-col items-center">
          
          <AttackAttemptsList attempts={attempts} />

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