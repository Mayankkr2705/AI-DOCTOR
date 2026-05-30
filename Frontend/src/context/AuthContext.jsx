import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const data = await authAPI.getcurr();
          setUser(data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authAPI.register(name, email, password);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
    setToken(null);
    setUser(null);
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@medicareai.com',
      role: 'guest'
    };
    setUser(guestUser);
    setToken('guest-token');
    localStorage.setItem('isGuest', 'true');
    return { success: true };
  };

  const updateProfile = async (name, email, password) => {
    try {
      const data = await authAPI.updateProfile(name, email, password);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed. Please try again.'
      };
    }
  };

  const deleteProfile = async () => {
    try {
      await authAPI.deleteProfile();
      logout();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Account deletion failed. Please try again.'
      };
    }
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      const data = await authAPI.googleLogin(googleToken);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Google login failed. Please try again.' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginAsGuest,
    updateProfile,
    deleteProfile,
    loginWithGoogle,
    isAuthenticated: !!user,
    isGuest: localStorage.getItem('isGuest') === 'true'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
