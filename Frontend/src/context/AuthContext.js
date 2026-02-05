import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // ✅ MATCH BACKEND
  const API_URL = 'http://localhost:5000/api/auth';

  // =====================
  // LOGIN
  // =====================
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, message: "Login successful" };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed"
      };
    }
  };

  // =====================
  // REGISTER
  // =====================
  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, message: "Registration successful" };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed"
      };
    }
  };

  // =====================
  // FORGOT PASSWORD (DISABLED SAFELY)
  // =====================
  const forgotPassword = async () => {
    return {
      success: false,
      error: "Forgot password not implemented yet"
    };
  };

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    forgotPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
