import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button, Slider,
  Chip, Box, Paper, Alert, CircularProgress, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Assessment, PregnantWoman, HealthAndSafety, Warning } from '@mui/icons-material';

const RiskPrediction = () => {
  const [formData, setFormData] = useState({
    age: 28,
    weight: 65,
    height: 160,
    bp_systolic: 120,
    bp_diastolic: 80,
    weeks_pregnant: 20,
    hemoglobin: 12.5,
    glucose: 90,
    history_preeclampsia: false,
    history_gdm: false
  });
  const [riskResult, setRiskResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRisks = () => {
    setLoading(true);
    setTimeout(() => {
      const bmi = formData.weight / ((formData.height / 100) ** 2);
      const risks = {
        preeclampsia: bmi > 30 || formData.bp_systolic > 140 || formData.history_preeclampsia ? 'HIGH' : 'LOW',
        gdm: formData.glucose > 140 || formData.history_gdm ? 'HIGH' : 'LOW',
        anemia: formData.hemoglobin < 11 ? 'HIGH' : 'LOW'
      };
      setRiskResult(risks);
      setLoading(false);
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Assessment sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          AI Risk Prediction
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Instant assessment for Preeclampsia, GDM & Anemia risks
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Enter Details
            </Typography>
            
            <Box sx={{ mt: 3, mb: 4 }}>
              {[
                { label: 'Age', key: 'age', min: 18, max: 45, value: formData.age },
                { label: 'Weight (kg)', key: 'weight', min: 40, max: 150, value: formData.weight },
                { label: 'Height (cm)', key: 'height', min: 140, max: 200, value: formData.height },
                { label: 'Systolic BP', key: 'bp_systolic', min: 90, max: 200, value: formData.bp_systolic },
                { label: 'Diastolic BP', key: 'bp_diastolic', min: 60, max: 140, value: formData.bp_diastolic },
                { label: 'Weeks Pregnant', key: 'weeks_pregnant', min: 1, max: 40, value: formData.weeks_pregnant },
                { label: 'Hemoglobin (g/dL)', key: 'hemoglobin', min: 8, max: 18, value: formData.hemoglobin },
                { label: 'Glucose (mg/dL)', key: 'glucose', min: 70, max: 300, value: formData.glucose }
              ].map(({ label, key, min, max, value }) => (
                <Box key={key} sx={{ mb: 3 }}>
                  <Typography>{label}: {value}</Typography>
                  <Slider
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    min={min}
                    max={max}
                    step={key === 'age' ? 1 : key.includes('bp') ? 5 : 0.1}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Medical History</InputLabel>
              <Select
                multiple
                value={Object.keys(formData).filter(k => k.includes('history') && formData[k])}
                onChange={(e) => {
                  const history_preeclampsia = e.target.value.includes('Preeclampsia');
                  const history_gdm = e.target.value.includes('GDM');
                  setFormData({ ...formData, history_preeclampsia, history_gdm });
                }}
              >
                <MenuItem value="Preeclampsia">Previous Preeclampsia</MenuItem>
                <MenuItem value="GDM">Gestational Diabetes</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={calculateRisks}
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Calculate Risks'}
            </Button>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Risk Assessment
            </Typography>
            
            {riskResult ? (
              <Box sx={{ mt: 3 }}>
                {Object.entries(riskResult).map(([risk, level]) => (
                  <Alert
                    key={risk}
                    severity={level === 'HIGH' ? 'warning' : 'success'}
                    sx={{ mb: 2 }}
                    icon={
                      level === 'HIGH' ? <Warning /> : <HealthAndSafety />
                    }
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {risk.toUpperCase().replace('_', ' ')}
                    </Typography>
                    <Typography>Status: <Chip label={level} color={level === 'HIGH' ? 'warning' : 'success'} /></Typography>
                  </Alert>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
                <Assessment sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                <Typography variant="h6">Enter details to see AI predictions</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RiskPrediction;
