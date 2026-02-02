import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Grid, Card, CardContent, Chip,
  TextField, Box, Alert, Avatar, Divider, List, ListItem, ListItemText,
  LinearProgress, CircularProgress, Button, Dialog, DialogTitle, DialogContent,
  DialogActions  // ✅ FIXED: Added DialogActions import
} from '@mui/material';
import { PregnantWoman, Cake, Scale, ChildCare, LocalHospital } from '@mui/icons-material';
import dayjs from 'dayjs';

const PregnancyTracker = () => {
  const [lmpDate, setLmpDate] = useState('');
  const [weightData, setWeightData] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [openWeightDialog, setOpenWeightDialog] = useState(false);

  useEffect(() => {
    const savedWeight = localStorage.getItem('pregnancyWeight');
    const savedLMP = localStorage.getItem('pregnancyLMP');
    if (savedWeight) setWeightData(JSON.parse(savedWeight));
    if (savedLMP) setLmpDate(savedLMP);
  }, []);

  useEffect(() => {
    localStorage.setItem('pregnancyWeight', JSON.stringify(weightData));
    localStorage.setItem('pregnancyLMP', lmpDate);
  }, [weightData, lmpDate]);

  const today = dayjs();
  const lmp = lmpDate ? dayjs(lmpDate) : null;
  const weeksPregnant = lmp ? Math.floor(today.diff(lmp, 'week')) : 0;
  const daysPregnant = lmp ? Math.floor(today.diff(lmp, 'day')) : 0;
  const dueDate = lmp ? lmp.add(40, 'week') : null;
  const weeksLeft = dueDate ? Math.max(0, Math.floor(dueDate.diff(today, 'week'))) : 40;

  const addWeight = () => {
    if (newWeight) {
      setWeightData([...weightData, {
        weight: parseFloat(newWeight),
        week: weeksPregnant,
        date: today.format('YYYY-MM-DD')
      }]);
      setNewWeight('');
      setOpenWeightDialog(false);
    }
  };

  const fetalDevelopment = [
    { week: 4, size: 'Poppy seed', desc: 'Heartbeat begins', image: '❤️' },
    { week: 8, size: 'Raspberry', desc: 'All major organs forming', image: '🍓' },
    { week: 12, size: 'Lime', desc: 'Fingernails forming', image: '🍈' },
    { week: 16, size: 'Avocado', desc: 'Can hear sounds', image: '🥑' },
    { week: 20, size: 'Banana', desc: 'Quickening (first movements)', image: '🍌' },
    { week: 24, size: 'Corn cob', desc: 'Lungs developing', image: '🌽' },
    { week: 28, size: 'Eggplant', desc: 'Eyes open', image: '🍆' },
    { week: 32, size: 'Pineapple', desc: 'Nails reach fingertips', image: '🍍' },
    { week: 36, size: 'Honeydew', desc: 'Dropping (head down)', image: '🍈' },
    { week: 40, size: 'Watermelon', desc: 'Ready for birth!', image: '🍉' }
  ];

  const currentWeekInfo = fetalDevelopment.find(w => w.week <= weeksPregnant) || fetalDevelopment[fetalDevelopment.length - 1];

  const getTrimester = (week) => {
    if (week <= 13) return '1st Trimester';
    if (week <= 26) return '2nd Trimester';
    if (week <= 39) return '3rd Trimester';
    return 'Baby Here!';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PregnantWoman sx={{ fontSize: 80, color: '#f50057' }} />
          <Typography variant="h3" gutterBottom color="primary">
            Pregnancy Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your journey week by week
          </Typography>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Last Menstrual Period (LMP)</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', flexWrap: 'wrap' }}>
              <TextField
                label="LMP Date"
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: today.format('YYYY-MM-DD') }}
                sx={{ minWidth: 200 }}
              />
              <Box>
                <Typography variant="h4" color="primary">{weeksPregnant} weeks</Typography>
                <Typography variant="body2" color="text.secondary">
                  {daysPregnant} days | {getTrimester(weeksPregnant)} | {weeksLeft} weeks left
                </Typography>
                {dueDate && (
                  <Typography variant="body1" fontWeight="bold">
                    Due: {dueDate.format('MMM DD, YYYY')}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {!lmpDate && (
          <Alert severity="info" sx={{ mb: 4 }}>
            Enter your LMP date to start tracking your pregnancy!
          </Alert>
        )}

        {lmp && (
          <>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>📊 Pregnancy Progress</Typography>
                <Box sx={{ mb: 3 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(40 - weeksLeft) / 40 * 100} 
                    sx={{ height: 12, borderRadius: 10 }} 
                  />
                  <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                    {Math.round((40 - weeksLeft) / 40 * 100)}% complete
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Typography variant="h3" color="primary">{weeksPregnant}</Typography>
                    <Typography>Current Week</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h3" color="error">{currentWeekInfo.size}</Typography>
                    <Typography>Baby Size</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}>
                      {currentWeekInfo.image}
                    </Avatar>
                    <Typography variant="caption" display="block">{currentWeekInfo.desc}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">⚖️ Weight Tracker</Typography>
                  <Button variant="outlined" onClick={() => setOpenWeightDialog(true)}>
                    Add Weight
                  </Button>
                </Box>
                {weightData.length === 0 ? (
                  <Alert severity="info">Add your first weight measurement!</Alert>
                ) : (
                  <List dense>
                    {weightData.slice(-5).reverse().map((w, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={`${w.weight} kg`}
                          secondary={`Week ${w.week} | ${dayjs(w.date).format('MMM DD')}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>🎉 This Week's Milestones</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  {[
                    { title: 'Baby can now...', desc: currentWeekInfo.desc, icon: <Cake /> },
                    { title: 'You might feel...', desc: 'Increased energy or fatigue', icon: <LocalHospital /> },
                    { title: 'Next checkup...', desc: weeksPregnant % 4 === 0 ? 'Monthly visit' : 'Watch & wait', icon: <ChildCare /> }
                  ].map((milestone, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                      <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                        <Box sx={{ mb: 2, color: 'primary.main' }}>{milestone.icon}</Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {milestone.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {milestone.desc}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </>
        )}

        {/* ✅ FIXED: DialogActions now imported and working */}
        <Dialog open={openWeightDialog} onClose={() => setOpenWeightDialog(false)}>
          <DialogTitle>Add Weight Measurement</DialogTitle>
          <DialogContent>
            <TextField
              label="Weight (kg)"
              type="number"
              fullWidth
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              inputProps={{ step: '0.1', min: '30', max: '150' }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenWeightDialog(false)}>Cancel</Button>
            <Button onClick={addWeight} disabled={!newWeight}>Save</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default PregnancyTracker;
