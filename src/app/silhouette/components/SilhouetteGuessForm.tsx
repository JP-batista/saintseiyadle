// src/app/silhouette/components/SilhouetteGuessForm.tsx
"use client";

import React, { memo, useId, useRef, useState, useEffect } from "react";
import { Armor } from "../types"; 
import { useTranslation } from "../../i18n/useTranslation";

type SuggestionItemProps = {
  suggestion: Armor;
  isSelected: boolean;
  onSelect: (name: string) => void;
  t: ReturnType<typeof useTranslation>['t'];
};

const SuggestionItem: React.FC<SuggestionItemProps> = memo(({
  suggestion,
  isSelected,
  onSelect,
  t,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isSelected) {
      ref.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [isSelected]);

  const handleClick = () => {
    onSelect(suggestion.name);
  };

  return (
    <li
      ref={ref}
      role="option"
      aria-selected={isSelected}
      className={`
        flex items-center p-2.5 m-1 
        border border-transparent rounded-lg 
        cursor-pointer suggestion-item smooth-transition
        ${isSelected ? 'bg-yellow-500/10 border-yellow-500/30' : 'hover:bg-gray-700/50'}
      `}
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()} 
    >
      <img
        src={suggestion.revealedImg} 
        alt={suggestion.name}
        className="w-10 h-10 rounded-lg mr-3 shadow-lg flex-shrink-0 object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-gray-100 truncate">
          {suggestion.name}
        </span>
        <span className="text-xs text-gray-400 italic truncate">
          {suggestion.knight}
        </span>
      </div>
    </li>
  );
});
SuggestionItem.displayName = 'SuggestionItem';

type GuessFormProps = {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: Armor[];
  showDropdown: boolean;
  onSubmit: (guessName: string) => void; 
  error: string | null;
};

const SilhouetteGuessForm: React.FC<GuessFormProps> = ({
  onSubmit,
  input,
  onInputChange,
  suggestions,
  showDropdown,
  error,
}) => {
  const { t } = useTranslation();
  const listboxId = useId();
  
  const [selectedSuggestion, setSelectedSuggestion] = useState<Armor | null>(null);

  useEffect(() => {
    setSelectedSuggestion(suggestions[0] || null);
  }, [suggestions]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const guess = selectedSuggestion?.name || input;
    if (guess.trim()) {
      onSubmit(guess.trim());
    }
  };

  const handleSuggestionClick = (name: string) => {
    onSubmit(name); 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    const currentIndex = suggestions.findIndex(
      (s) => s.name === selectedSuggestion?.name
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % suggestions.length;
      setSelectedSuggestion(suggestions[nextIndex]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + suggestions.length) % suggestions.length;
      setSelectedSuggestion(suggestions[prevIndex]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start space-x-2 sm:space-x-4 mb-8"
      autoComplete="off"
    >
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder={t("silhouette_form_placeholder")}
          className="p-3.5 sm:p-4 w-full text-lg text-center text-gray-100 bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl placeholder:text-gray-400 transition-all duration-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
        />

        {error && !showDropdown && (
          <div className="absolute left-0 right-0 mt-2">
            <div className="p-3 bg-red-800/90 backdrop-blur-md border border-red-500/50 rounded-xl shadow-2xl text-center text-white font-semibold animate-shake-error">
              {error}
            </div>
          </div>
        )}

        {showDropdown && suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 mt-2 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 custom-scrollbar"
          >
            {suggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion.name}
                suggestion={suggestion}
                isSelected={suggestion.name === selectedSuggestion?.name}
                onSelect={handleSuggestionClick}
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

export default memo(SilhouetteGuessForm);