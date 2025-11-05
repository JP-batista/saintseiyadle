// src/app/classico/components/GuessForm.tsx
import React from "react";
import { Character } from "../types"; // Importe o tipo

type GuessFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  suggestions: Character[];
  showDropdown: boolean;
  onSuggestionClick: (suggestion: Character) => void;
};

const GuessForm: React.FC<GuessFormProps> = ({
  onSubmit,
  input,
  onInputChange,
  onKeyDown,
  suggestions,
  showDropdown,
  onSuggestionClick,
}) => {
  return (
    <form
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
        />

        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 custom-scrollbar">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.nome}
                className="flex items-center p-2.5 m-1 hover:bg-yellow-500/10 hover:border-yellow-500/30 border border-transparent rounded-lg cursor-pointer suggestion-item smooth-transition"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <img
                  src={suggestion.imgSrc || "/default-image.png"}
                  alt={suggestion.nome || "Sem nome"}
                  className="w-10 h-10 rounded-lg mr-3 shadow-lg"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-100">
                    {suggestion.nome || "Desconhecido"}
                  </span>
                  <span className="text-xs text-gray-400 italic">
                    {suggestion.titulo || "Sem titulo"}
                  </span>
                </div>
              </li>
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

export default GuessForm;