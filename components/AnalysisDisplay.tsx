
import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import PlayCard from './PlayCard';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentPlayIndex((prevIndex) =>
      prevIndex === 0 ? analysis.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentPlayIndex((prevIndex) =>
      prevIndex === analysis.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToPlay = (index: number) => {
    setCurrentPlayIndex(index);
  }

  if (!analysis || analysis.length === 0) {
    return <p>No analysis available.</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 z-10 flex items-center -translate-x-12">
            <button
            onClick={goToPrevious}
            className="bg-gray-800/50 text-white rounded-full p-2 hover:bg-gray-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Previous play"
            >
            <ChevronLeftIcon />
            </button>
        </div>

        <div className="overflow-hidden">
             <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPlayIndex * 100}%)` }}
            >
              {analysis.map((play, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <PlayCard play={play} />
                </div>
              ))}
            </div>
        </div>

        <div className="absolute inset-y-0 right-0 z-10 flex items-center translate-x-12">
            <button
            onClick={goToNext}
            className="bg-gray-800/50 text-white rounded-full p-2 hover:bg-gray-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Next play"
            >
            <ChevronRightIcon />
            </button>
        </div>
      </div>
       <div className="flex justify-center items-center mt-6 space-x-2">
        {analysis.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPlay(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentPlayIndex === index ? 'bg-indigo-500 w-6' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            aria-label={`Go to play ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalysisDisplay;