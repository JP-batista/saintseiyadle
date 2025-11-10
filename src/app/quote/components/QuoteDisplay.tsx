"use client";

import React, { memo } from 'react';

type QuoteDisplayProps = {
  quotes: string[];
};

const QuoteDisplayComponent: React.FC<QuoteDisplayProps> = ({ quotes }) => {
  return (
    <div className="w-full max-w-xl text-center mb-8 animate-fadeInUp">
      
      <div className="flex flex-col items-center space-y-4">
        
        {quotes.map((text, index) => (

          <div 
            key={index} 
            className="w-full backdrop-gradient backdrop-blur-custom border border-gray-700/50 rounded-2xl shadow-2xl p-6"
          >
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 italic">
              &ldquo;{text}&rdquo;
            </p>
          </div>

        ))}
        
      </div>
    </div>
  );
};

export default memo(QuoteDisplayComponent);