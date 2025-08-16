import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import AuthForm from '../Components/AuthForm';
import GoogleIcon from '../Components/GoogleIcon';


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [pageError, setPageError] = useState(location.state?.error || '');

  const from = location.state?.from?.pathname || '/';

  // Clear error from location state after displaying it so it doesn't persist on refresh
  useEffect(() => {
    if (location.state?.error) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = () => {
    // Store the 'from' path so we can return after the OAuth flow
    localStorage.setItem('postLoginRedirect', from);
    // Manually navigate to the backend's Google auth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/google`;
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setPageError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? 'Sign in to your account' : 'Join us today'}
          </p>
        </div>

        {pageError && <div className="text-center text-sm text-red-600 dark:text-red-400">{pageError}</div>}

        <AuthForm
          isLogin={isLogin}
          onAuthSuccess={handleAuthSuccess}
          onToggle={toggleForm}
        />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <GoogleIcon />
            <span className="ml-3">Sign in with Google</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
