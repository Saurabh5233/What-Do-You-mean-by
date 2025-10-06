import React from 'react';
import { HiMiniSpeakerWave } from "react-icons/hi2";

export default function HomePage({ 
  word, setWord, handleSubmit, loading, error, definition, onSave, isSaved 
}) {

  const speakText = ()=>{
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }

    const text = word;
    if(text.trim() === ""){
      // It might be better to not show an alert if the input is empty,
      // as the speaker icon is only visible when there's a word and definition.
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang= "en-US";
    speechSynthesis.speak(utterance);      
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8">
      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-8 transition-colors duration-300">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] text-center mb-8">
          What Do You Mean By?
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            className="flex-grow w-full sm:w-auto text-lg px-5 py-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors duration-300"
            placeholder="Enter a word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[var(--accent-primary)] text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center my-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {definition && Object.keys(definition).length > 0 && (
          <div className="mt-8 p-6 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Definition</h2>
              <HiMiniSpeakerWave 
                onClick={speakText} 
                className='text-4xl text-green-600 cursor-pointer hover:scale-110 transition-transform'
              />
              <button 
                onClick={onSave} 
                disabled={isSaved}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isSaved ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-[var(--accent-secondary)] text-white hover:opacity-90'}`}
              >
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className="space-y-3 text-[var(--text-primary)]">
              {Object.entries(definition).map(([key, value]) => (
                <p key={key}>
                  <span dangerouslySetInnerHTML={{ __html: key }} />: {value}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
