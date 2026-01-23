import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Grid, Card, CardContent, Button,
  Chip, TextField, Box, Alert, Avatar, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
  MenuItem  // ✅ FIXED: Added MenuItem import
} from '@mui/material';
import { QrCodeScanner, Add, CheckCircle, Schedule } from '@mui/icons-material'; // ✅ FIXED: Removed unused
import axios from 'axios';

const VaccinationTracker = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newVaccine, setNewVaccine] = useState({
    name: '',
    date: '',
    dose: '1st'
  });
  const [qrDialog, setQrDialog] = useState(false);
  const [qrCode, setQrCode] = useState('');

  // Sample pregnancy vaccination schedule
  const pregnancyVaccines = [
    { name: 'TT-1 (Tetanus Toxoid)', recommended: 'Week 16-20', status: 'scheduled' },
    { name: 'TT-2', recommended: 'Week 24-28', status: 'scheduled' },
    { name: 'TT-Booster', recommended: 'Week 36', status: 'scheduled' },
    { name: 'Influenza', recommended: 'Any time', status: 'optional' },
    { name: 'Hepatitis B', recommended: 'Week 20+', status: 'recommended' }
  ];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vaccinationData');
    if (saved) setVaccines(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vaccinationData', JSON.stringify(vaccines));
  }, [vaccines]);

  const handleAddVaccine = async () => {
    setLoading(true);
    
    try {
      // Backend API call
      const response = await axios.post('http://localhost:5000/api/vaccination', {
        userId: 'user123',
        vaccineName: newVaccine.name,
        date: newVaccine.date
      });

      const vaccineData = {
        ...newVaccine,
        id: Date.now(),
        qrCode: response.data.qrCode,
        status: 'completed'
      };

      setVaccines([vaccineData, ...vaccines]);
      setNewVaccine({ name: '', date: '', dose: '1st' });
      setOpenDialog(false);
      setQrCode(response.data.qrCode);
      setQrDialog(true);
    } catch (error) {
      // Offline QR fallback
      const offlineVaccine = {
        ...newVaccine,
        id: Date.now(),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Vaccine:${newVaccine.name}|${newVaccine.date}`,
        status: 'completed'
      };
      setVaccines([offlineVaccine, ...vaccines]);
      setNewVaccine({ name: '', date: '', dose: '1st' });
      setOpenDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { completed: 'success', scheduled: 'warning', overdue: 'error', optional: 'default' };
    return colors[status] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <QrCodeScanner sx={{ fontSize: 80, color: '#1976d2' }} />
          <Typography variant="h3" gutterBottom color="primary">
            Vaccination Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track pregnancy vaccines with QR certificates
          </Typography>
        </Box>

        {/* Add Vaccine Button */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">➕ Record New Vaccination</Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                Add Vaccine
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>📋 Pregnancy Vaccination Schedule</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {pregnancyVaccines.map((vaccine, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>💉</Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">{vaccine.name}</Typography>
                          <Chip label={vaccine.recommended} size="small" color={getStatusColor(vaccine.status)} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Recorded Vaccines */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>📱 Your Recorded Vaccines</Typography>
            {vaccines.length === 0 ? (
              <Alert severity="info">No vaccines recorded yet. Add your first vaccination!</Alert>
            ) : (
              <List>
                {vaccines.map((vaccine) => (
                  <ListItem key={vaccine.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <QrCodeScanner />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={vaccine.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {vaccine.date} - {vaccine.dose}
                          </Typography>
                          <Chip 
                            label="View QR" 
                            size="small" 
                            onClick={() => {
                              setQrCode(vaccine.qrCode);
                              setQrDialog(true);
                            }}
                            sx={{ ml: 2 }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Paper>

      {/* Add Vaccine Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vaccination</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Vaccine Name"
              fullWidth
              value={newVaccine.name}
              onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={newVaccine.date}
              onChange={(e) => setNewVaccine({ ...newVaccine, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: new Date().toISOString().split('T')[0] }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Dose"
              select
              fullWidth
              value={newVaccine.dose}
              onChange={(e) => setNewVaccine({ ...newVaccine, dose: e.target.value })}
            >
              {/* ✅ FIXED: MenuItem now works */}
              <MenuItem value="1st">1st Dose</MenuItem>
              <MenuItem value="2nd">2nd Dose</MenuItem>
              <MenuItem value="Booster">Booster</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddVaccine}
            disabled={loading || !newVaccine.name || !newVaccine.date}
          >
            {loading ? <CircularProgress size={24} /> : 'Save & Generate QR'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialog} onClose={() => setQrDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📱 Vaccination QR Certificate</DialogTitle>
        <DialogContent>
          {qrCode && (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <img src={qrCode} alt="QR Code" style={{ maxWidth: '100%', borderRadius: 8 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>Scan to verify vaccination</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialog(false)}>Close</Button>
          <Button 
            variant="outlined" 
            onClick={() => {
              const link = document.createElement('a');
              link.href = qrCode;
              link.download = 'vaccine-qr.png';
              link.click();
            }}
          >
            Download QR
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VaccinationTracker;
