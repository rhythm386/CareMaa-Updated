import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const statCardSx = {
  background: 'color-mix(in srgb, var(--muted) 20%, transparent)',
  border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
  borderRadius: '1.25rem',
  p: 2,
  height: 120,
  transition: 'transform 0.3s ease',
  '&:hover': { transform: 'translateY(-2px)' },
};

const featureCardSx = {
  background: 'color-mix(in srgb, var(--muted) 20%, transparent)',
  border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
  borderRadius: '1.25rem',
  p: 3,
  height: 200,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': { transform: 'translateY(-2px)' },
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error('Profile fetch failed'));
  }, []);

  return (
    <main className="dashboard-main">
      <div className="main-content-wrap">
        {/* Hero / Welcome panel - reference style */}
        <div className="dashboard-hero card-panel dashboard-hero-inner">
          <div className="section-label">SYSTEM STATUS: STABLE</div>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" className="dashboard-hero-title">
                Welcome back, {user?.name || 'Mom'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.6, letterSpacing: '0.05em', mt: 0.5 }}>
                Your pregnancy data is synced and secure
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={logout}
              sx={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                '&:hover': { borderColor: 'var(--foreground)', bgcolor: 'var(--muted)' },
              }}
            >
              Logout
            </Button>
          </Box>
        </div>

        {/* Stat cards row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'WEEKS PREGNANT', value: userData.pregnancyData?.weeksPregnant ?? 0 },
            { label: 'VACCINES', value: userData.vaccinationData?.length ?? 0 },
            { label: 'RISK SCORE', value: 'Low' },
            { label: 'CYCLES TRACKED', value: userData.periodData?.length ?? 0 },
          ].map(({ label, value }) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Box sx={statCardSx}>
                <div className="section-label">{label}</div>
                <Typography variant="h4" sx={{ fontWeight: 500, letterSpacing: '-0.02em' }}>
                  {value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Feature cards - reference style */}
        <div className="section-label" style={{ marginBottom: '1rem' }}>QUICK ACTIONS</div>
        <Grid container spacing={2}>
          {[
            { path: '/tracker', emoji: '📅', title: 'Period Tracker', subtitle: 'Track cycles & predict ovulation' },
            { path: '/pregnancy', emoji: '🤰', title: 'Pregnancy Tracker', subtitle: 'Week-by-week progress' },
            { path: '/vaccination', emoji: '💉', title: 'Vaccination Tracker', subtitle: 'QR certificates & schedule' },
          ].map(({ path, emoji, title, subtitle }) => (
            <Grid item xs={12} md={4} key={path}>
              <Box sx={featureCardSx} onClick={() => navigate(path)}>
                <Box sx={{ fontSize: '2.5rem', mb: 1 }}>{emoji}</Box>
                <Typography variant="subtitle1" fontWeight={500}>{title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>{subtitle}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  );
};

export default Dashboard;
