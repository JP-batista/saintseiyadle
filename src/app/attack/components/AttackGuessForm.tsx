// src/app/attack/components/AttackGuessForm.tsx
import React, { memo, useId, useRef, useState, useEffect } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { Attack } from "../../i18n/types"; 

type SuggestionItemProps = {
  suggestion: Attack;
  onSelect: (idAttack: string) => void;
  t: ReturnType<typeof useTranslation>['t'];
};

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  onSelect,
  t,
}) => {
  const handleClick = () => {
    onSelect(suggestion.idAttack);
  };

  return (
    <li
      role="option"
      className="flex items-center p-2.5 m-1 hover:bg-yellow-500/10 hover:border-yellow-500/30 border border-transparent rounded-lg cursor-pointer suggestion-item smooth-transition"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleClick();
      }}
      tabIndex={0}
    >
      <span className="font-semibold text-gray-100 truncate p-1">
        {suggestion.name || t("form_default_name")}
      </span>
    </li>
  );
};

type AttackGuessFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: Attack[]; 
  showDropdown: boolean;
  onSuggestionClick: (idAttack: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const AttackGuessForm: React.FC<AttackGuessFormProps> = ({
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
  const [shouldSubmit, setShouldSubmit] = useState(false);

  useEffect(() => {
    if (shouldSubmit && formRef.current) {
      formRef.current.requestSubmit();
      setShouldSubmit(false);
    }
  }, [shouldSubmit]);

  const handleSuggestionSelect = (idAttack: string) => {
    onSuggestionClick(idAttack);
    setShouldSubmit(true);
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
          onKeyDown={onKeyDown}
          placeholder={t("attack_form_placeholder")} 
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
                key={suggestion.idAttack || `${suggestion.name}-${index}`}
                suggestion={suggestion}
                onSelect={handleSuggestionSelect}
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