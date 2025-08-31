
import React, { useState, useCallback } from 'react';
import UrlInputForm from './components/UrlInputForm';
import LoadingIndicator from './components/LoadingIndicator';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeVideo } from './services/geminiService';
import type { AnalysisResult } from './types';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = useCallback(async (url: string) => {
    if (!url) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setYoutubeUrl(url);

    try {
      const result = await analyzeVideo(url);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to analyze the video. The AI might be busy, or the URL is invalid. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setYoutubeUrl('');
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center">
          <LogoIcon />
        </div>
         {analysis && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors duration-200"
          >
            New Analysis
          </button>
        )}
      </header>

      <main className="w-full flex-grow flex flex-col items-center justify-center">
        {!analysis && !isLoading && (
          <UrlInputForm onSubmit={handleAnalysis} error={error} />
        )}
        {isLoading && <LoadingIndicator />}
        {analysis && !isLoading && <AnalysisDisplay analysis={analysis} />}
      </main>
       <footer className="w-full text-center text-gray-500 mt-12 text-sm">
        <p>Powered by Gemini. For educational and entertainment purposes only.</p>
      </footer>
    </div>
  );
};

export default App;