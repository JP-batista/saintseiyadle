import React, { useMemo, memo } from "react"; 
import { AttemptComparison, Character } from "../types";
import FeedbackCell from "./FeedbackCell";
import CharacterCell from "./CharacterCell";
import { useTranslation } from "../../i18n/useTranslation";
import { characterDataMap } from "../../i18n/config"; 

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
	const { locale } = useTranslation();

	const displayCharacter: Character = useMemo(() => {
		const dataModule = characterDataMap[locale] || characterDataMap['pt'];
		const localizedCharacters = (dataModule as any).default as Character[] || [];
		const foundCharacter = localizedCharacters.find(c => c.idKey === attempt.idKey);
        
		return foundCharacter || attempt.guessCharacter;
	}, [attempt.idKey, locale, attempt.guessCharacter]); 


	const feedbackData = useMemo(
		() => [
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
				imgSrc={displayCharacter.imgSrc} 
				nome={displayCharacter.nome} 
				isLatest={isLatest}
				animationDelay={animationDelay}
			/>

			{feedbackData.map((data) => (
				<FeedbackCell
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
