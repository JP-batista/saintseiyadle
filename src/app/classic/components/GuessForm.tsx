// src/app/classico/components/GuessForm.tsx
import React, { memo, useId, useRef, useState, useEffect } from "react"; // Importa hooks
import { Character } from "../types";

// ====================================================================
// Componente Memoizado do Item da Sugestão
// ====================================================================
type SuggestionItemProps = {
  suggestion: Character;
  // Renomeamos a prop para ser mais clara
  onSelect: (suggestion: Character) => void;
};

const SuggestionItem = memo(({
  suggestion,
  onSelect,
}: SuggestionItemProps) => {
  const handleClick = () => {
    onSelect(suggestion); // Apenas chama a nova função onSelect
  };

  return (
    <li
      key={suggestion.nome}
      role="option"
      className="flex items-center p-2.5 m-1 hover:bg-yellow-500/10 hover:border-yellow-500/30 border border-transparent rounded-lg cursor-pointer suggestion-item smooth-transition"
      onClick={handleClick}
      // Adicionado para submeter com "Enter" ao navegar com teclado
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }} 
      tabIndex={0} // Permite focar no item
    >
      <img
        src={suggestion.imgSrc || "/default-image.png"}
        alt={suggestion.nome || "Sem nome"}
        className="w-10 h-10 rounded-lg mr-3 shadow-lg flex-shrink-0"
      />
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-gray-100 truncate">
          {suggestion.nome || "Desconhecido"}
        </span>
        <span className="text-xs text-gray-400 italic truncate">
          {suggestion.titulo || "Sem titulo"}
        </span>
      </div>
    </li>
  );
});
SuggestionItem.displayName = "SuggestionItem";

// ====================================================================
// Componente Principal do Formulário (Modificado)
// ====================================================================

type GuessFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  suggestions: Character[];
  showDropdown: boolean;
  onSuggestionClick: (suggestion: Character) => void; // Prop original do pai
};

const GuessForm: React.FC<GuessFormProps> = ({
  onSubmit,
  input,
  onInputChange,
  onKeyDown,
  suggestions,
  showDropdown,
  onSuggestionClick, // Recebe a função do pai
}) => {
  const listboxId = useId();
  
  // 1. Criamos uma ref para o <form>
  const formRef = useRef<HTMLFormElement>(null);
  
  // 2. Criamos um estado local para "sinalizar" que queremos submeter
  const [shouldSubmit, setShouldSubmit] = useState(false);

  // 3. Este useEffect "escuta" a mudança no 'input' E a sinalização 'shouldSubmit'
  useEffect(() => {
    // Se nós sinalizamos para submeter E o input já foi atualizado...
    if (shouldSubmit && formRef.current) {
      // 4. ...Dispara a submissão do formulário programaticamente
      formRef.current.requestSubmit();
      
      // 5. Reseta a sinalização
      setShouldSubmit(false);
    }
    // 'input' é a dependência crucial. O efeito roda quando ele muda.
  }, [input, shouldSubmit]); 

  // 6. Esta é a nova função que o SuggestionItem chama
  const handleSuggestionSelect = (suggestion: Character) => {
    // 7. Chama a função original do pai para atualizar o 'input'
    onSuggestionClick(suggestion);
    
    // 8. Ativa a sinalização para o useEffect disparar
    setShouldSubmit(true);
  };

  return (
    <form
      ref={formRef} // 1. Atribui a ref ao formulário
      onSubmit={onSubmit}
      className="flex items-center space-x-2 sm:space-x-4 mb-8"
    >
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder="Digite o nome do cavaleiro"
          className="p-3.5 sm:p-4 w-full text-lg text-center text-gray-100 bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl placeholder:text-gray-400 transition-all duration-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          autoComplete="off"
        />

        {showDropdown && suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 mt-2 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 custom-scrollbar"
          >
            {suggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion.nome}
                suggestion={suggestion}
                onSelect={handleSuggestionSelect} // 6. Passa a nova função
              />
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 button-press hover-lift hover:from-yellow-600 hover:to-orange-600 hover:shadow-glow-yellow"
      >
        Tentar
      </button>
    </form>
  );
};

export default memo(GuessForm);