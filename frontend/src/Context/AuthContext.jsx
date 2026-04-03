import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token
    const storedToken = localStorage.getItem('getwork_token');
    const storedUser = localStorage.getItem('getwork_user');
    
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (e) {
        console.error(e);
        localStorage.removeItem('getwork_user');
        localStorage.removeItem('getwork_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // MOCK API CALL
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockToken = "mock_token_" + Date.now();
        if (email.includes('employer')) {
          const employer = { 
            id: 1, 
            email, 
            role: 'JobGiver', 
            name: 'Acme Corp',
            walletBalance: 2450.00,
            jobCredits: 12,
            totalSpent: 12000.50,
            activeJobs: 3,
            hoursBooked: 340
          };
          setUser(employer);
          setToken(mockToken);
          setIsAuthenticated(true);
          localStorage.setItem('getwork_user', JSON.stringify(employer));
          localStorage.setItem('getwork_token', mockToken);
          resolve(employer);
        } else if (email.includes('worker')) {
          const worker = { 
            id: 2, 
            email, 
            role: 'Worker', 
            name: 'John Doe',
            walletBalance: 840.50,
            hoursWorked: 120,
            totalEarned: 4500.00,
            activeJobs: 1,
            completedJobs: 15,
            rating: 4.8
          };
          setUser(worker);
          setToken(mockToken);
          setIsAuthenticated(true);
          localStorage.setItem('getwork_user', JSON.stringify(worker));
          localStorage.setItem('getwork_token', mockToken);
          resolve(worker);
        } else {
          reject(new Error("Invalid credentials. Try 'employer@test.com' or 'worker@test.com'"));
        }
      }, 1000);
    });
  };

  const register = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockToken = "mock_token_" + Date.now();
        const newUser = { id: Date.now(), ...userData };
        setUser(newUser);
        setToken(mockToken);
        setIsAuthenticated(true);
        localStorage.setItem('getwork_user', JSON.stringify(newUser));
        localStorage.setItem('getwork_token', mockToken);
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('getwork_user');
    localStorage.removeItem('getwork_token');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
