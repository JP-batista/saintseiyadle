"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import React from 'react';

// --- Imports dos Hooks e Stores Específicos do Modo Fala ---
import { useQuoteGameStore } from '../stores/useQuoteGameStore';
import { useDailyQuote } from '../hooks/useDailyQuote';
// 1. ATUALIZAÇÃO: Importar o store de ESTATÍSTICAS do Modo Fala
import { useQuoteStatsStore } from '../stores/useQuoteStatsStore'; 

// --- Imports de Hooks e Stores Globais ---
import { useTranslation } from '../i18n/useTranslation';
import { useLocaleStore } from '../stores/useLocaleStore';
import { quoteDataMap } from '../i18n/config'; 
import { getCurrentDateInBrazil, formatTimeRemaining, getNextMidnightInBrazil } from '../utils/dailyGame';

// --- Imports de Componentes Reutilizados ---
import { Character } from '../classic/types'; 
import { CharacterWithQuotes } from '../i18n/types';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';
// 2. ATUALIZAÇÃO: Corrigir path do StatsBar
import StatsBar from '../components/StatsBar';
import HintBlock from '../classic/components/HintBlock';
import GuessForm from '../classic/components/GuessForm';
import ResultCard from './components/ResultCard';
import VictoryEffects from '../components/VictoryEffects';
import StatsModal from '../components/StatsModal';
import NewsModal from '../components/NewsModal';
import HelpModal from './components/HelpModal';
// import CharacterCell from '../classic/components/CharacterCell'; // <-- REMOVIDO (não mais usado)
import QuoteAttemptsList from './components/QuoteAttempts'; // <-- IMPORTADO A LISTA VERTICAL
import GameModeButtons from '../components/GameModeButtons';
import YesterdayQuote from './components/YesterdayQuote';

// 3. REMOÇÃO: Não precisamos mais do store de stats do Modo Clássico
// import { useStatsStore } from '../stores/useStatsStore'; 
// ----------------------------------------------


// ====================================================================
// Componente 1: Exibidor da Citação (Mantido local)
// ====================================================================
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

// ====================================================================
// Componente 2: Grid de Tentativas (REMOVIDO)
// ====================================================================
// const QuoteAttemptsGrid = React.memo(...) // <-- Bloco removido


// ====================================================================
// Componente Principal: Página do Jogo de Falas
// ====================================================================
export default function QuoteGamePage() {
  const { t, locale } = useTranslation();

  // --- Carregamento de Dados ---
  const allCharacters = useMemo(() => {
    // @ts-ignore
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

  // 4. ATUALIZAÇÃO: Usar o store de ESTATÍSTICAS correto
  const { currentStreak, addGameResult } = useQuoteStatsStore();

  // --- Estados da UI (Sem alteração) ---
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  // ... (outros estados da UI)
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const characteristicsRef = useRef(null);

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

  const attemptedIdKeys = useMemo(() => {
    return new Set(attempts.map(a => a.idKey));
  }, [attempts]); // Recalcula apenas quando 'attempts' mudar
  
  // --- Lógica de Jogo: Input e Sugestões (Sem alteração) ---
  // --- Lógica de Jogo: Input e Sugestões ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError(null);
    setActiveSuggestionIndex(-1);

    if (value.length > 0) {
      const filtered = allCharacters
        .filter((c) => c.nome.toLowerCase().includes(value.toLowerCase()))
          // ===================================
          // CORREÇÃO 2: Adicionar filtro para excluir os IDs já tentados
          // ===================================
          .filter((c) => !attemptedIdKeys.has(c.idKey))
        .slice(0, 5); 
      setSuggestions(filtered as Character[]);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
    // ===================================
    // CORREÇÃO 3: Adicionar 'attemptedIdKeys' ao array de dependências
    // ===================================
  }, [allCharacters, attemptedIdKeys]);

  // --- Lógica de Jogo: Submissão do Palpite ---
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

    // --- Verificação de Vitória ---
    if (guessedCharacter.idKey === selectedQuote.character.idKey) {
      setWon(true);
      
      // 5. ATUALIZAÇÃO: Salvar no store de estatísticas CORRETO
      const today = getCurrentDateInBrazil();
      addGameResult(
        today,
        attempts.length + 1, // +1 pois a tentativa atual não está no array ainda
        true,
        selectedQuote.character.nome,
        selectedQuote.character.imgSrc,
        selectedQuote.character.idKey,
        selectedQuote.quote.texts,
        selectedQuote.quote.idQuote
      );
    } 
    // ... (resto da função sem alteração)
    setInput('');
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.length === 0) return;

    // ===================================
    // CORREÇÃO AQUI (Bug 2)
    // Lógica atualizada para submeter a sugestão principal
    // se ela existir.
    // ===================================
    if (suggestions.length > 0 && activeSuggestionIndex === -1) {
      // Se há sugestões mas nenhuma foi selecionada com as setas,
      // envia a primeira sugestão (a mais provável).
      const selectedName = suggestions[0].nome;
      setInput(selectedName);
      processGuess(selectedName);
    } else if (activeSuggestionIndex > -1) {
      // Se o usuário selecionou com as setas, envia a selecionada
      const selectedName = suggestions[activeSuggestionIndex].nome;
      setInput(selectedName);
      processGuess(selectedName);
    } else {
      // Se não há sugestões, envia o texto bruto
      // (provavelmente resultará em "não encontrado", o que está correto)
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

  // --- Lógica de Jogo: Teclado (Sem alteração) ---
  // --- Lógica de Jogo: Teclado ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    // ===================================
    // CORREÇÃO AQUI (Bug 1 e 2)
    // A lógica do 'Enter' foi movida para cima e melhorada.
    // ===================================
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (activeSuggestionIndex > -1) {
        // Usuário selecionou com as setas
        const selectedName = suggestions[activeSuggestionIndex].nome;
        setInput(selectedName);
        processGuess(selectedName);
      } else if (suggestions.length > 0) {
        // Usuário apertou 'Enter' no input, auto-seleciona a primeira sugestão
        const selectedName = suggestions[0].nome;
        setInput(selectedName);
        processGuess(selectedName);
      } else {
        // Sem sugestões, processa o input bruto (que deve falhar)
        processGuess(input);
      }
      return; // Importante: para a execução aqui
    }

    if (e.key === 'Escape') {
      setShowDropdown(false);
      return;
    }

    // A lógica de setas só funciona se houver sugestões
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    }
  };
  // --- Renderização ---

  if (!isInitialized || !selectedQuote) {
    return <LoadingSpinner />;
  }

  const { dica1, dica2 } = selectedQuote.quote;

  return (
    <div className="relative overflow-hidden min-h-screen py-12">
      <VictoryEffects isActive={won} />

      {/* --- Modais Globais --- */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        mode="quote" // 6. ATUALIZAÇÃO: Passa a prop 'mode'
      />
      <NewsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
      />
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* --- Conteúdo da Página --- */}
      <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8 md:py-12">

        <Logo />
        {/* Botões de modos */}
        <div>
          <GameModeButtons />
        </div>

        {/* 7. ATUALIZAÇÃO: Passa as props corretas para o StatsBar */}
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
          // --- Estado: Jogando ---
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
            
            {/* // ==========================================
                // ATUALIZAÇÃO AQUI: Usa a lista vertical
                // ========================================== */}
            <QuoteAttemptsList attempts={attempts} />

            <div className="mt-6">
              <YesterdayQuote />
            </div>
            
          </div>

        ) : (
          // --- Estado: Jogo Finalizado (Vitória ou Desistência) ---
          <div className="w-full flex flex-col items-center">
            <QuoteDisplay text={selectedQuote.quote.texts} />
            {/* // ==========================================
                // ATUALIZAÇÃO AQUI: Usa a lista vertical
                // ========================================== */}
            <QuoteAttemptsList attempts={attempts} />

            <ResultCard
              cardRef={characteristicsRef}
              isWin={won && !gaveUp}
              selectedCharacter={selectedQuote.character as Character}
              attemptsCount={attempts.length}
              timeRemaining={timeRemaining}
              onShowStats={() => setIsStatsModalOpen(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}