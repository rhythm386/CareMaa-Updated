import React from 'react';
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

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' }
  }
});

function AppContent() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <div className="App">
            <Navbar />
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
