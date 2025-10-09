import React from 'react';
import { FaSearch, FaSave, FaCheck, FaVolumeUp } from 'react-icons/fa';

const HomePage = ({
  word,
  setWord,
  handleSubmit,
  loading,
  error,
  definition,
  onSave,
  isSaved,
  language,
  onLanguageChange
}) => {

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ru', name: 'Russian' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ko', name: 'Korean' },
    { code: 'pt-BR', name: 'Brazilian Portuguese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Turkish' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2027] to-[#2C5364] text-white flex flex-col items-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-center my-8">
        What Do You Mean By?
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex items-center gap-2 mb-8">
        <div className="relative flex-grow">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Search for a word..."
            className="w-full p-4 pr-12 rounded-full bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
            <FaSearch size={20} />
          </button>
        </div>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="p-4 rounded-full bg-white/20 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-gray-800">
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      {loading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}

      {Object.keys(definition).length > 0 && (
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold mb-4">{word}</h2>
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${isSaved
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
            >
              {isSaved ? (
                <>
                  <FaCheck /> Saved
                </>
              ) : (
                <>
                  <FaSave /> Save
                </>
              )}
            </button>
          </div>

          {Object.entries(definition).map(([key, value]) => {
            if (!value) return null;
            // Don't render the Audio URL directly
            if (key === '<b>Audio</b>') return null;

            const formattedKey = key.replace(/<b>|<\/b>/g, '');

            // Special handling for Phonetic to add the play button
            if (formattedKey === 'Phonetic' && definition['<b>Audio</b>']) {
              return (
                <div key={key} className="mb-3">
                  <h3 className="font-semibold text-cyan-300 flex items-center gap-2">
                    {formattedKey}:
                    <button onClick={() => new Audio(definition['<b>Audio</b>']).play()} className="text-white/70 hover:text-white transition">
                      <FaVolumeUp />
                    </button>
                  </h3>
                  <p className="pl-2">{value}</p>
                </div>
              );
            }

            return (
              <div key={key} className="mb-3">
                <h3 className="font-semibold text-cyan-300">{formattedKey}:</h3>
                <p className="pl-2">{value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;