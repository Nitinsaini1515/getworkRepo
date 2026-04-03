import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginRequest, registerRequest, fetchCurrentUser } from '../services/authService.js';
import { getApiErrorMessage } from '../utils/getApiErrorMessage.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    setIsAuthenticated(true);
    localStorage.setItem('getwork_user', JSON.stringify(nextUser));
    localStorage.setItem('getwork_token', nextToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('getwork_user');
    localStorage.removeItem('getwork_token');
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('getwork_token');
    if (!storedToken) {
      logout();
      return null;
    }
    try {
      const u = await fetchCurrentUser();
      setUser(u);
      localStorage.setItem('getwork_user', JSON.stringify(u));
      return u;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('getwork_token');
      const storedUser = localStorage.getItem('getwork_user');

      if (storedToken && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setToken(storedToken);
          setIsAuthenticated(true);
          const u = await fetchCurrentUser();
          setUser(u);
          localStorage.setItem('getwork_user', JSON.stringify(u));
        } catch (e) {
          console.error(e);
          localStorage.removeItem('getwork_user');
          localStorage.removeItem('getwork_token');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const onExpired = () => {
      logout();
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/' && path !== '/choose-path' && path !== '/about' && !path.startsWith('/register')) {
        window.location.replace('/login');
      }
    };
    window.addEventListener('getwork:auth-expired', onExpired);
    return () => window.removeEventListener('getwork:auth-expired', onExpired);
  }, [logout]);

  const login = async (email, password) => {
    try {
      const { token: t, user: u } = await loginRequest(email, password);
      persistSession(u, t);
      return u;
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  };

  const register = async (userData) => {
    try {
      const {
        name,
        email,
        password,
        role,
        qualification,
        skills,
        businessName,
        businessDetails,
        primaryMobile,
        alternateMobile,
      } = userData;

      const payload = {
        name,
        email,
        password,
        role,
        qualification,
        skills,
        businessName,
        businessDetails,
        primaryMobile,
        alternateMobile,
        governmentId: typeof userData.governmentId === 'string' ? userData.governmentId : '',
        profilePic: typeof userData.profilePic === 'string' ? userData.profilePic : '',
      };

      const { token: t, user: u } = await registerRequest(payload);
      persistSession(u, t);
      return u;
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
