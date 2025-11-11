// src/app/attack/components/AttackGuessForm.tsx
import React, { memo, useId, useRef, useEffect } from "react";
import { CharacterBaseInfo } from "../../i18n/types";
import { useTranslation } from "../../i18n/useTranslation";

type SuggestionItemProps = {
  suggestion: CharacterBaseInfo;
  onSelect: (idKey: string) => void;
  t: ReturnType<typeof useTranslation>["t"];
};

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  onSelect,
  t,
}) => {
  const handleClick = () => {
    onSelect(suggestion.idKey);
  };

  return (
    <li
      role="option"
      className="flex items-center p-2.5 m-1 hover:bg-yellow-500/10 hover:border-yellow-500/30 border border-transparent rounded-lg cursor-pointer suggestion-item smooth-transition"
      onClick={handleClick}
      onKeyDown={(e) => {
        // MODIFICADO: Previne o envio padrão do formulário e chama o clique
        if (e.key === "Enter") {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
    >
      <img
        src={suggestion.imgSrc || "/default-image.png"}
        alt={suggestion.nome || t("form_default_name")}
        className="w-10 h-10 rounded-lg mr-3 shadow-lg flex-shrink-0"
        loading="eager"
        decoding="async"
      />
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-gray-100 truncate">
          {suggestion.nome || t("form_default_name")}
        </span>
        <span className="text-xs text-gray-400 italic truncate">
          {suggestion.patente || t("form_default_title")}
        </span>
      </div>
    </li>
  );
};

type GuessFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: CharacterBaseInfo[];
  showDropdown: boolean;
  onSuggestionClick: (idKey: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const AttackGuessForm: React.FC<GuessFormProps> = ({
  onSubmit,
  input,
  onInputChange,
  onKeyDown,
  suggestions,
  showDropdown,
  onSuggestionClick,
}) => {
  const { t } = useTranslation();
  const listboxId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  // LÓGICA MODIFICADA: Armazena o valor anterior de 'showDropdown'
  const prevShowDropdownRef = useRef(showDropdown);

  // LÓGICA MODIFICADA:
  // Este useEffect reage ao 'showDropdown' fechando (indo de true para false).
  // Isso unifica o comportamento do clique e do "Enter" (tratado no 'page.tsx').
  useEffect(() => {
    // Verifica se o dropdown ACABOU de fechar
    if (prevShowDropdownRef.current === true && showDropdown === false) {
      // Verifica se o 'input' atual é de fato uma das sugestões
      // (Impede submissões acidentais se o usuário fechar com 'Esc')
      const inputIsSuggestion = suggestions.some(
        (s) => s.nome === input || s.idKey === input
      );

      if (inputIsSuggestion && formRef.current) {
        formRef.current.requestSubmit(); // Envia o formulário
      }
    }

    // Atualiza o ref com o valor atual para a próxima renderização
    prevShowDropdownRef.current = showDropdown;
  }, [input, showDropdown, suggestions]); // Depende das props do pai

  // LÓGICA MODIFICADA: 'handleSuggestionSelect' apenas informa o pai
  const handleSuggestionSelect = (idKey: string) => {
    onSuggestionClick(idKey); // O pai vai atualizar o 'input' E 'showDropdown'
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex items-center space-x-2 sm:space-x-4 mb-8"
    >
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown} // O 'page.tsx' vai lidar com as setas
          placeholder={t("attack_form_placeholder_character")}
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
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.idKey || `${suggestion.nome}-${index}`}
                suggestion={suggestion}
                onSelect={handleSuggestionSelect} // 'handleSuggestionSelect' simplificado
                t={t}
              />
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 button-press hover-lift hover:from-yellow-600 hover:to-orange-600 hover:shadow-glow-yellow"
      >
        {t("form_button_try")}
      </button>
    </form>
  );
};

export default memo(
  AttackGuessForm,
  (prevProps, nextProps) =>
    prevProps.input === nextProps.input &&
    prevProps.showDropdown === nextProps.showDropdown &&
    prevProps.suggestions.length === nextProps.suggestions.length
);