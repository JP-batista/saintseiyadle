// srcapp/classicc/types.ts

export type Character = {
  idKey: string; 
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

export type AttemptComparison = {
  idKey: string; 
  nome: string;
  idade: string;
  altura: string;
  peso: string;
  genero: string;
  signo: string;
  localDeTreinamento: string;
  patente: string;
  exercito: string;
  saga: string;
  imgSrc: string;
  guessCharacter: Character; 
};