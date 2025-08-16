import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './Components/Navbar';
import ThemeToggleButton from './Components/ThemeToggleButton';
import HomePage from './Pages/HomePage';
import SavedPage from './Pages/SavedPage';
import HistoryPage from './Pages/HistoryPage';
import AuthPage from './Pages/AuthPage';
import AuthCallback from './Pages/AuthCallback';
import ProtectedRoute from './Components/ProtectedRoute';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [definition, setDefinition] = useState({});
  const [savedWords, setSavedWords] = useState([]);
  const [history, setHistory] = useState([]);

  const promptFor = (searchWord) =>
    `What is the meaning of the word "${searchWord}"? Provide a detailed explanation including its part of speech, definitions, Synonyms and an example sentence. Please format the entire response using simple HTML tags. Use tags like <h3> for headings, <b> for bold text, and <ul>/<ol>/<li> for lists where appropriate. IMPORTANT: Also, provide a comma-separated list of 4-5 synonyms inside a hidden div with the id "synonyms-data". For example: <div id="synonyms-data" style="display:none;">synonym1, synonym2, synonym3, synonym4</div>`;

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Generic Gemini API fetcher
  const fetchDefinition = async (wordToSearch) => {
    if (!wordToSearch.trim()) return;
    setLoading(true);
    setError('');
    setDefinition({});

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const model = 'gemini-1.5-flash-latest';

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptFor(wordToSearch) }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      let outputText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No definition found.';

      outputText = outputText.replace(/```[a-zA-Z]*\n?/g, '').trim();

      let synonymsMatch = outputText.match(/<div id="synonyms-data"[^>]*>(.*?)<\/div>/);
      let synonymsList = synonymsMatch ? synonymsMatch[1].trim() : '';

      let cleanedMeaning = outputText.replace(/<div id="synonyms-data"[^>]*>.*?<\/div>/, '').trim();

      setDefinition({
        meaning: `<p>${cleanedMeaning}</p>`,
        synonyms: synonymsList,
      });

      setHistory((prev) => {
        if (prev.some((h) => h.word === wordToSearch)) return prev;
        return [{ word: wordToSearch, date: new Date().toLocaleString() }, ...prev];
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch definition from Gemini API.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDefinition(word);
  };

  const handleSave = () => {
    if (!definition.meaning) return;
    const newEntry = { word, synonyms: definition.synonyms, meaning: definition.meaning };
    if (!savedWords.some((item) => item.word === word)) {
      setSavedWords([newEntry, ...savedWords]);
    }
  };

  const handleViewEntry = (entry) => {
    if (typeof entry === 'string') {
      setWord(entry);
      fetchDefinition(entry);
    } else {
      setWord(entry.word);
      setDefinition({
        meaning: entry.meaning,
        synonyms: entry.synonyms,
      });
    }
    setActivePage('home');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#F2F0E9] dark:bg-[#0F2B2C] transition-colors duration-300">
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          
          <Routes>
            <Route path="/" element={
              <HomePage
                word={word}
                setWord={setWord}
                handleSubmit={handleSubmit}
                loading={loading}
                error={error}
                definition={definition}
                onSave={handleSave}
                isSaved={savedWords.some((item) => item.word === word)}
              />
            } />
            
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route path="/saved" element={
              <ProtectedRoute>
                <SavedPage savedWords={savedWords} onView={handleViewEntry} />
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryPage history={history} onView={handleViewEntry} />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Navbar />
        </div>
      </Router>
    </AuthProvider>
  );
}
