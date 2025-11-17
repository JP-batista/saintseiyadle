"use client";

// 1. Importar useState, Grid e List
import React, { useMemo, useState, memo } from 'react';
import { useLocaleStore } from '../stores/useLocaleStore';
import { characterDataMap } from '../i18n/config';
import { Character } from '../classic/types'; // Reutiliza o tipo do Modo Clássico
import { useTranslation } from '../i18n/useTranslation';

// Componentes da UI
import Logo from '../components/Logo';
import GameModeButtons from '../components/GameModeButtons';
// 2. Importar ícones para os botões de visualização
import { Search, ChevronDown, Grid, List } from 'lucide-react';

// --- Sub-componente para a Ficha do Personagem (Grid) ---
const AttributeRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
  <div className="text-sm p-2 rounded-lg transition-colors hover:bg-white/5">
    <span className="font-semibold text-gray-400">{label}: </span>
    <span className="text-white break-words">{value || "N/A"}</span>
  </div>
);

const CharacterCard: React.FC<{ character: Character }> = memo(({ character }) => {
  return (
    <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-yellow-500/20 group h-full flex flex-col">
      <div className="overflow-hidden">
        <img
          src={character.imgSrc}
          alt={character.nome}
          className="w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-yellow-400 mb-1 truncate">
          {character.nome}
        </h2>
        <p className="text-sm text-gray-400 italic mb-4 h-5 truncate">
          {character.titulo}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0 flex-grow">
          <AttributeRow label="Patente" value={character.patente} />
          <AttributeRow label="Exército" value={character.exercito} />
          <AttributeRow label="Signo" value={character.signo} />
          <AttributeRow label="Idade" value={character.idade} />
          <AttributeRow label="Altura" value={character.altura} />
          <AttributeRow label="Peso" value={character.peso} />
          <AttributeRow label="Gênero" value={character.genero} />
          <AttributeRow label="Saga" value={character.saga} />
          <div className="sm:col-span-2">
            <AttributeRow label="Treinamento" value={character.localDeTreinamento} />
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700/50">
            <span className="font-semibold text-gray-500 text-xs">imgSrc: </span>
            <span className="text-xs text-gray-500 break-all">{character.imgSrc}</span>
        </div>
      </div>
    </div>
  );
});
CharacterCard.displayName = "CharacterCard";

// 
// 3. --- NOVO Sub-componente para a Visualização em Lista ---
//
const CharacterListRow: React.FC<{ character: Character }> = memo(({ character }) => {
  return (
    <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-yellow-500/20 group flex flex-col sm:flex-row">
      {/* Imagem (Esquerda) */}
      <img
        src={character.imgSrc}
        alt={character.nome}
        className="w-full sm:w-80 h-48 sm:h-auto object-cover object-center transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
        loading="lazy"
      />
      {/* <img
          src={character.imgSrc}
          alt={character.nome}
          className="w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        /> */}
      {/* Informações (Direita) */}
      <div className="p-4 sm:p-5 flex-1">
        <h2 className="text-2xl font-bold text-yellow-400 mb-1 truncate">
          {character.nome}
        </h2>
        <p className="text-sm text-gray-400 italic mb-4 h-5 truncate">
          {character.titulo}
        </p>

        {/* Grid de Atributos (3 colunas em telas médias) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-0">
          <AttributeRow label="Patente" value={character.patente} />
          <AttributeRow label="Exército" value={character.exercito} />
          <AttributeRow label="Signo" value={character.signo} />
          <AttributeRow label="Idade" value={character.idade} />
          <AttributeRow label="Altura" value={character.altura} />
          <AttributeRow label="Peso" value={character.peso} />
          <AttributeRow label="Gênero" value={character.genero} />
          <AttributeRow label="Saga" value={character.saga} />
          
          {/* Ocupa 3 colunas em telas médias */}
          <div className="sm:col-span-2 md:col-span-3">
            <AttributeRow label="Treinamento" value={character.localDeTreinamento} />
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-700/50">
            <span className="font-semibold text-gray-500 text-xs">imgSrc: </span>
            <span className="text-xs text-gray-500 break-all">{character.imgSrc}</span>
        </div>
      </div>
    </div>
  );
});
CharacterListRow.displayName = "CharacterListRow";


// --- Componente Principal da Página ---

// 4. Definir o tipo para o modo de visualização
type ViewMode = 'grid' | 'list';

export default function CharactersPage() {
  const { t } = useTranslation();
  const locale = useLocaleStore((state) => state.locale);

  // Carrega todos os personagens
  const allCharacters = useMemo(() => {
    const dataModule = characterDataMap[locale] || characterDataMap['pt'];
    return (dataModule as any).default as Character[] || [];
  }, [locale]);

  // 5. Adicionar estado para o modo de visualização
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroSaga, setFiltroSaga] = useState("");
  const [filtroSigno, setFiltroSigno] = useState("");
  const [filtroPatente, setFiltroPatente] = useState("");
  const [filtroExercito, setFiltroExercito] = useState("");

  // Gera as listas de opções para os <select>
  const getUniqueSortedOptions = (key: keyof Character) => {
    // @ts-ignore
    const options = [...new Set(allCharacters.map(c => c[key]).filter(Boolean))];
    return options.sort();
  };

  const sagas = useMemo(() => getUniqueSortedOptions('saga'), [allCharacters]);
  const signos = useMemo(() => getUniqueSortedOptions('signo'), [allCharacters]);
  const patentes = useMemo(() => getUniqueSortedOptions('patente'), [allCharacters]);
  const exercitos = useMemo(() => getUniqueSortedOptions('exercito'), [allCharacters]);

  // Filtra os personagens com base nos estados
  const filteredCharacters = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return allCharacters.filter(char => {
      if (searchTerm && !char.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch)) {
        return false;
      }
      if (filtroSaga && char.saga !== filtroSaga) return false;
      if (filtroSigno && char.signo !== filtroSigno) return false;
      if (filtroPatente && char.patente !== filtroPatente) return false;
      if (filtroExercito && char.exercito !== filtroExercito) return false;
      
      return true;
    });
  }, [
    allCharacters, 
    searchTerm, 
    filtroSaga, 
    filtroSigno, 
    filtroPatente, 
    filtroExercito
  ]);

  // Estilos comuns para os filtros
  const filterInputStyle = "w-full p-3 bg-gray-900/80 border-2 border-gray-700/50 rounded-xl text-white placeholder:text-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none transition-colors";
  const filterSelectStyle = `${filterInputStyle} cursor-pointer appearance-none pr-10`;
  
  // Estilos para os botões de visualização
  const viewButtonBase = "p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50";
  const viewButtonActive = "bg-yellow-500/20 text-yellow-400";
  const viewButtonInactive = "bg-gray-800/50 text-gray-400 hover:bg-gray-700/70";

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6 pt-20 sm:pt-24">
      <Logo />
      <GameModeButtons />

      {/* --- Barra de Filtros --- */}
      <div className="w-full max-w-6xl my-8">
        <div className="backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-6">
          
          {/* 6. Cabeçalho da Barra de Filtros (com botões de visualização) */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-400 text-center sm:text-left mb-4 sm:mb-0">
              Enciclopédia de Personagens ({filteredCharacters.length})
            </h2>
            
            {/* Botões de Visualização */}
            <div className="flex-shrink-0 flex items-center justify-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Visualização em Grid"
                className={`${viewButtonBase} ${viewMode === 'grid' ? viewButtonActive : viewButtonInactive}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="Visualização em Lista"
                className={`${viewButtonBase} ${viewMode === 'list' ? viewButtonActive : viewButtonInactive}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Grid de Filtros */}
          {/* ⬇️ MUDANÇA AQUI: Ajustado de 5 para 6 colunas em telas grandes ⬇️ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="relative sm:col-span-2 md:col-span-3 lg:col-span-2">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${filterInputStyle} pl-10`}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <select value={filtroSaga} onChange={(e) => setFiltroSaga(e.target.value)} className={filterSelectStyle}>
                <option value="">Todas as Sagas</option>
                {sagas.map(saga => <option key={saga} value={saga}>{saga}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* // ⬇️⬇️⬇️ FILTRO DE SIGNO (ADICIONADO) ⬇️⬇️⬇️ */}
            <div className="relative">
              <select value={filtroSigno} onChange={(e) => setFiltroSigno(e.target.value)} className={filterSelectStyle}>
                <option value="">Todos os Signos</option>
                {signos.map(signo => <option key={signo} value={signo}>{signo}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            
            {/* // ⬇️⬇️⬇️ FILTRO DE PATENTE (ADICIONADO) ⬇️⬇️⬇️ */}
            <div className="relative">
              <select value={filtroPatente} onChange={(e) => setFiltroPatente(e.target.value)} className={filterSelectStyle}>
                <option value="">Todas as Patentes</option>
                {patentes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* // ⬇️⬇️⬇️ FILTRO DO EXÉRCITO (JÁ EXISTENTE) ⬇️⬇️⬇️ */}
            <div className="relative">
              <select value={filtroExercito} onChange={(e) => setFiltroExercito(e.target.value)} className={filterSelectStyle}>
                <option value="">Todos os Exércitos</option>
                {exercitos.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {/* // ⬆️⬆️⬆️ FIM DA ADIÇÃO ⬆️⬆️⬆️ */}
            
          </div>
        </div>
      </div>

      {/* --- Grid de Resultados --- */}
      <div className="w-full max-w-6xl">
        {filteredCharacters.length > 0 ? (
          
          // 7. Renderização Condicional
          <>
            {/* Modo Grid */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCharacters.map(char => (
                  <CharacterCard key={char.idKey} character={char} />
                ))}
              </div>
            )}
            
            {/* Modo Lista */}
            {viewMode === 'list' && (
              <div className="flex flex-col gap-6">
                {filteredCharacters.map(char => (
                  <CharacterListRow key={char.idKey} character={char} />
                ))}
              </div>
            )}
          </>

        ) : (
          <div className="text-center text-gray-400 text-xl py-16">
            <p>Nenhum personagem encontrado com esses filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}