"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import React from "react";
import { useGameStore } from "../stores/useGameStore";
import { useStatsStore } from "../stores/useStatsStore";
import StatsModal from "../components/StatsModal";
import { useTranslation } from "../i18n/useTranslation"; // I18N: Importa o hook de tradução
import { characterDataMap } from "../i18n/config"; // I18N: Importa o mapa de dados
import {
	getCurrentDateInBrazil,
	getNextMidnightInBrazil,
	getDailyCharacter,
	formatTimeRemaining,
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
import GameLegend from "./components/GameLegend";
import { useRouter } from "next/navigation";

export default function GamePage() {
	const { t, locale } = useTranslation();
	
	// 1. DADOS LOCALIZADOS (Substitui a importação estática)
	const characters = useMemo(() => {
		const dataModule = characterDataMap[locale] || characterDataMap['pt'];
		return (dataModule as any).default as Character[] || [];
	}, [locale]);
	
	// ... (Stores, Refs e Estados) ...
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
	const characteristicsRef = useRef<HTMLDivElement | null>(null);
	const router = useRouter(); 

	const [selectedSuggestion, setSelectedSuggestion] = useState<Character | null>(null);
	const [input, setInput] = useState<string>("");
	const [suggestions, setSuggestions] = useState<Character[]>([]);
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
	const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
	const [showVictoryEffects, setShowVictoryEffects] = useState<boolean>(false);
	const [isClient, setIsClient] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const dica1 = useMemo(() => {
		// O campo 'dica1' existe em Character, que agora tem idKey
		return attempts.length >= 5 ? selectedCharacter?.dica1 : null;
	}, [attempts.length, selectedCharacter]);

	const dica2 = useMemo(() => {
		// O campo 'dica2' existe em Character, que agora tem idKey
		return attempts.length >= 10 ? selectedCharacter?.dica2 : null;
	}, [attempts.length, selectedCharacter]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// 2. EFEITO DE INICIALIZAÇÃO (Usa a lista localizada)
	useEffect(() => {
		if (!isClient || !characters.length) return; 
		
		const todayDate = getCurrentDateInBrazil();
		
		if (currentGameDate !== todayDate || !selectedCharacter) {
			const { character, index } = getDailyCharacter(
				todayDate,
				characters, // Usa o array de dados LOCALIZADO
				usedCharacterIndices
			);
			// Este é o ponto que falhava: `character` é um `Character` que agora possui `idKey`
			resetDailyGame(character, todayDate); 
			addUsedCharacterIndex(index);
		}
	}, [
		isClient,
		currentGameDate,
		selectedCharacter,
		usedCharacterIndices,
		resetDailyGame,
		addUsedCharacterIndex,
		characters, // Depende do array de dados (que muda com o idioma)
	]);
	// ... (Outros useEffects permanecem os mesmos) ...
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
				router.refresh();
			}
		}
		const interval = setInterval(checkDayChange, 60000);
		return () => clearInterval(interval);
	}, [isClient, currentGameDate, router]);

	useEffect(() => {
		if (won && !gaveUp && attempts.length > 0 && isClient) {
			setShowVictoryEffects(true);
			const scrollTimer = setTimeout(() => {
				characteristicsRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}, 500);
			return () => clearTimeout(scrollTimer);
		}
	}, [won, gaveUp, attempts.length, isClient]);

	// 3. EFEITO DE SALVAR (Passa o IDKey)
	useEffect(() => {
		if (
			(won || gaveUp) &&
			currentGameDate &&
			attempts.length > 0 &&
			selectedCharacter
		) {
			const existingGame = getGameByDate(currentGameDate);
			if (!existingGame) {
				addGameResult(
					currentGameDate,
					attempts.length,
					won && !gaveUp,
					selectedCharacter.nome,
					selectedCharacter.imgSrc,
					selectedCharacter.idKey // CORREÇÃO: Removida a asserção 'as any'
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
		selectedCharacter,
	]);
	
	// ... (Funções de Comparação e Normalização permanecem as mesmas) ...
	const parseHeight = useCallback((height: string): number => {
		if (height.toLowerCase() === "desconhecido") return NaN;
		return parseFloat(height.replace(",", ".").replace(" m", "").trim());
	}, []);

	const compareAge = useCallback((value: string, target: string): string => {
		const valueLower = value.toLowerCase();
		const targetLower = target.toLowerCase();
		if (valueLower === "desconhecida" && targetLower === "desconhecida")
			return "green";
		if (valueLower === "desconhecida" || targetLower === "desconhecida")
			return "red";
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
		if (valueLower === "desconhecido" && targetLower === "desconhecido")
			return "green";
		if (valueLower === "desconhecido" || targetLower === "desconhecido")
			return "ignore";
		const numericValue = parseFloat(value);
		const numericTarget = parseFloat(target);
		if (isNaN(numericValue) || isNaN(numericTarget)) return "ignore";
		if (numericValue === numericTarget) return "green";
		return numericValue < numericTarget ? "up" : "down";
	}, []);

	const compareHeight = useCallback(
		(value: string, target: string): string => {
			const valueLower = value.toLowerCase();
			const targetLower = target.toLowerCase();
			if (valueLower === "desconhecida" && targetLower === "desconhecida")
				return "green";
			if (valueLower === "desconhecida" || targetLower === "desconhecida")
				return "red";
			const numericValue = parseHeight(value);
			const numericTarget = parseHeight(target);
			if (isNaN(numericValue) || isNaN(numericTarget)) return "red";
			if (numericValue === numericTarget) return "green";
			return numericValue < numericTarget ? "up" : "down";
		},
		[parseHeight]
	);

	// 4. LÓGICA DE SUBMISSÃO (Implementação da Correção de ID)
	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!input.trim() || !selectedSuggestion || !selectedCharacter) return;
			
			const guess = characters.find( // Usa o array 'characters' do useMemo
				(char: Character) =>
					char.nome.toLowerCase() === selectedSuggestion.nome.toLowerCase()
			);
			
			if (!guess) {
				setError(t("form_error_not_found"));
				return;
			}

			// 💥 CORREÇÃO CRÍTICA DO BUG DE IDIOMA/TENTATIVA REPETIDA
			if (
				attempts.some(
					// Usamos agora a propriedade `idKey` que existe no `guessCharacter`
					(attempt) => attempt.guessCharacter.idKey === guess.idKey 
				)
			) {
				setError(t("form_error_already_tried"));
				setInput("");
				setShowDropdown(false);
				return;
			}

			const correct = guess.nome === selectedCharacter.nome;

			const comparison: AttemptComparison = {
				nome: guess.nome,
				idKey: guess.idKey, // NOVO: Adicionando o idKey
				idade: compareAge(guess.idade, selectedCharacter.idade),
				altura: compareHeight(guess.altura, selectedCharacter.altura),
				peso: compareWeight(guess.peso, selectedCharacter.peso),
				genero: guess.genero === selectedCharacter.genero ? "green" : "red",
				signo: guess.signo === selectedCharacter.signo ? "green" : "red",
				localDeTreinamento:
					guess.localDeTreinamento === selectedCharacter.localDeTreinamento
						? "green"
						: "red",
				patente: guess.patente === selectedCharacter.patente ? "green" : "red",
				exercito:
					guess.exercito === selectedCharacter.exercito ? "green" : "red",
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
			setError(null);
		},
		[
			input,
			selectedSuggestion,
			selectedCharacter,
			attempts,
			compareAge,
			compareHeight,
			compareWeight,
			addAttempt,
			setWon,
			t, 
			characters, // Adicionado 'characters'
		]
	);
	// ... (Restante dos handlers de input permanecem os mesmos) ...

	const normalizeText = useCallback((text: string) => {
		return text
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\w\s]/gi, "")
			.toLowerCase();
	}, []);

	const getFilteredSuggestions = useCallback(
		(value: string) => {
			const normalizedValue = normalizeText(value);
			// CORREÇÃO: A verificação de 'alreadyTried' não precisa ser por nome aqui, mas funciona por nome também
			const alreadyTried = new Set(attempts.map((a) => a.nome.toLowerCase())); 

			const filterAndSlice = (filterFn: (char: Character) => boolean) => {
				return characters 
					.filter(
						(char) =>
							!alreadyTried.has(char.nome.toLowerCase()) && filterFn(char)
					)
					.slice(0, 5);
			};

			let matches = filterAndSlice((char) =>
				normalizeText(char.nome).startsWith(normalizedValue)
			);
			if (matches.length > 0) return matches;

			matches = filterAndSlice((char) =>
				normalizeText(char.patente).includes(normalizedValue)
			);
			if (matches.length > 0) return matches;

			matches = filterAndSlice(
				(char) =>
					typeof char.titulo === "string" &&
					normalizeText(char.titulo).includes(normalizedValue)
			);
			return matches;
		},
		[attempts, normalizeText, characters]
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
				setSelectedSuggestion(filteredSuggestions[0] || null);
			} else {
				setSuggestions([]);
				setShowDropdown(false);
				setSelectedSuggestion(null);
			}
		},
		[getFilteredSuggestions]
	);

	// 💥 ALTERAÇÃO CRÍTICA: Agora recebe o IDKey em vez do objeto Character
	const handleSuggestionClick = useCallback((idKey: string) => { 
		const suggestion = characters.find(c => c.idKey === idKey); // Localiza o personagem pelo ID
		
		if (suggestion) {
			setInput(suggestion.nome);
			setSelectedSuggestion(suggestion);
			setShowDropdown(false);
			setError(null);
		}
	}, [characters]); // Adiciona characters como dependência

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
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
		},
		[suggestions, selectedSuggestion]
	);

	// Renderização
	if (!isClient || !selectedCharacter || !characters.length) { 
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen text-white flex flex-col items-center p-6">
			{showVictoryEffects && (
				<VictoryEffects
					isActive={true}
					onComplete={() => setShowVictoryEffects(false)}
				/>
			)}

			<StatsModal
				isOpen={showStatsModal}
				onClose={() => setShowStatsModal(false)}
			/>

			<Logo />

			<GameModeButtons />

			<StatsBar
				currentStreak={currentStreak}
				onShowStats={() => setShowStatsModal(true)}
				onShowNews={() => {
					/* Modal de novidades em breve! */
				}}
				onShowHelp={() => {
					/* Modal de 'Como Jogar' em breve! */
				}}
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
						showDropdown={showDropdown && !error}
						onSuggestionClick={handleSuggestionClick} // Chama com idKey
					/>
					{/* Renderiza o erro no lugar do dropdown */}
					{error && !showDropdown && (
						<div className="relative w-full max-w-md -mt-4 mb-8">
							<div className="absolute left-0 right-0 p-3 bg-red-800/90 backdrop-blur-md border border-red-500/50 rounded-xl shadow-2xl text-center text-white font-semibold animate-shake-error">
								{error}
							</div>
						</div>
					)}
					<AttemptsGrid attempts={attempts} gridRef={null} />
					<GameLegend />
				</>
			) : (
				<>
					{/* Jogo finalizado */}
					<AttemptsGrid attempts={attempts} gridRef={null} />
					<ResultCard
						cardRef={characteristicsRef}
						isWin={won && !gaveUp}
						// O `selectedCharacter` é garantido de ser não-nulo pela verificação de inicialização
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
