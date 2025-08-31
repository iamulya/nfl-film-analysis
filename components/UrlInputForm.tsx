
import React, { useState } from 'react';

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  error: string | null;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <div className="w-full max-w-2xl text-center">
      <h2 className="text-4xl font-extrabold text-white mb-2">
        Enter the Gridiron
      </h2>
      <p className="text-lg text-gray-400 mb-8">
        Provide a Football game's YouTube URL and let Coach JJ break down the film.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-grow px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          required
        />
        <button
          type="submit"
          className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-transform transform hover:scale-105"
        >
          Analyze
        </button>
      </form>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
};

export default UrlInputForm;