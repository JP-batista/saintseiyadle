export type Character = {
    // CORREÇÃO: idKey é o identificador único para localização e estado do jogo
    idKey: string;
    nome: string;
    titulo?: string; // Tornando opcional
    idade: string;
    altura: string;
    genero: string;
    peso: string;
    signo: string;
    localDeTreinamento: string;
    patente: string;
    exercito: string;
    saga?: string; // Tornando opcional
    imgSrc: string;
    dica1?: string; // Tornando opcional
    dica2?: string; // Tornando opcional
};

// Tipo de comparação para cada tentativa
export type AttemptComparison = {
    nome: string;
    idKey: string; // Adicionado idKey para persistência e localização do histórico
    idade: string; // status: 'green' | 'up' | 'down' | 'red'
    altura: string; // status: 'green' | 'up' | 'down' | 'red'
    peso: string; // status: 'green' | 'up' | 'down' | 'red' | 'ignore'
    genero: string; // status: 'green' | 'red'
    signo: string; // status: 'green' | 'red'
    localDeTreinamento: string; // status: 'green' | 'red'
    patente: string; // status: 'green' | 'red'
    exercito: string; // status: 'green' | 'red'
    saga: string; // status: 'green' | 'red'
    imgSrc: string; // URL da imagem
    guessCharacter: Character; // O objeto completo do personagem chutado
};
