
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "X-OG is running diagnostics...",
  "Reviewing the game tape...",
  "Identifying key moments and critical plays...",
  "Drawing up the X's and O's...",
  "Analyzing offensive and defensive schemes...",
  "Breaking down quarterback progressions...",
  "Evaluating offensive line protection...",
  "Checking for defensive tells...",
  "Mapping out receiver routes...",
  "Analyzing the battle in the trenches...",
  "Spotting blown coverages and missed assignments...",
  "Getting insights from the All-22 angle...",
  "Putting on the coach's headset...",
  "Highlighting the game-changing moments...",
  "Breaking down the blitz packages...",
  "Finding the gaps in the zone coverage...",
  "Finalizing the scouting report...",
  "The film doesn't lie, almost done...",
  "Preparing the final breakdown...",
  "This analysis is going for six...",
  "Don't worry, we're not on the play clock...",
  "Almost ready for the two-minute drill...",
  "Just a few more seconds...",
];

const LoadingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <svg
        className="animate-spin h-12 w-12 text-indigo-500 mb-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <h2 className="text-2xl font-semibold text-white mb-2">Analysis in Progress</h2>
      <p className="text-gray-400 w-full transition-opacity duration-500 ease-in-out">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingIndicator;