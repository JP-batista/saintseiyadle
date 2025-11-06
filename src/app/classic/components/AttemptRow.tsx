import React, { useMemo, memo } from "react"; 
import { AttemptComparison, Character } from "../types"; // Import Character for type safety
import FeedbackCell from "./FeedbackCell";
import CharacterCell from "./CharacterCell";
import { useTranslation } from "../../i18n/useTranslation"; // 💥 NOVO: Importa locale
import { characterDataMap } from "../../i18n/config"; // 💥 NOVO: Importa o mapa de dados

type AttemptRowProps = {
	attempt: AttemptComparison;
	isLatest: boolean;
	animationDelay: number;
};

const AttemptRowComponent: React.FC<AttemptRowProps> = ({
	attempt,
	isLatest,
	animationDelay,
}) => {
	// 1. Obtém o locale atual
	const { locale } = useTranslation();

	// 2. Localiza o personagem na lista LOCALIZADA usando o idKey
	const displayCharacter: Character = useMemo(() => {
		// Pega a lista de personagens para o locale atual
		const dataModule = characterDataMap[locale] || characterDataMap['pt'];
		const localizedCharacters = (dataModule as any).default as Character[] || [];
		
		// 💥 MUDANÇA: Procura o personagem pelo idKey
		const foundCharacter = localizedCharacters.find(c => c.idKey === attempt.idKey);
        
        // Retorna o personagem localizado ou, como fallback, o objeto salvo na tentativa (guessCharacter)
        // Isso garante que os status (green, red, up/down) permaneçam os mesmos.
		return foundCharacter || attempt.guessCharacter;
	}, [attempt.idKey, locale, attempt.guessCharacter]); 


	// OTIMIZAÇÃO: useMemo
	const feedbackData = useMemo(
		() => [
			// Mapeamento de feedback para as células (usando o valor do personagem localizado)
			{ key: "genero", status: attempt.genero, value: displayCharacter.genero },
			{ key: "idade", status: attempt.idade, value: displayCharacter.idade },
			{ key: "altura", status: attempt.altura, value: displayCharacter.altura },
			{ key: "peso", status: attempt.peso, value: displayCharacter.peso },
			{ key: "signo", status: attempt.signo, value: displayCharacter.signo },
			{ key: "patente", status: attempt.patente, value: displayCharacter.patente },
			{ key: "exercito", status: attempt.exercito, value: displayCharacter.exercito },
			{
				key: "localDeTreinamento",
				status: attempt.localDeTreinamento,
				value: displayCharacter.localDeTreinamento,
			},
			{
				key: "saga",
				status: attempt.saga,
				value: displayCharacter.saga || "N/A",
			},
		],
		[attempt, displayCharacter] 
	);

	return (
		<React.Fragment>
			<CharacterCell
				// Usando o nome e a imagem do personagem localizado
				imgSrc={displayCharacter.imgSrc} 
				nome={displayCharacter.nome} 
				isLatest={isLatest}
				animationDelay={animationDelay}
			/>

			{feedbackData.map((data) => (
				<FeedbackCell
					// A chave interna é o atributo (genero, idade, etc.), que é estável
					key={data.key} 
					status={data.status}
					value={data.value}
					isLatest={isLatest}
					animationDelay={animationDelay}
				/>
			))}
		</React.Fragment>
	);
};

export const AttemptRow = memo(AttemptRowComponent);
export default AttemptRow;
