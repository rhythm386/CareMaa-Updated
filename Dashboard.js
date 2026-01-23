import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Chip, Avatar, Paper, Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Fetch user profile data
    fetch('http://localhost:5000/api/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error('Profile fetch failed'));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {user?.name || 'Mom'}! 👋
            </Typography>
            <Typography color="text.secondary">
              Your pregnancy data is synced and secure
            </Typography>
          </Box>
          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Chip label="Weeks Pregnant" color="primary" size="small" sx={{ mb: 2 }} />
                <Typography variant="h4">{userData.pregnancyData?.weeksPregnant || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Chip label="Vaccines" color="success" size="small" sx={{ mb: 2 }} />
                <Typography variant="h4">{userData.vaccinationData?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Chip label="Risk Score" color="warning" size="small" sx={{ mb: 2 }} />
                <Typography variant="h4">Low</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Chip label="Cycles Tracked" color="secondary" size="small" sx={{ mb: 2 }} />
                <Typography variant="h4">{userData.periodData?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 200, cursor: 'pointer' }} onClick={() => navigate('/tracker')}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <Avatar sx={{ mx: 'auto', mb: 2, width: 60, height: 60, bgcolor: '#ff9800' }}>📅</Avatar>
              <Typography variant="h6" fontWeight="bold">Period Tracker</Typography>
              <Typography variant="body2" color="text.secondary">Track cycles & predict ovulation</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 200, cursor: 'pointer' }} onClick={() => navigate('/pregnancy')}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <Avatar sx={{ mx: 'auto', mb: 2, width: 60, height: 60, bgcolor: '#f50057' }}>🤰</Avatar>
              <Typography variant="h6" fontWeight="bold">Pregnancy Tracker</Typography>
              <Typography variant="body2" color="text.secondary">Week-by-week progress</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 200, cursor: 'pointer' }} onClick={() => navigate('/vaccination')}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <Avatar sx={{ mx: 'auto', mb: 2, width: 60, height: 60, bgcolor: '#4caf50' }}>💉</Avatar>
              <Typography variant="h6" fontWeight="bold">Vaccination Tracker</Typography>
              <Typography variant="body2" color="text.secondary">QR certificates & schedule</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
