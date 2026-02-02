import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, TextField, Grid, Card, CardContent, 
  Chip, Divider, List, ListItem, ListItemText, Alert, LinearProgress 
} from '@mui/material';
import dayjs from 'dayjs';

const PeriodTracker = () => {
  const [lastPeriodStr, setLastPeriodStr] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  
  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('periodData');
    if (saved) {
      const data = JSON.parse(saved);
      setLastPeriodStr(data.lastPeriod || '');
      setCycleLength(data.cycleLength || 28);
      setPeriodLength(data.periodLength || 5);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('periodData', JSON.stringify({
      lastPeriod: lastPeriodStr,
      cycleLength,
      periodLength
    }));
  }, [lastPeriodStr, cycleLength, periodLength]);

  const today = dayjs();
  const lastPeriod = lastPeriodStr ? dayjs(lastPeriodStr) : null;
  const nextPeriod = lastPeriod ? lastPeriod.add(cycleLength, 'day') : null;
  const daysSincePeriod = lastPeriod ? today.diff(lastPeriod, 'day') : 0;
  const progress = lastPeriod ? Math.min((daysSincePeriod / cycleLength) * 100, 100) : 0;
  const phase = getCyclePhase(daysSincePeriod);

  const handleDateChange = (e) => {
    setLastPeriodStr(e.target.value);
  };

  const daysToPeriod = nextPeriod ? nextPeriod.diff(today, 'day') : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" align="center" gutterBottom color="primary">
          📅 CareMaa Period Tracker
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 4 }}>
          Accurate cycle tracking with AI predictions
        </Typography>

        {/* Input Controls */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Last Period Start"
                  type="date"
                  fullWidth
                  value={lastPeriodStr}
                  onChange={handleDateChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: today.format('YYYY-MM-DD') }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Cycle Length"
                  type="number"
                  fullWidth
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Math.max(21, Math.min(40, parseInt(e.target.value) || 28)))}
                  inputProps={{ min: 21, max: 40, step: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Period Length"
                  type="number"
                  fullWidth
                  value={periodLength}
                  onChange={(e) => setPeriodLength(Math.max(2, Math.min(10, parseInt(e.target.value) || 5)))}
                  inputProps={{ min: 2, max: 10, step: 1 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Main Predictions */}
        {lastPeriod && (
          <>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>🔮 Predictions</Typography>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h2" color="error.main">
                      {daysToPeriod <= 0 ? 'Today!' : `${daysToPeriod} days`}
                    </Typography>
                    <Typography variant="h6">Next Period</Typography>
                    {nextPeriod && <Typography>{nextPeriod.format('MMM DD, YYYY')}</Typography>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h2" color="warning.main">
                      {Math.max(0, (cycleLength - 14) - daysSincePeriod)} days
                    </Typography>
                    <Typography variant="h6">To Ovulation</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Progress Bar + Phase */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="h4">{daysSincePeriod}</Typography>
                    <Typography>Day of Cycle</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Chip label={phase.name} color={phase.color} size="large" sx={{ fontSize: '1.2rem' }} />
                    <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, height: 8 }} />
                    <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                      {progress.toFixed(0)}% through cycle
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Phase Details */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{phase.name} Phase</Typography>
                <Typography sx={{ mb: 2 }}>{phase.description}</Typography>
                <Divider />
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>Symptoms:</Typography>
                <Grid container spacing={1}>
                  {phase.symptoms.map((symptom, i) => (
                    <Grid item xs={6} sm={4} key={i}>
                      <Chip label={symptom} size="small" variant="outlined" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </>
        )}

        {!lastPeriod && (
          <Alert severity="info" sx={{ mt: 4 }}>
            <Typography variant="h6">Enter your last period date to start tracking!</Typography>
            <Typography sx={{ mt: 1 }}>Data is saved locally and predictions update instantly.</Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

const getCyclePhase = (day) => {
  if (day <= 5) return {
    name: 'Menstrual', color: 'error',
    description: 'Period bleeding phase - uterine lining sheds',
    symptoms: ['Cramps', 'Fatigue', 'Bloating', 'Headaches']
  };
  if (day <= 13) return {
    name: 'Follicular', color: 'success',
    description: 'Egg develops, estrogen rises, energy increases',
    symptoms: ['Better mood', 'Increased energy', 'Clear skin']
  };
  if (day <= 16) return {
    name: 'Ovulation', color: 'warning',
    description: 'Most fertile days - egg released from ovary',
    symptoms: ['Ovulation pain', 'Increased libido', 'Cervical mucus']
  };
  return {
    name: 'Luteal', color: 'info',
    description: 'Progesterone rises, preparing for pregnancy or next period',
    symptoms: ['Breast tenderness', 'Mood swings', 'Food cravings', 'PMS']
  };
};

export default PeriodTracker;
