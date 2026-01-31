import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api';

// Mock user for bypassing authentication
const MOCK_USER = {
  id: '1',
  name: 'Guest User',
  email: 'guest@medicareai.com',
  role: 'user'
};

export const AuthProvider = ({ children }) => {
  // Always authenticated with mock user (bypass login)
  const [user, setUser] = useState(MOCK_USER);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('mock-token');

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    // Bypass login - always succeed
    setUser(MOCK_USER);
    setToken('mock-token');
    return { success: true };
  };

  const register = async (name, email, password) => {
    // Bypass registration - always succeed
    setUser({ ...MOCK_USER, name: name || 'Guest User', email: email || 'guest@medicareai.com' });
    setToken('mock-token');
    return { success: true };
  };

  const logout = () => {
    // Bypass logout - keep user logged in
    // Uncomment below to enable actual logout:
    // localStorage.removeItem('token');
    // setToken(null);
    // setUser(null);
    console.log('Logout bypassed for development');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
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
