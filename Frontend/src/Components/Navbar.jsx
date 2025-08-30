import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Feedback from './Feedback';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const menuRef = useRef(null);

  const NavButton = ({ path, onClick, icon, label, isActive }) => (
    <button
      onClick={onClick || (() => navigate(path))}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors 
        ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  // Close menu if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // A bit of a hack to not immediately close when the profile button is clicked
        if (!event.target.closest('#profile-button')) {
          setProfileMenuOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);


  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] shadow-t-lg border-t border-[var(--border-color)] transition-colors duration-300">
      {isFeedbackOpen && <Feedback onClose={() => setFeedbackOpen(false)} />}
      {isProfileMenuOpen && user && (
        <div ref={menuRef} className="absolute bottom-full mb-2 w-full max-w-2xl mx-auto flex justify-end pr-2">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg w-48">
                <div className="p-4 border-b border-[var(--border-color)]">
                    <p className="font-semibold text-[var(--text-primary)]">{user.name || 'Profile'}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                </div>
                <button
                    onClick={() => {
                        setFeedbackOpen(true);
                        setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                >
                    Feedback
                </button>
                <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 text-sm text-white bg-[red] hover:bg-[#7d3232] rounded-b-lg"
                >
                    Logout
                </button>
            </div>
        </div>
      )}
      <div className="flex justify-around max-w-2xl mx-auto">
        <NavButton path="/" label="Home" isActive={location.pathname === '/'} icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        } />
        
        <NavButton path="/saved" label="Saved" isActive={location.pathname === '/saved'} icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        } />
        
        <NavButton path="/history" label="History" isActive={location.pathname === '/history'} icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        } />

        {!loading && (
            user ? (
                <div id="profile-button" className="w-full">
                    <NavButton 
                        onClick={() => setProfileMenuOpen(o => !o)} 
                        label="Profile" 
                        isActive={isProfileMenuOpen}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        } 
                    />
                </div>
            ) : (
                <NavButton path="/auth" label="Login" isActive={location.pathname === '/auth'} icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1" />
                    </svg>
                } />
            )
        )}
      </div>
    </footer>
  );
}
