// src/app/classico/page.tsx

"use client";
import { useState, useEffect, useRef } from "react";
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
    clearState,
  } = useGameStore();

  const { addGameResult, getGameByDate } = useStatsStore();

  const characteristicsRef = useRef<HTMLDivElement | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Character | null>(null);
  const [showHint1, setShowHint1] = useState<boolean>(false);
  const [showHint2, setShowHint2] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dica1, setDica1] = useState<string | null>(null);
  const [dica2, setDica2] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);

  useEffect(() => {
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
      setDica1(null);
      setDica2(null);
      setShowAnswer(false);
    }
  }, [currentGameDate, selectedCharacter, usedCharacterIndices, resetDailyGame, addUsedCharacterIndex]);

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
      const todayDate = getCurrentDateInBrazil();
      if (currentGameDate && currentGameDate !== todayDate) {
        window.location.reload();
      }
    };

    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, [currentGameDate]);

  useEffect(() => {
    if (attempts.length >= 5 && !dica1 && selectedCharacter?.dica1) {
      setDica1(selectedCharacter.dica1);
    }
    if (attempts.length >= 10 && !dica2 && selectedCharacter?.dica2) {
      setDica2(selectedCharacter.dica2);
    }
  }, [attempts, selectedCharacter, dica1, dica2]);

  // Salva resultado no histórico quando o jogo termina
  useEffect(() => {
    if ((won || gaveUp) && currentGameDate && attempts.length > 0) {
      const existingGame = getGameByDate(currentGameDate);
      
      // Só registra se ainda não foi registrado
      if (!existingGame) {
        addGameResult(currentGameDate, attempts.length, won && !gaveUp);
      }
    }
  }, [won, gaveUp, currentGameDate, attempts.length, addGameResult, getGameByDate]);

  const parseHeight = (height: string): number => {
    if (height.toLowerCase() === "desconhecido") return NaN;
    return parseFloat(height.replace(",", ".").replace(" m", "").trim());
  };

  const compareAge = (value: string, target: string): string => {
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
  };

  const compareWeight = (value: string, target: string): string => {
    const valueLower = value.toLowerCase();
    const targetLower = target.toLowerCase();

    if (valueLower === "desconhecido" && targetLower === "desconhecido") return "green";
    if (valueLower === "desconhecido" || targetLower === "desconhecido") return "ignore";

    const numericValue = parseFloat(value);
    const numericTarget = parseFloat(target);

    if (isNaN(numericValue) || isNaN(numericTarget)) return "ignore";
    if (numericValue === numericTarget) return "green";
    return numericValue < numericTarget ? "up" : "down";
  };

  const compareHeight = (value: string, target: string): string => {
    const valueLower = value.toLowerCase();
    const targetLower = target.toLowerCase();

    if (valueLower === "desconhecida" && targetLower === "desconhecida") return "green";
    if (valueLower === "desconhecida" || targetLower === "desconhecida") return "red";

    const numericValue = parseHeight(value);
    const numericTarget = parseHeight(target);

    if (isNaN(numericValue) || isNaN(numericTarget)) return "red";
    if (numericValue === numericTarget) return "green";
    return numericValue < numericTarget ? "up" : "down";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || !selectedSuggestion) return;

    const guess = characters.find(
      (char: Character) => char.nome.toLowerCase() === selectedSuggestion.nome.toLowerCase()
    );

    if (!guess) {
      alert("Personagem não encontrado!");
      return;
    }

    if (!selectedCharacter) {
      alert("Erro interno: Personagem selecionado inválido.");
      return;
    }

    if (isAlreadyTried(selectedSuggestion.nome)) {
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
      setTimeout(() => {
        characteristicsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }

    addAttempt(comparison);
    setInput("");
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedSuggestion(null);
  };

  const isAlreadyTried = (nome: string) => {
    return attempts.some((attempt) => attempt.nome.toLowerCase() === nome.toLowerCase());
  };

  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .toLowerCase();
  };

  const getFilteredSuggestions = (value: string) => {
    const normalizedValue = normalizeText(value);

    const nameMatches = characters.filter(
      (char: Character) =>
        normalizeText(char.nome).startsWith(normalizedValue) && !isAlreadyTried(char.nome)
    );

    if (nameMatches.length > 0) return nameMatches;

    const patenteMatches = characters.filter(
      (char: Character) =>
        normalizeText(char.patente).includes(normalizedValue) && !isAlreadyTried(char.nome)
    );

    if (patenteMatches.length > 0) return patenteMatches;

    const titleMatches = characters.filter(
      (char: Character) =>
        char.titulo &&
        normalizeText(char.titulo).includes(normalizedValue) &&
        !isAlreadyTried(char.nome)
    );

    return titleMatches;
  };

  const handleGiveUp = () => {
    setShowAnswer(true);
    setWon(true);
    setGaveUp(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value) {
      const filteredSuggestions = getFilteredSuggestions(value);
      setSuggestions(filteredSuggestions);
      setShowDropdown(true);
      setSelectedSuggestion(filteredSuggestions[0] || null);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setSelectedSuggestion(null);
    }
  };

  const handleSuggestionClick = (suggestion: Character) => {
    setInput(suggestion.nome);
    setSelectedSuggestion(suggestion);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && suggestions.length > 0) {
      const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion);
      const nextIndex = (currentIndex + 1) % suggestions.length;
      setSelectedSuggestion(suggestions[nextIndex]);
      setInput(suggestions[nextIndex].nome);
    } else if (e.key === "ArrowUp" && suggestions.length > 0) {
      const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion);
      const prevIndex = (currentIndex - 1 + suggestions.length) % suggestions.length;
      setSelectedSuggestion(suggestions[prevIndex]);
      setInput(suggestions[prevIndex].nome);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
      <StatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} />
      
      <div className="flex justify-center items-center mb-2">
        <Link href="/" passHref>
        <img
            src="/dle_feed/logo_dle.png"
            alt="Logo Os Cavaleiros do Zodíaco"
            className="w-auto h-52 hover:scale-105 transition-transform duration-500 ease-in-out cursor-pointer"
        />
        </Link>
      </div>

      <div className="mb-4">
        <div className="gap-4 flex items-center justify-center ">
          <div className="relative group ">
            <button
              className="w-16 h-16 bg-transparent focus:outline-none "
              onClick={() => window.location.href = "/SaintSeiyaDLE/classico"}
            >
              <img
                src="/dle_feed/classic_icon.png"
                alt="Modo Classic"
                className="border-2 border-yellow-500 rounded-full w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
              />
            </button>
            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Modo Classic
            </div>
          </div>

          <div className="relative group">
            <button
              className="w-16 h-16 bg-transparent focus:outline-none"
              onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
            >
              <img
                src="/dle_feed/silhouette_icon.png"
                alt="Modo Silhouette"
                className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
            </button>
            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Silhuetas
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md bg-gray-800 text-white rounded-lg shadow-lg p-4 mb-6">
        <h3 className="text-xl font-bold text-center mb-4 text-yellow-400 tracking-wide">
          Adivinha qual é a personagem de<br></br>Saint Seiya
        </h3>
        <div className="flex justify-between gap-4">
          <div
            onClick={() => setShowHint1(!showHint1)}
            className={`cursor-pointer flex-1 p-3 text-center border-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              attempts.length >= 5
                ? "border-yellow-500 bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 shadow-md"
                : "border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Dica 1
          </div>

          <div
            onClick={() => setShowHint2(!showHint2)}
            className={`cursor-pointer flex-1 p-3 text-center border-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              attempts.length >= 10
                ? "border-yellow-500 bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 shadow-md"
                : "border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Dica 2
          </div>
        </div>

        {showHint1 && attempts.length >= 5 && (
          <div className="mt-4 p-2 bg-gray-700 rounded-lg text-center text-sm font-semibold text-yellow-400 shadow-md">
            {dica1 || "Nenhuma dica disponível para este personagem."}
          </div>
        )}

        {showHint2 && attempts.length >= 10 && (
          <div className="mt-4 p-2 bg-gray-700 rounded-lg text-center text-sm font-semibold text-yellow-400 shadow-md">
            {dica2 || "Nenhuma dica disponível para este personagem."}
          </div>
        )}

        <div className="mt-4 text-center text-sm">
          {attempts.length < 5 && (
            <p className="text-gray-400">
              Faltam{" "}
              <span className="font-bold text-yellow-500">{5 - attempts.length}</span>{" "}
              tentativas para <span className="text-yellow-400">Dica 1</span>.
            </p>
          )}
          {attempts.length >= 5 && attempts.length < 10 && (
            <p className="text-gray-400">
              Faltam{" "}
              <span className="font-bold text-yellow-500">{10 - attempts.length}</span>{" "}
              tentativas para <span className="text-yellow-400">Dica 2</span>.
            </p>
          )}
        </div>
      </div>
      
      {!won ? (
        <>
          <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Digite o nome do cavaleiro"
                className="p-3 w-full border border-gray-500 rounded-md bg-gray-700 focus:ring-2 focus:ring-yellow-500 text-center text-lg"
              />
              {showDropdown && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-2 bg-gray-700 border border-gray-500 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                  {suggestions.map((suggestion) => (
                    suggestion && (
                      <li
                        key={suggestion.nome}
                        className="flex items-center p-2 hover:bg-gray-600 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <img
                          src={suggestion.imgSrc || "/default-image.png"}
                          alt={suggestion.nome || "Sem nome"}
                          className="w-10 h-10 rounded-lg mr-2"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{suggestion.nome || "Desconhecido"}</span>
                          <span className="text-xs text-gray-400 italic">{suggestion.titulo || "Sem titulo"}</span>
                        </div>
                      </li>
                    )
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-bold text-xl hover:bg-yellow-600 transition-all duration-300"
            >
              Tentar
            </button>
          </form>

          <div className="w-full max-w-5xl grid grid-cols-10 gap-2 mt-8 bg-gray-800 p-4 rounded-lg shadow-lg">
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
                className="text-center text-yellow-400 font-bold border-b-2 border-yellow-500 pb-2 break-words uppercase"
              >
                {header}
              </div>
            ))}

            {attempts.map((attempt, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <img
                    src={attempt.imgSrc}
                    alt={attempt.nome}
                    className="w-16 h-16 rounded-lg object-cover mb-2 border-2 border-gray-500 shadow-md"
                  />
                  <span className="text-xs text-gray-200 font-semibold text-center break-words">
                    {attempt.nome}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.genero === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.genero}
                  </span>
                </div>

                <div className="flex flex-col items-center">
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
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.idade}
                  </span>
                </div>

                <div className="flex flex-col items-center">
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
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.altura}
                  </span>
                </div>

                <div className="flex flex-col items-center">
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
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.peso}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.signo === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.signo}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.patente === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.patente}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.exercito === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.exercito}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={
                      attempt.localDeTreinamento === "green"
                        ? "/dle_feed/certo.png"
                        : "/dle_feed/errado.png"
                    }
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.localDeTreinamento}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.saga === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.saga}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div ref={characteristicsRef} className="mt-8 bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg text-center max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl font-bold mb-4 text-center text-yellow-400">Indicadores</h3>
                <div className="flex items-center justify-around space-x-4">
                  
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                      <img
                        src="/dle_feed/certo.png"
                        alt="Correto"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm text-white mt-2">Correto</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                      <img
                        src="/dle_feed/errado.png"
                        alt="Incorreto"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm text-white mt-2">Incorreto</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                      <img
                        src="/dle_feed/mais.png"
                        alt="Mais Alto"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm text-white mt-2">Mais alto</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                      <img
                        src="/dle_feed/menos.png"
                        alt="Mais Baixo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm text-white mt-2">Mais baixo</span>
                  </div>
                </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">Próximo modo:</h3>

              <div
                className="flex items-center space-x-4 cursor-pointer group w-[380px]"
                onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
              >
                <div className="w-22 h-22 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition duration-300">
                  <img src="/dle_feed/silhouette_icon.png" alt="Advinhe as Silhuetas" className="w-20 h-20 object-contain" />
                </div>
                <div className="bg-gray-800 border-2 border-gray-700 p-4 rounded-lg shadow-lg flex-1 group-hover:border-yellow-500 transition duration-300 h-20 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
                    Advinhe as Silhuetas
                  </h3>
                  <p className="text-gray-300 text-sm">Adivinhe a armadura pela silhueta</p>
                </div>
              </div>

              <div className="gap-2 bg-gray-800 flex items-center justify-center ">
                <div className="relative group ">
                  <button
                    className="w-16 h-16 bg-transparent focus:outline-none "
                    onClick={() => window.location.href = "/SaintSeiyaDLE/classico"}
                  >
                    <img
                      src="/dle_feed/classic_icon.png"
                      alt="Modo Classic"
                      className="border-2 border-yellow-500 rounded-full w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </button>
                  <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Modo Classico
                  </div>
                </div>

                <div className="relative group">
                  <button
                    className="w-16 h-16 bg-transparent focus:outline-none"
                    onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
                  >
                    <img
                      src="/dle_feed/silhouette_icon.png"
                      alt="Modo Silhouette"
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                  </button>
                  <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Silhuetas
                  </div>
                </div>
              
                <div className="relative group">
                  <button
                    className="w-16 h-16 bg-transparent focus:outline-none"
                    onClick={() => window.location.href = "/SaintSeiyaDLE/quiz"}
                  >
                    <img
                      src="/dle_feed/quiz_icon.png"
                      alt="Modo Quiz"
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                  </button>
                  <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Quiz
                  </div>
                </div>

                <div className="relative group">
                  <button
                    className="w-16 h-16 bg-transparent focus:outline-none"
                    onClick={() => window.location.href = "/SaintSeiyaDLE/affinity"}
                  >
                    <img
                      src="/dle_feed/affinity_icon.png"
                      alt="Modo Affinity"
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                  </button>
                  <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Teste de Afinidade
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGiveUp}
            className="bg-red-500 text-gray-900 px-6 py-2 mt-8 rounded-lg font-bold text-xl hover:bg-red-600 transition-all duration-300"
          >
            Desistir
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="mt-8 w-full max-w-5xl grid grid-cols-10 gap-2 bg-gray-800 p-4 rounded-lg shadow-lg">
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
                className="text-center text-yellow-400 font-bold border-b-2 border-yellow-500 pb-2 break-words uppercase"
              >
                {header}
              </div>
            ))}

            {attempts.map((attempt, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <img
                    src={attempt.imgSrc}
                    alt={attempt.nome}
                    className="w-16 h-16 rounded-lg object-cover mb-2 border-2 border-gray-500 shadow-md"
                  />
                  <span className="text-xs text-gray-200 font-semibold text-center break-words">
                    {attempt.nome}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.genero === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.genero}
                  </span>
                </div>

                <div className="flex flex-col items-center">
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
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.idade}
                  </span>
                </div>

                <div className="flex flex-col items-center">
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
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.altura}
                  </span>
                </div>

                <div className="flex flex-col items-center">
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
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.peso}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.signo === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.signo}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.patente === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.patente}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.exercito === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.exercito}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={
                      attempt.localDeTreinamento === "green"
                        ? "/dle_feed/certo.png"
                        : "/dle_feed/errado.png"
                    }
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.localDeTreinamento}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={attempt.saga === "green" ? "/dle_feed/certo.png" : "/dle_feed/errado.png"}
                    alt="Feedback"
                    className="w-16 h-16 rounded-lg object-cover mb-2 shadow-md"
                  />
                  <span className="text-xs text-gray-400 text-center break-words">
                    {attempt.guessCharacter.saga}
                  </span>
                </div>
              </React.Fragment>
            ))}  
          </div>

          <div ref={characteristicsRef} className="mt-8 bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg text-center max-w-md mx-auto">
            <h2 className="text-4xl text-green-400 mb-4">
              {showAnswer ? "Você desistiu!" : "Parabéns! Você acertou!"}
            </h2>
            <p className="text-2xl mb-4">O personagem do dia era:</p>

            <div className="flex flex-col items-center">
              <img
                src={selectedCharacter?.imgSrc}
                alt={selectedCharacter?.nome}
                className="w-auto h-40 rounded-lg mb-2"
              />
              <p className="text-2xl mb-4">
                <strong>{selectedCharacter?.nome}!</strong>
              </p>
              <p className="text-md font-semibold mb-4">
                Número de tentativas: <span className="font-bold text-yellow-400">{attempts.length}</span>
              </p>
              
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-300 mb-2">Próximo personagem em:</p>
                <p className="text-xl font-bold text-yellow-400">{timeRemaining}</p>
              </div>

              <button
                className="bg-yellow-600 text-white px-6 py-3 rounded-md font-bold text-lg hover:bg-yellow-700 transition duration-300 mb-4"
                onClick={() => setShowStatsModal(true)}
              >
                📊 Ver Estatísticas
              </button>
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2 text-gray-100">Próximo modo:</h3>
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className="flex items-center space-x-4 cursor-pointer group w-[380px]"
                    onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
                  >
                    <div className="w-22 h-22 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition duration-300">
                      <img
                        src="/dle_feed/silhouette_icon.png"
                        alt="Advinhe as Silhuetas"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    <div className="bg-gray-800 border-2 border-gray-700 p-4 rounded-lg shadow-lg flex-1 group-hover:border-yellow-500 transition duration-300 h-20 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
                        Advinhe as Silhuetas
                      </h3>
                      <p className="text-gray-300 text-sm">Adivinhe a armadura pela silhueta</p>
                    </div>
                  </div>

                  <div className="gap-2 bg-gray-800 flex items-center justify-center ">
                    <div className="relative group ">
                      <button
                        className="w-16 h-16 bg-transparent focus:outline-none "
                        onClick={() => window.location.href = "/SaintSeiyaDLE/classico"}
                      >
                        <img
                          src="/dle_feed/classic_icon.png"
                          alt="Modo Classic"
                          className="border-2 border-yellow-500 rounded-full w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
                        />
                      </button>
                      <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Modo Classic
                      </div>
                    </div>

                    <div className="relative group">
                      <button
                        className="w-16 h-16 bg-transparent focus:outline-none"
                        onClick={() => window.location.href = "/SaintSeiyaDLE/silhueta"}
                      >
                        <img
                          src="/dle_feed/silhouette_icon.png"
                          alt="Modo Silhouette"
                          className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                        />
                      </button>
                      <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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