import React, { useState, useEffect, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { defineWord, getSavedWords, saveWord, deleteSavedWords, getHistory, saveHistory, deleteHistoryItems } from './Services/wordService';
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
    if (!user) {
      setError('Please log in to use the dictionary.');
      return;
    }
    setLoading(true);
    setError('');
    setDefinition({});

    try {
      const data = await defineWord(wordToSearch);
      setDefinition(data);

      // Save to history after successfully fetching
      const newHistoryItem = await saveHistory({ word: wordToSearch });
      setHistory((prev) => {
        const existingIndex = prev.findIndex(item => item.word === newHistoryItem.word);
        if (existingIndex !== -1) {
          const newHistory = [...prev];
          newHistory[existingIndex] = newHistoryItem;
          return newHistory;
        } else {
          return [newHistoryItem, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date));
        }
      });

    } catch (err) {
      console.error(err);
      setError('Failed to fetch definition.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDefinition(word);
  };

  const handleSave = async () => {
    if (!definition.meaning || !user || savedWords.some((item) => item.word === word)) {
      return;
    }
    try {
      const newEntry = { word, synonyms: definition.synonyms, meaning: definition.meaning };
      const savedWord = await saveWord(newEntry);
      setSavedWords([savedWord, ...savedWords]);
    } catch (error) {
      console.error('Failed to save word', error);
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
    fetchDefinition(entry.word);
    navigate('/');
  };


  // to handle background animation...
  // const canvasRef = useRef(null);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return; // <- avoid running early

  //   const ctx = canvas.getContext("2d");
  //   function resizeCanvas() {
  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;
  //   }
  //   resizeCanvas();
  //   window.addEventListener("resize", resizeCanvas);

  //   // --- Stars setup ---
  //   const stars = [];
  //   const numStars = 300;
  //   for (let i = 0; i < numStars; i++) {
  //     stars.push({
  //       x: Math.random() * canvas.width,
  //       y: Math.random() * canvas.height,
  //       radius: Math.random() * 2 + 1,
  //       twinkle: Math.random() * 0.05 + 0.02,
  //       alpha: Math.random() * 0.5 + 0.5,
  //     });
  //   }

  //   class Ripple {
  //     constructor(x, y) {
  //       this.x = x;
  //       this.y = y;
  //       this.radius = 0;
  //       this.alpha = 0.5;
  //     }
  //     update() {
  //       this.radius += 2;
  //       this.alpha -= 0.01;
  //     }
  //     draw() {
  //       ctx.beginPath();
  //       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  //       ctx.strokeStyle = `rgba(255,255,255,${this.alpha})`;
  //       ctx.lineWidth = 2;
  //       ctx.stroke();
  //     }
  //   }

  //   const ripples = [];

  //   function animate() {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     // Stars
  //     stars.forEach((star) => {
  //       star.alpha += star.twinkle;
  //       if (star.alpha > 1 || star.alpha < 0.3) star.twinkle *= -1;
  //       ctx.beginPath();
  //       ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
  //       ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
  //       ctx.fill();
  //     });

  //     // Ripples
  //     for (let i = ripples.length - 1; i >= 0; i--) {
  //       ripples[i].update();
  //       ripples[i].draw();
  //       if (ripples[i].alpha <= 0) ripples.splice(i, 1);
  //     }

  //     requestAnimationFrame(animate);
  //   }

  //   const handleClick = (e) => ripples.push(new Ripple(e.clientX, e.clientY));
  //   const handleMove = (e) => ripples.push(new Ripple(e.clientX, e.clientY));

  //   canvas.addEventListener("click", handleClick);
  //   canvas.addEventListener("mousemove", handleMove);

  //   animate();
  //   console.log("Animation working.....");
  //   return () => {
  //     window.removeEventListener("resize", resizeCanvas);
  //     canvas.removeEventListener("click", handleClick);
  //     canvas.removeEventListener("mousemove", handleMove);
  //   };
  // }, []);


  return (
      // <div className="min-h-screen bg-[#F2F0E9] dark:bg-[#0F2B2C] transition-colors duration-300">
      <div className="min-h-screen bg-gradient-to-br from-[#0F2027] to-[#2C5364]  transition-colors duration-300">

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
