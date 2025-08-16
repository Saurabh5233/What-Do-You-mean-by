import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';
import { authService } from '../Services/authService';

const AuthCallback = () => {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const token = new URLSearchParams(location.search).get('token');
      if (token) {
        try {
          localStorage.setItem('token', token);
          // Assuming authService.getUser() can now use the token we just set
          const user = await authService.getUser();
          loginWithToken(user, token);
          const redirectTo = localStorage.getItem('postLoginRedirect') || '/';
          localStorage.removeItem('postLoginRedirect');
          navigate(redirectTo, { replace: true });
        } catch (err) {
          setError(err.message || 'Google login failed. Please try again.');
        }
      } else {
        setError('Invalid Google callback. No token found.');
      }
    };

    processCallback();
  }, [loginWithToken, location.search, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate('/auth')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Go to Login
        </button>
      </div>
    );
  }

  return <LoadingSpinner />;
};

export default AuthCallback;


