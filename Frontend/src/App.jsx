import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { getSavedWords, saveWord, deleteSavedWords, getHistory, saveHistory, deleteHistoryItems } from './Services/wordService';
import Navbar from './Components/Navbar';
import ThemeToggleButton from './Components/ThemeToggleButton';
import HomePage from './Pages/HomePage';
import SavedPage from './Pages/SavedPage';
import HistoryPage from './Pages/HistoryPage';
import AuthPage from './Pages/AuthPage';
import AuthCallback from './Pages/AuthCallback';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

function MainApp() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [definition, setDefinition] = useState({});
  const [savedWords, setSavedWords] = useState([]);
  const [history, setHistory] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [words, history] = await Promise.all([getSavedWords(), getHistory()]);
          setSavedWords(words);
          setHistory(history);
        } catch (error) {
          console.error('Failed to fetch data', error);
        }
      } else {
        setSavedWords([]);
        setHistory([]);
      }
    };
    fetchData();
  }, [user]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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

      const regex = new RegExp('<div id="synonyms-data"[^>]*>(.*?)</div>');
      const synonymsMatch = outputText.match(regex);
      const synonymsList = synonymsMatch ? synonymsMatch[1].trim() : '';

      const cleanRegex = new RegExp('<div id="synonyms-data"[^>]*>.*?</div>');
      const cleanedMeaning = outputText.replace(cleanRegex, '').trim();

      setDefinition({
        meaning: `<p>${cleanedMeaning}</p>`, 
        synonyms: synonymsList,
      });

      if (user) {
        try {
          const newHistoryItem = await saveHistory(wordToSearch);
          setHistory((prev) => {
            const existingIndex = prev.findIndex(item => item.word === newHistoryItem.word);
            if (existingIndex !== -1) {
              const newHistory = [...prev];
              newHistory[existingIndex] = newHistoryItem;
              return newHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else {
              return [newHistoryItem, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date));
            }
          });
        } catch (error) {
          console.error('Failed to save history', error);
        }
      }

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

  const handleSave = async () => {
    if (!definition.meaning || !user) return;
    const newEntry = { word, synonyms: definition.synonyms, meaning: definition.meaning };
    
    if (!savedWords.some((item) => item.word === word)) {
      try {
        const savedWord = await saveWord(newEntry);
        setSavedWords([savedWord, ...savedWords]);
      } catch (error) {
        console.error('Failed to save word', error);
      }
    }
  };

  const handleDeleteSavedWords = async (ids) => {
    try {
      await deleteSavedWords(ids);
      setSavedWords(savedWords.filter(item => !ids.includes(item._id)));
    } catch (error) {
      console.error('Failed to delete saved words', error);
    }
  };

  const handleDeleteHistoryItems = async (ids) => {
    try {
      await deleteHistoryItems(ids);
      setHistory(history.filter(item => !ids.includes(item._id)));
    } catch (error) {
      console.error('Failed to delete history items', error);
    }
  };

  const handleViewEntry = (entry) => {
    setWord(entry.word);
    if (entry.meaning) { // It's a saved word
      setDefinition({
        meaning: entry.meaning,
        synonyms: entry.synonyms,
      });
    } else { // It's a history item
      fetchDefinition(entry.word);
    }
    navigate('/');
  };

  const promptFor = (searchWord) =>
    `What is the meaning of the word "${searchWord}"? Provide a detailed explanation including its part of speech, definitions, Synonyms and an example sentence. Please format the entire response using simple HTML tags. Use tags like <h3> for headings, <b> for bold text, and <ul>/<ol>/<li> for lists where appropriate. IMPORTANT: Also, provide a comma-separated list of 4-5 synonyms inside a hidden div with the id "synonyms-data". For example: <div id="synonyms-data" style="display:none;">synonym1, synonym2, synonym3, synonym4</div>`;

  return (
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
            <SavedPage savedWords={savedWords} onView={handleViewEntry} onDelete={handleDeleteSavedWords} />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage history={history} onView={handleViewEntry} onDelete={handleDeleteHistoryItems} />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Navbar />
    </div>
  );
}

export default App;
