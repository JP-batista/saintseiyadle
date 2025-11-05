// src/app/classico/components/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-yellow-400 text-2xl">Carregando...</div>
    </div>
  );
};

export default LoadingSpinner;