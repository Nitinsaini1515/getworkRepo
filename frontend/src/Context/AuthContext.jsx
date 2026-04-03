import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking local storage or token
    const storedUser = localStorage.getItem('getwork_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // MOCK API CALL
    return new Promise((resolve, reject) => {
      setTimeout(() => {
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
          localStorage.setItem('getwork_user', JSON.stringify(employer));
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
          localStorage.setItem('getwork_user', JSON.stringify(worker));
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
        const newUser = { id: Date.now(), ...userData };
        setUser(newUser);
        localStorage.setItem('getwork_user', JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('getwork_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
