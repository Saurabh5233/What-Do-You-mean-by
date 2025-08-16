import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../Components/AuthForm';
import GoogleIcon from '../Components/GoogleIcon';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [pageError, setPageError] = useState(location.state?.error || '');

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (location.state?.error) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('postLoginRedirect', from);
    window.location.href = `${import.meta.env.VITE_API_URL}/google`;
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setPageError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-[var(--bg-secondary)] rounded-2xl shadow-lg transition-colors duration-300">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-[var(--text-primary)]">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            {isLogin ? 'Sign in to your account' : 'Join us today'}
          </p>
        </div>

        {pageError && <div className="text-center text-sm text-red-500">{pageError}</div>}

        <AuthForm
          isLogin={isLogin}
          onAuthSuccess={handleAuthSuccess}
          onToggle={toggleForm}
        />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-[var(--border-color)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-[var(--border-color)] rounded-md shadow-sm bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] transition-colors duration-300"
          >
            <GoogleIcon />
            <span className="ml-3">Sign in with Google</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
              onClick={toggleForm}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
