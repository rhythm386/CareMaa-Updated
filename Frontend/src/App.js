import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import PeriodTracker from './pages/PeriodTracker';
import PregnancyTracker from './pages/PregnancyTracker';
import VaccinationTracker from './pages/VaccinationTracker';
import NutritionPlanner from './pages/NutritionPlanner';
import RiskPrediction from './pages/RiskPrediction';
import Community from './pages/Community';
import ProtectedRoute from './components/ProtectedRoute';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1A1A1A' },
    secondary: { main: '#D4D4D0' },
    background: { default: '#F5F5F0', paper: '#F5F5F0' },
    text: { primary: '#1A1A1A', secondary: '#666666' },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: '"JetBrains Mono", monospace',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#F5F5F0' },
    secondary: { main: '#1A1A1A' },
    background: { default: '#0A0A0A', paper: '#0A0A0A' },
    text: { primary: '#F5F5F0', secondary: '#999999' },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: '"JetBrains Mono", monospace',
  },
});

function AppContent() {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <div
            className="App app-wrap"
            style={{
              minHeight: '100vh',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
          >
            <Navbar isDark={isDark} onToggleDark={toggleDark} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tracker" element={<ProtectedRoute><PeriodTracker /></ProtectedRoute>} />
              <Route path="/pregnancy" element={<ProtectedRoute><PregnancyTracker /></ProtectedRoute>} />
              <Route path="/vaccination" element={<ProtectedRoute><VaccinationTracker /></ProtectedRoute>} />
              <Route path="/nutrition" element={<ProtectedRoute><NutritionPlanner /></ProtectedRoute>} />
              <Route path="/risk" element={<ProtectedRoute><RiskPrediction /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default AppContent;
