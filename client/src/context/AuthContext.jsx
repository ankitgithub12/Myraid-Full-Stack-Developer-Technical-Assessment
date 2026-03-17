import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wrapper that keeps localStorage in sync
  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('userInfo', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userInfo');
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Use stored info to avoid flicker, then confirm with the server
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
          // Silently re-validate with the backend using the httpOnly cookie
          const { data } = await api.get('/users/profile');
          setUser(data); // Refresh with latest from DB
        }
      } catch (error) {
        // Token is invalid/expired — clear everything
        setUserState(null);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser(data);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout API failures
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
