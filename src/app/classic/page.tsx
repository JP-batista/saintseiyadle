// src/app/classico/page.tsx
"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import characters from "../data/charactersDLE";
import React from "react";
import { useGameStore } from "../stores/useGameStore";
import { useStatsStore } from "../stores/useStatsStore";
import StatsModal from "../components/StatsModal";
import Link from "next/link";
import { 
  getCurrentDateInBrazil, 
  getNextMidnightInBrazil, 
  getDailyCharacter,
  formatTimeRemaining 
} from "../utils/dailyGame";
import VictoryEffects from "../components/VictoryEffects";

type Character = {
  nome: string;
  titulo?: string;
  idade: string;
  altura: string;
  genero: string;
  peso: string;
  signo: string;
  localDeTreinamento: string;
  patente: string;
  exercito: string;
  saga?: string;
  imgSrc: string;
  dica1?: string;
  dica2?: string;
};

export default function GamePage() {
  const {
    selectedCharacter,
    attempts,
    won,
    gaveUp,
    currentGameDate,
    usedCharacterIndices,
    setSelectedCharacter,
    addAttempt,
    setWon,
    setGaveUp,
    setCurrentGameDate,
    addUsedCharacterIndex,
    resetDailyGame,
  } = useGameStore();

  const { addGameResult, getGameByDate, currentStreak } = useStatsStore();

  // Refs
  const characteristicsRef = useRef<HTMLDivElement | null>(null);
  
  // Estado local
  const [selectedSuggestion, setSelectedSuggestion] = useState<Character | null>(null);
  const [showHint1, setShowHint1] = useState<boolean>(false);
  const [showHint2, setShowHint2] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Dicas calculadas dinamicamente
  const dica1 = useMemo(() => {
    return attempts.length >= 5 ? selectedCharacter?.dica1 : null;
  }, [attempts.length, selectedCharacter]);

  const dica2 = useMemo(() => {
    return attempts.length >= 10 ? selectedCharacter?.dica2 : null;
  }, [attempts.length, selectedCharacter]);

  // Marca como cliente após hidratação
  useEffect(() => {
    setIsClient(true);
    setIsLoaded(true);
  }, []);

  // Inicializa jogo diário
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
      
      setShowHint1(false);
      setShowHint2(false);
      setShowAnswer(false);
    }
  }, [isClient, currentGameDate, selectedCharacter, usedCharacterIndices, resetDailyGame, addUsedCharacterIndex]);

  // Countdown timer
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

  // Verifica mudança de dia
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

  // Efeito de vitória
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

  // Salva resultado no histórico
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

  // Funções de comparação (memoizadas)
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

    const comparison = {
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

    const nameMatches = characters.filter(
      (char: Character) =>
        normalizeText(char.nome).startsWith(normalizedValue) && 
        !alreadyTried.has(char.nome.toLowerCase())
    );

    if (nameMatches.length > 0) return nameMatches.slice(0, 5);

    const patenteMatches = characters.filter(
      (char: Character) =>
        normalizeText(char.patente).includes(normalizedValue) && 
        !alreadyTried.has(char.nome.toLowerCase())
    );

    if (patenteMatches.length > 0) return patenteMatches.slice(0, 5);

    const titleMatches = characters.filter(
      (char: Character) =>
        char.titulo &&
        normalizeText(char.titulo).includes(normalizedValue) &&
        !alreadyTried.has(char.nome.toLowerCase())
    );

    return titleMatches.slice(0, 5);
  }, [attempts, normalizeText]);

  const handleGiveUp = useCallback(() => {
    setShowAnswer(true);
    setWon(true);
    setGaveUp(true);
  }, [setWon, setGaveUp]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length >= 2) {
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

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion);
      const nextIndex = (currentIndex + 1) % suggestions.length;
      setSelectedSuggestion(suggestions[nextIndex]);
      setInput(suggestions[nextIndex].nome);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion);
      const prevIndex = (currentIndex - 1 + suggestions.length) % suggestions.length;
      setSelectedSuggestion(suggestions[prevIndex]);
      setInput(suggestions[prevIndex].nome);
    }
  }, [suggestions, selectedSuggestion]);

  // Não renderiza até estar no cliente
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-yellow-400 text-2xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
      <VictoryEffects 
        isActive={showVictoryEffects} 
        onComplete={() => setShowVictoryEffects(false)}
      />

      <StatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} />
      
       {/* Logo com animação de entrada */}
        <div className="flex justify-center items-center mb-2 relative z-10">
          <Link href="/" passHref>
            <img
              src="/dle_feed/logo_dle.png"
              alt="Logo Os Cavaleiros do Zodíaco"
              className={`w-auto h-32 sm:h-40 md:h-32 transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-75 -rotate-12"
              } hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] cursor-pointer`} // Reduzi o hover:scale-110 para 105
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            />
          </Link>
        </div>

      

      {/* Botões de modos - Fundo de "vidro" e animações melhoradas */}
      <div className="
        gap-4 sm:gap-6 
        rounded-xl        /* Bordas mais suaves */
        p-3 
        flex items-center justify-center flex-wrap
      ">
        
        {/* Modo Clássico */}
        <div className="relative group">
          <button
            className="rounded-full w-16 h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate" /* Animação de hover mais divertida */
            onClick={() => window.location.href = "/SaintSeiyaDLE/classic"}
          >
            <img
              src="/dle_feed/classic_icon.png"
              alt="Modo Classic"
              className="
                border-2 border-yellow-500 rounded-full w-full h-full object-contain 
                transition-transform duration-300 
                group-hover:scale-110 
                animate-border-dance  /* Animação de borda que já existia */
                animate-subtle-scale  /* Nova Animação: pulsação sutil constante */
              "
            />
          </button>
          {/* Tooltip: Classes de Tailwind removidas e substituídas pela nova classe CSS */ }
          <div className="glass-tooltip">
            Modo Classic
          </div>
        </div>

        {/* Modo Silhueta (ícone pequeno) */}
        <div className="relative group">
          <button
            className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate" /* Animação de hover mais divertida */
            onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
          >
            <img
              src="/dle_feed/silhouette_icon.png"
              alt="Modo Silhouette"
              className="
                w-full h-full object-contain rounded-lg 
                transition-transform duration-300 
                group-hover:scale-110 
                group-hover:shadow-glow-yellow /* Brilho no hover que já existia */
                animate-subtle-scale         /* Nova Animação: pulsação sutil constante */
              "
            />
          </button>
          {/* Tooltip: Classes de Tailwind removidas e substituídas pela nova classe CSS */ }
          <div className="glass-tooltip">
            Silhuetas
          </div>
        </div>
      </div>

      {/* Assumindo que currentStreak e setShowStatsModal estão disponíveis aqui */}
      <div className="
        backdrop-gradient backdrop-blur-custom 
        border border-gray-700/50 
        rounded-2xl shadow-2xl 
        p-3 sm:p-4 mb-8 
        flex items-center justify-center gap-4 sm:gap-6
        animate-fadeInUp /* Animação de entrada do seu CSS */
      ">
        {/* 1. Estatísticas */}
        <div className="relative group">
          <button
            onClick={() => setShowStatsModal(true)}
            className="
              w-14 h-14 sm:w-16 sm:h-16 
              rounded-full bg-gray-900/50 border-2 border-gray-700/50 
              flex items-center justify-center 
              text-3xl sm:text-4xl
              focus:outline-none transition-ultra-smooth hover-lift-rotate
              group-hover:shadow-glow-yellow group-hover:border-yellow-500/50
            "
          >
            📊
          </button>
          <div className="glass-tooltip">Estatísticas</div>
        </div>

        {/* 2. Sequência Atual */}
      <div className="relative group">
        <div className="
          w-14 h-14 sm:w-16 sm:h-16 
          rounded-full bg-gray-900/50 border-2 border-gray-700/50 
          flex flex-col items-center justify-center 
          transition-all duration-300
          animate-subtle-scale /* Animação de pulsação */
          shadow-glow-yellow   /* Brilho constante para destaque */
        ">
          <span className="text-3xl">🔥</span>
          <span className="font-bold text-yellow-400 text-sm -mt-1">{currentStreak || 0}</span>
        </div>
        <div className="glass-tooltip">Sequência Atual</div>
      </div>    

        {/* 3. Novidades (Notas de Atualização) */}
        <div className="relative group">
          <button
            onClick={() => alert("Modal de novidades em breve!")} // Ação futura
            className="
              w-14 h-14 sm:w-16 sm:h-16 
              rounded-full bg-gray-900/50 border-2 border-gray-700/50 
              flex items-center justify-center 
              text-3xl sm:text-4xl
              focus:outline-none transition-ultra-smooth hover-lift-rotate
              group-hover:shadow-glow-yellow group-hover:border-yellow-500/50
            "
          >
            ✨
          </button>
          <div className="glass-tooltip">Novidades</div>
        </div>

        {/* 4. Como Jogar */}
        <div className="relative group">
          <button
            onClick={() => alert("Modal de 'Como Jogar' em breve!")} // Ação futura
            className="
              w-14 h-14 sm:w-16 sm:h-16 
              rounded-full bg-gray-900/50 border-2 border-gray-700/50 
              flex items-center justify-center 
              text-3xl sm:text-4xl
              focus:outline-none transition-ultra-smooth hover-lift-rotate
              group-hover:shadow-glow-yellow group-hover:border-yellow-500/50
            "
          >
            ❓
          </button>
          <div className="glass-tooltip">Como Jogar</div>
        </div>
      </div>


      {/* Bloco de Dicas - Estilo "Glass" e Interativo */}
      <div className="
        w-full max-w-md 
        backdrop-gradient backdrop-blur-custom 
        border border-gray-700/50             /* Borda sutil */
        text-white rounded-2xl shadow-2xl p-5 sm:p-6 mb-6 /* Consistência de espaçamento e borda */
        animate-fadeInUp                      /* Animação de entrada (do seu CSS) */
      ">
        {/* Título com brilho */}
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 text-yellow-400 tracking-wide animate-text-glow">
          Adivinha qual é a personagem de<br />Saint Seiya
        </h3>
        
        {/* Botões de Dica */}
        <div className="flex justify-between gap-4">
          <div
            onClick={() => attempts.length >= 5 && setShowHint1(!showHint1)} // Previne clique se desabilitado
            className={`
              cursor-pointer flex-1 p-3 text-center border-2 rounded-lg font-bold text-sm 
              transition-all duration-300 transform 
              ${
                attempts.length >= 5
                  ? "border-yellow-500/70 bg-gray-700/80 text-yellow-300 shadow-md shadow-yellow-500/20 hover:bg-yellow-500 hover:text-gray-900 hover:shadow-glow-yellow hover:scale-105 button-press" // Estilo HABILITADO
                  : "border-gray-600/50 bg-gray-800/50 text-gray-500/70 cursor-not-allowed opacity-70" // Estilo DESABILITADO
              }`}
          >
            Dica 1
          </div>

          <div
            onClick={() => attempts.length >= 10 && setShowHint2(!showHint2)} // Previne clique se desabilitado
            className={`
              cursor-pointer flex-1 p-3 text-center border-2 rounded-lg font-bold text-sm 
              transition-all duration-300 transform 
              ${
                attempts.length >= 10
                  ? "border-yellow-500/70 bg-gray-700/80 text-yellow-300 shadow-md shadow-yellow-500/20 hover:bg-yellow-500 hover:text-gray-900 hover:shadow-glow-yellow hover:scale-105 button-press" // Estilo HABILITADO
                  : "border-gray-600/50 bg-gray-800/50 text-gray-500/70 cursor-not-allowed opacity-70" // Estilo DESABILITADO
              }`}
          >
            Dica 2
          </div>
        </div>

        {/* Container para as dicas e contador de tentativas */}
        <div className="mt-4 space-y-3">
          {/* Caixa de Dica 1 (se ativa) */}
          {showHint1 && attempts.length >= 5 && (
            <div 
              className="
                p-3 bg-gray-900/50 backdrop-blur-sm 
                border border-yellow-500/50 /* Borda de destaque */
                rounded-lg text-center text-sm font-semibold text-yellow-300 shadow-lg 
                hint-appear /* Animação de aparição (do seu CSS) */
              "
              key={`hint1-${dica1}`}
            >
              {dica1 || "Nenhuma dica disponível para este personagem."}
            </div>
          )}

          {/* Caixa de Dica 2 (se ativa) */}
          {showHint2 && attempts.length >= 10 && (
            <div 
              className="
                p-3 bg-gray-900/50 backdrop-blur-sm 
                border border-yellow-500/50 
                rounded-lg text-center text-sm font-semibold text-yellow-300 shadow-lg 
                hint-appear
              "
              key={`hint2-${dica2}`}
            >
              {dica2 || "Nenhuma dica disponível para este personagem."}
            </div>
          )}

          {/* Contador de Tentativas Faltantes */}
          <div className="
            p-3 bg-gray-900/50 /* Fundo de 
            border border-gray-700/50 
            rounded-lg text-center text-sm
          ">
            {attempts.length < 5 && (
              <p className="text-gray-300">
                Faltam{" "}
                <span className="font-bold text-yellow-400">{5 - attempts.length}</span>{" "}
                tentativas para a <span className="font-semibold text-yellow-300">Dica 1</span>.
              </p>
            )}
            {attempts.length >= 5 && attempts.length < 10 && (
              <p className="text-gray-300">
                Faltam{" "}
                <span className="font-bold text-yellow-400">{10 - attempts.length}</span>{" "}
                tentativas para a <span className="font-semibold text-yellow-300">Dica 2</span>.
              </p>
            )}
            {attempts.length >= 10 && (
              <p className="text-gray-300">Todas as dicas foram desbloqueadas.</p>
            )}
          </div>
        </div>
      </div>
      
      {!won ? (
        <>
          {/* Form de busca - Estilo "Glass" */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-4 mb-8">
            {/* Wrapper do Input e Dropdown */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Digite o nome do cavaleiro"
                className="
                  p-3.5 sm:p-4 w-full                /* Padding ajustado para altura */
                  text-lg text-center text-gray-100
                  bg-gray-900/50                   /* FUNDO: Efeito de vidro */
                  backdrop-blur-sm                 
                  border-2 border-gray-700/50      /* BORDA: Sutil */
                  rounded-xl                       /* Bordas maiores */
                  placeholder:text-gray-400
                  transition-all duration-300
                  focus:border-yellow-500          /* FOCO: Borda amarela */
                  focus:ring-2 focus:ring-yellow-500/50 /* FOCO: Brilho (glow) */
                  focus:outline-none
                "
              />
              
              {/* Dropdown de Sugestões - Estilo "Glass" */}
              {showDropdown && suggestions.length > 0 && (
                <ul className="
                  absolute left-0 right-0 mt-2 
                  bg-gray-900/80                   /* FUNDO: Vidro mais opaco para legibilidade */
                  backdrop-blur-md                 /* Desfoque mais forte */
                  border border-gray-700/50
                  rounded-xl shadow-2xl            /* Sombra e bordas */
                  max-h-60 overflow-y-auto z-50 
                  custom-scrollbar                 /* Scrollbar customizada (do seu CSS) */
                ">
                  {suggestions.map((suggestion) => (
                    suggestion && (
                      <li
                        key={suggestion.nome}
                        // HOVER: Efeito de hover sutil com borda e cor
                        className="
                          flex items-center p-2.5 m-1 
                          hover:bg-yellow-500/10 
                          hover:border-yellow-500/30
                          border border-transparent
                          rounded-lg 
                          cursor-pointer suggestion-item smooth-transition
                        "
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <img
                          src={suggestion.imgSrc || "/default-image.png"}
                          alt={suggestion.nome || "Sem nome"}
                          className="w-10 h-10 rounded-lg mr-3 shadow-lg" // Sombra na imagem
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-100">{suggestion.nome || "Desconhecido"}</span>
                          <span className="text-xs text-gray-400 italic">{suggestion.titulo || "Sem titulo"}</span>
                        </div>
                      </li>
                    )
                  ))}
                </ul>
              )}
            </div>
            
            {/* Botão "Tentar" - Estilo Gradiente e Brilho */}
            <button
              type="submit"
              className="
                bg-gradient-to-r from-yellow-500 to-orange-500 /* BOTÃO: Gradiente */
                text-gray-900 
                px-5 sm:px-6 py-3.5 sm:py-4            /* Padding ajustado para altura */
                rounded-xl font-bold text-lg sm:text-xl
                transition-all duration-300 
                button-press hover-lift               /* Animações (do seu CSS) */
                hover:from-yellow-600 hover:to-orange-600 
                hover:shadow-glow-yellow              /* Brilho no hover (do seu CSS) */
              "
            >
              Tentar
            </button>
          </form>
















          <div className="w-full px-2 sm:px-4">
            <div className="overflow-x-auto custom-scrollbar">
              {/* Container principal - Fundo transparente com borda sutil */}
              <div className="min-w-[900px] lg:min-w-0 w-full max-w-6xl mx-auto grid grid-cols-10 gap-2 sm:gap-3 bg-gray-900/20 backdrop-blur-sm border border-gray-700/50 p-3 sm:p-5 rounded-2xl shadow-2xl">
                
                {/* Cabeçalhos das colunas - Com animação de entrada */}
                {[
                  "Personagem",
                  "Gênero",
                  "Idade",
                  "Altura",
                  "Peso",
                  "Signo",
                  "Patente",
                  "Exército",
                  "Treinamento",
                  "Saga",
                ].map((header, headerIndex) => (
                  <div
                    key={headerIndex}
                    className="text-center text-yellow-400 font-bold border-b-2 border-yellow-500/50 pb-2 break-words uppercase text-xs sm:text-sm md:text-base animate-fadeInDown"
                    style={{ animationDelay: `${headerIndex * 0.05}s` }}
                  >
                    {header}
                  </div>
                ))}

                {/* Linhas de tentativas com animações elaboradas */}
                {attempts.map((attempt, index) => {
                  // Calcula se é a tentativa mais recente
                  const isLatest = index === 0;
                  
                  return (
                    <React.Fragment key={index}>
                      {/* Coluna 1: Personagem */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {/* Glow effect quando é a tentativa mais recente */}
                          {isLatest && (
                            <div className="absolute inset-0 bg-yellow-500/30 rounded-xl blur-xl animate-pulse-glow" />
                          )}
                          
                          <img
                            src={attempt.imgSrc}
                            alt={attempt.nome}
                            className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 border-gray-600/50 shadow-lg hover:scale-110 hover:border-yellow-500/70 transition-all duration-300 hover:shadow-yellow-500/30 hover:shadow-2xl"
                          />
                          

                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-200 font-semibold text-center break-words leading-tight max-w-[80px] sm:max-w-none">
                          {attempt.nome}
                        </span>
                      </div>

                      {/* Coluna 2: Gênero */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {/* Efeito de brilho para acertos */}
                          {attempt.genero === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={attempt.genero === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.genero === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110 hover:shadow-green-500/50" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.genero}
                        </span>
                      </div>

                      {/* Coluna 3: Idade */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {attempt.idade === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={
                              attempt.idade === "green"
                                ? "/dle_feed/certo.png"
                                : attempt.idade === "up"
                                ? "/dle_feed/mais.png"
                                : attempt.idade === "down"
                                ? "/dle_feed/menos.png"
                                : "/dle_feed/errado.png"
                            }
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.idade === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                          
                          {/* Indicador visual para up/down */}
                          {attempt.idade === "up" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            </div>
                          )}
                          {attempt.idade === "down" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            </div>
                          )}
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.idade}
                        </span>
                      </div>

                      {/* Coluna 4: Altura */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {attempt.altura === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={
                              attempt.altura === "green"
                                ? "/dle_feed/certo.png"
                                : attempt.altura === "up"
                                ? "/dle_feed/mais.png"
                                : attempt.altura === "down"
                                ? "/dle_feed/menos.png"
                                : "/dle_feed/errado.png"
                            }
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.altura === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                          
                          {attempt.altura === "up" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            </div>
                          )}
                          {attempt.altura === "down" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            </div>
                          )}
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.altura}
                        </span>
                      </div>

                      {/* Coluna 5: Peso */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {attempt.peso === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={
                              attempt.peso === "green"
                                ? "/dle_feed/certo.png"
                                : attempt.peso === "up"
                                ? "/dle_feed/mais.png"
                                : attempt.peso === "down"
                                ? "/dle_feed/menos.png"
                                : "/dle_feed/errado.png"
                            }
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.peso === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                          
                          {attempt.peso === "up" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            </div>
                          )}
                          {attempt.peso === "down" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            </div>
                          )}
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.peso}
                        </span>
                      </div>

                      {/* Coluna 6: Signo */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {attempt.signo === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={attempt.signo === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.signo === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.signo}
                        </span>
                      </div>

                      {/* Coluna 7: Patente */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {attempt.patente === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={attempt.patente === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.patente === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.patente}
                        </span>
                      </div>

                      {/* Coluna 8: Exército */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {attempt.exercito === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={attempt.exercito === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.exercito === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.exercito}
                        </span>
                      </div>

                      {/* Coluna 9: Treinamento */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {attempt.localDeTreinamento === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={
                              attempt.localDeTreinamento === "green"
                                ? "/dle_feed/certo.png"
                                : "/dle_feed/errado.png"
                            }
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.localDeTreinamento === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.localDeTreinamento}
                        </span>
                      </div>

                      {/* Coluna 10: Saga */}
                      <div 
                        className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="relative group">
                          {attempt.saga === "green" && (
                            <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                          )}
                          
                          <img
                            src={attempt.saga === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                            alt="Feedback"
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${
                              attempt.saga === "green" 
                                ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                                : "border-2 border-gray-600/50 hover:scale-105"
                            }`}
                          />
                        </div>
                        
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight">
                          {attempt.guessCharacter.saga}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>












          {/* Seção de Indicadores - Responsiva e Estilizada */}
          <div 
            ref={characteristicsRef} 
            // FUNDO: Substituído bg-gray-800 por backdrop-gradient e blur
            // ANIMAÇÃO: Adicionada animate-fadeInUp para entrada
            // ESTILO: Adicionadas bordas e sombras para casar com o tema do grid anterior
            className={`mt-6 sm:mt-8 backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-gray-100 p-4 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-md mx-auto victory-overlay animate-fadeInUp ${
              won && !gaveUp ? 'victory-card victory-card-shine' : ''
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              {/* TÍTULO: Adicionada animação de brilho */}
              <h3 className="text-xl font-bold mb-4 text-center text-yellow-400 animate-text-glow">Indicadores</h3>
              
              <div className="flex items-center justify-around space-x-4 w-full">
                
                {/* ÍCONES: Adicionado efeito hover-lift e transição */}
                <div className="flex flex-col items-center hover-lift transition-transform duration-300">
                  <div className="w-15 h-15 flex items-center justify-center rounded-lg">
                    <img
                      src="/dle_feed/certo.png"
                      alt="Correto"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-white mt-2">Correto</span>
                </div>

                <div className="flex flex-col items-center hover-lift transition-transform duration-300">
                  <div className="w-15 h-15 flex items-center justify-center rounded-lg">
                    <img
                      src="/dle_feed/errado.png"
                      alt="Incorreto"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-white mt-2">Incorreto</span>
                </div>

                <div className="flex flex-col items-center hover-lift transition-transform duration-300">
                  <div className="w-15 h-15 flex items-center justify-center rounded-lg">
                    <img
                      src="/dle_feed/mais.png"
                      alt="Mais Alto"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-white mt-2">Mais alto</span>
                </div>

                <div className="flex flex-col items-center hover-lift transition-transform duration-300">
                  <div className="w-15 h-15 flex items-center justify-center rounded-lg">
                    <img
                      src="/dle_feed/menos.png"
                      alt="Mais Baixo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-white mt-2">Mais baixo</span>
                </div>
              </div>
              
              {/* TÍTULO: Cor alterada para consistência */ }
              <h3 className="text-lg font-bold mb-2 text-yellow-400 pt-4">Próximo modo:</h3>

              {/* LINK 1: Adicionado hover-lift-rotate e transição ultra-suave */}
              <div
                className="rounded-full flex items-center space-x-3 sm:space-x-4 cursor-pointer group w-full max-w-[380px] hover-lift-rotate transition-ultra-smooth"
                onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
              >
                {/* ÍCONE LINK 1: Adicionado fundo semi-transparente, animação de brilho e transição */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition-ultra-smooth flex-shrink-0 animate-wave-glow">
                  <img src="/dle_feed/silhouette_icon.png" alt="Advinhe as Silhuetas" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
                </div>
                {/* TEXTO LINK 1: Adicionado fundo semi-transparente e transição */}
                <div className="bg-gray-800/50 border-2 border-gray-700 p-3 sm:p-4 rounded-lg shadow-lg flex-1 group-hover:border-yellow-500 transition-ultra-smooth h-16 sm:h-20 flex flex-col justify-center">
                  <h3 className="text-base sm:text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
                    Advinhe as Silhuetas
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">Adivinhe a armadura pela silhueta</p>
                </div>
              </div>

              {/* Botões de modos - Fundo de "vidro" e animações melhoradas */}
              <div className="
                gap-4 sm:gap-6 
                bg-gray-900/30   /* Fundo de painel sutil (nested glass) */
                backdrop-blur-sm  /* Desfoque leve no painel */
                border border-gray-700/50 /* Borda para definir o painel */
                rounded-xl        /* Bordas mais suaves */
                p-3 
                flex items-center justify-center flex-wrap
              ">
                {/* Modo Clássico */}
                <div className="relative group">
                  <button
                    className="rounded-full w-16 h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate" /* Animação de hover mais divertida */
                    onClick={() => window.location.href = "/SaintSeiyaDLE/classic"}
                  >
                    <img
                      src="/dle_feed/classic_icon.png"
                      alt="Modo Classic"
                      className="
                        border-2 border-yellow-500 rounded-full w-full h-full object-contain 
                        transition-transform duration-300 
                        group-hover:scale-110 
                        animate-border-dance  /* Animação de borda que já existia */
                        animate-subtle-scale  /* Nova Animação: pulsação sutil constante */
                      "
                    />
                  </button>
                  {/* Tooltip: Classes de Tailwind removidas e substituídas pela nova classe CSS */ }
                  <div className="glass-tooltip">
                    Modo Classic
                  </div>
                </div>

                {/* Modo Silhueta (ícone pequeno) */}
                <div className="relative group">
                  <button
                    className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate" /* Animação de hover mais divertida */
                    onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
                  >
                    <img
                      src="/dle_feed/silhouette_icon.png"
                      alt="Modo Silhouette"
                      className="
                        w-full h-full object-contain rounded-lg 
                        transition-transform duration-300 
                        group-hover:scale-110 
                        group-hover:shadow-glow-yellow /* Brilho no hover que já existia */
                        animate-subtle-scale         /* Nova Animação: pulsação sutil constante */
                      "
                    />
                  </button>
                  {/* Tooltip: Classes de Tailwind removidas e substituídas pela nova classe CSS */ }
                  <div className="glass-tooltip">
                    Silhuetas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÃO DESISTIR: Estilo atualizado para brilho vermelho no hover */}
          <button
            type="button"
            onClick={handleGiveUp}
            className="bg-red-600/90 border border-red-400 text-white shadow-lg px-6 py-2 mt-8 rounded-lg font-bold text-lg sm:text-xl hover:bg-red-500 transition-all duration-300 w-full max-w-xs button-press hover-lift hover:shadow-glow-red"
          >
            Desistir
          </button>
        </>













        ) : (
        <div className="text-center w-full px-2 sm:px-4">
          {/* Grid de tentativas final - Responsivo com scroll horizontal 
              MODIFICADO com a estilização do Bloco 1 */}
          <div className="mt-8 overflow-x-auto custom-scrollbar"> {/* Adicionado custom-scrollbar */}
            
            {/* Container principal - Fundo transparente com borda sutil */}
            <div className="min-w-[900px] lg:min-w-0 w-full max-w-6xl mx-auto grid grid-cols-10 gap-2 sm:gap-3 bg-gray-900/20 backdrop-blur-sm border border-gray-700/50 p-3 sm:p-5 rounded-2xl shadow-2xl">
              
              {/* Cabeçalhos das colunas - Com animação de entrada */}
              {[
                "Personagem",
                "Gênero",
                "Idade",
                "Altura",
                "Peso",
                "Signo",
                "Patente",
                "Exército",
                "Treinamento",
                "Saga",
              ].map((header, headerIndex) => (
                <div
                  key={headerIndex}
                  className="text-center text-yellow-400 font-bold border-b-2 border-yellow-500/50 pb-2 break-words uppercase text-xs sm:text-sm md:text-base animate-fadeInDown" // Classes do Bloco 1
                  style={{ animationDelay: `${headerIndex * 0.05}s` }} // Animação do Bloco 1
                >
                  {header}
                </div>
              ))}

              {/* Linhas de tentativas com animações elaboradas */}
              {attempts.map((attempt, index) => {
                // Calcula se é a tentativa mais recente (Lógica do Bloco 1)
                const isLatest = index === 0;
                
                return (
                  <React.Fragment key={index}>
                    {/* Coluna 1: Personagem */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Glow effect (Lógica do Bloco 1) */}
                        {isLatest && (
                          <div className="absolute inset-0 bg-yellow-500/30 rounded-xl blur-xl animate-pulse-glow" />
                        )}
                        
                        <img
                          src={attempt.imgSrc}
                          alt={attempt.nome}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 border-gray-600/50 shadow-lg hover:scale-110 hover:border-yellow-500/70 transition-all duration-300 hover:shadow-yellow-500/30 hover:shadow-2xl" // Classes do Bloco 1
                        />
                        
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-200 font-semibold text-center break-words leading-tight max-w-[80px] sm:max-w-none"> {/* Classes do Bloco 1 */}
                        {attempt.nome}
                      </span>
                    </div>

                    {/* Coluna 2: Gênero */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.genero === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={attempt.genero === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.genero === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110 hover:shadow-green-500/50" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.genero}
                      </span>
                    </div>

                    {/* Coluna 3: Idade */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.idade === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={
                            attempt.idade === "green"
                              ? "/dle_feed/certo.png"
                              : attempt.idade === "up"
                              ? "/dle_feed/mais.png"
                              : attempt.idade === "down"
                              ? "/dle_feed/menos.png"
                              : "/dle_feed/errado.png"
                          }
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.idade === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.idade}
                      </span>
                    </div>

                    {/* Coluna 4: Altura */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.altura === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={
                            attempt.altura === "green"
                              ? "/dle_feed/certo.png"
                              : attempt.altura === "up"
                              ? "/dle_feed/mais.png"
                              : attempt.altura === "down"
                              ? "/dle_feed/menos.png"
                              : "/dle_feed/errado.png"
                          }
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.altura === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.altura}
                      </span>
                    </div>

                    {/* Coluna 5: Peso */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.peso === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={
                            attempt.peso === "green"
                              ? "/dle_feed/certo.png"
                              : attempt.peso === "up"
                              ? "/dle_feed/mais.png"
                              : attempt.peso === "down"
                              ? "/dle_feed/menos.png"
                              : "/dle_feed/errado.png"
                          }
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.peso === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.peso}
                      </span>
                    </div>

                    {/* Coluna 6: Signo */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.signo === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={attempt.signo === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.signo === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.signo}
                      </span>
                    </div>

                    {/* Coluna 7: Patente */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.patente === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={attempt.patente === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.patente === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.patente}
                      </span>
                    </div>

                    {/* Coluna 8: Exército */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.exercito === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={attempt.exercito === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.exercito === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.exercito}
                      </span>
                    </div>

                    {/* Coluna 9: Treinamento */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.localDeTreinamento === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={
                            attempt.localDeTreinamento === "green"
                              ? "/dle_feed/certo.png"
                              : "/dle_feed/errado.png"
                          }
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.localDeTreinamento === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.localDeTreinamento}
                      </span>
                    </div>

                    {/* Coluna 10: Saga */}
                    <div 
                      className={`flex flex-col items-center gap-2 attempt-row-enhanced ${isLatest ? 'latest-attempt' : ''}`} // Classes do Bloco 1
                      style={{ animationDelay: `${index * 0.08}s` }} // Animação do Bloco 1
                    >
                      <div className="relative group">
                        {/* Efeito de brilho (Lógica do Bloco 1) */}
                        {attempt.saga === "green" && (
                          <div className="absolute inset-0 bg-green-500/40 rounded-xl blur-lg animate-pulse-success" />
                        )}
                        
                        <img
                          src={attempt.saga === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                          alt="Feedback"
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg transition-all duration-300 ${ // Classes do Bloco 1
                            attempt.saga === "green" 
                              ? "border-2 border-green-500 correct-indicator-enhanced hover:scale-110" 
                              : "border-2 border-gray-600/50 hover:scale-105"
                          }`}
                        />
                      </div>
                      
                      <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center break-words leading-tight"> {/* Classes do Bloco 1 */}
                        {attempt.guessCharacter.saga}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}  
            </div>
          </div>
















          {/* Card de resultado - Estilizado com Animações */}
          <div 
            ref={characteristicsRef} 
            // FUNDO: Trocado bg-gray-800 por backdrop-gradient e blur
            // ESTILO: Adicionado border, rounded-2xl, shadow-2xl para consistência
            // ANIMAÇÃO: Adicionada animate-fadeInUp para entrada
            className={`mt-6 sm:mt-8 backdrop-gradient backdrop-blur-custom border border-gray-700/50 text-gray-100 p-4 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-md mx-auto animate-fadeInUp`}
          >
            {/* TÍTULO: Lógica de cor (verde/vermelho) e animação de brilho */}
            <h2 className={`text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 font-bold ${
              showAnswer 
                ? 'text-red-400' // Cor para "Desistiu"
                : 'text-green-400 animate-text-glow' // Cor e brilho para "Acertou"
            }`}>
              {showAnswer ? "Você desistiu!" : "Parabéns! Você acertou!"}
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-gray-200">O personagem do dia era:</p>

            <div className="flex flex-col items-center">
              <img
                src={selectedCharacter?.imgSrc}
                alt={selectedCharacter?.nome}
                // IMAGEM: Animação de acerto 'correct-indicator-enhanced' e borda
                className={`w-auto h-32 sm:h-36 md:h-40 rounded-xl mb-2 border-2 shadow-lg ${
                  won && !gaveUp 
                    ? 'correct-indicator-enhanced border-green-500' // Classe CSS para acerto
                    : 'border-gray-600/50' // Borda padrão
                }`}
              />
              {/* NOME: Destaque em amarelo */}
              <p className="text-xl sm:text-2xl mb-3 sm:mb-4 font-bold text-yellow-400">
                {selectedCharacter?.nome}!
              </p>
              
              <p className="text-base sm:text-lg text-gray-200 mb-3 sm:mb-4">
                Número de tentativas: <span className="font-bold text-yellow-400">{attempts.length}</span>
              </p>
              
              {/* Contador de tempo - Fundo semi-transparente */}
              <div className={`bg-gray-900/50 border border-gray-700/50 p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 w-full ${
                timeRemaining.startsWith('00:00:') ? 'countdown-pulse' : ''
              }`}>
                <p className="text-xs sm:text-sm text-gray-300 mb-2">Próximo personagem em:</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-400">{timeRemaining}</p>
              </div>

              {/* Botão de estatísticas - Estilo gradiente e brilho */}
              <button
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:from-yellow-600 hover:to-orange-600 transition duration-300 mb-4 w-full sm:w-auto hover-lift button-press hover:shadow-glow-yellow"
                onClick={() => setShowStatsModal(true)}
              >
                📊 Ver Estatísticas
              </button>

              {/* Seção "Próximo modo" - Estilização idêntica à do bloco anterior */}
              <div className="mt-4 sm:mt-6 w-full">
                <h3 className="text-base sm:text-lg font-bold mb-2 text-yellow-400">Próximo modo:</h3>
                <div className="flex flex-col items-center space-y-4">
                  
                  {/* Link Silhueta */}
                  <div
                    className="rounded-full flex items-center space-x-3 sm:space-x-4 cursor-pointer group w-full max-w-[380px] hover-lift-rotate transition-ultra-smooth"
                    onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
                  >
                    {/* Ícone Link Silhueta */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20  rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition-ultra-smooth flex-shrink-0 animate-wave-glow">
                      <img
                        src="/dle_feed/silhouette_icon.png"
                        alt="Advinhe as Silhuetas"
                        className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                      />
                    </div>
                    {/* Texto Link Silhueta */}
                    <div className="bg-gray-800/50 border-2 border-gray-700 p-3 sm:p-4 rounded-lg shadow-lg flex-1 group-hover:border-yellow-500 transition-ultra-smooth h-16 sm:h-20 flex flex-col justify-center">
                      <h3 className="text-base sm:text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
                        Advinhe as Silhuetas
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm">Adivinhe a armadura pela silhueta</p>
                    </div>
                  </div>

                  {/* Botões de modos - Fundo de "vidro" e animações melhoradas */}
                  <div className="
                    gap-4 sm:gap-6 
                    bg-gray-900/30   /* Fundo de painel sutil (nested glass) */
                    backdrop-blur-sm  /* Desfoque leve no painel */
                    border border-gray-700/50 /* Borda para definir o painel */
                    rounded-xl        /* Bordas mais suaves */
                    p-3 
                    flex items-center justify-center flex-wrap
                  ">
                    
                    {/* Modo Clássico */}
                    <div className="relative group">
                      <button
                        className="rounded-full w-16 h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate" /* Animação de hover mais divertida */
                        onClick={() => window.location.href = "/SaintSeiyaDLE/classic"}
                      >
                        <img
                          src="/dle_feed/classic_icon.png"
                          alt="Modo Classic"
                          className="
                            border-2 border-yellow-500 rounded-full w-full h-full object-contain 
                            transition-transform duration-300 
                            group-hover:scale-110 
                            animate-border-dance  /* Animação de borda que já existia */
                            animate-subtle-scale  /* Nova Animação: pulsação sutil constante */
                          "
                        />
                      </button>
                      {/* Tooltip: Classes de Tailwind removidas e substituídas pela nova classe CSS */ }
                      <div className="glass-tooltip">
                        Modo Classic
                      </div>
                    </div>

                    {/* Modo Silhueta (ícone pequeno) */}
                    <div className="relative group">
                      <button
                        className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-transparent focus:outline-none transition-ultra-smooth hover-lift-rotate" /* Animação de hover mais divertida */
                        onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
                      >
                        <img
                          src="/dle_feed/silhouette_icon.png"
                          alt="Modo Silhouette"
                          className="
                            w-full h-full object-contain rounded-lg 
                            transition-transform duration-300 
                            group-hover:scale-110 
                            group-hover:shadow-glow-yellow /* Brilho no hover que já existia */
                            animate-subtle-scale         /* Nova Animação: pulsação sutil constante */
                          "
                        />
                      </button>
                      {/* Tooltip: Classes de Tailwind removidas e substituídas pela nova classe CSS */ }
                      <div className="glass-tooltip">
                        Silhuetas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}