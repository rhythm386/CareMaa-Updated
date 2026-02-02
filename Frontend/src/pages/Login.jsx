import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  Link, Grid, Avatar, CssBaseline, FormControlLabel, Checkbox, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [tabValue, setTabValue] = useState(0); // 0=Login, 1=Register, 2=Forgot Password
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    let result;
    if (tabValue === 0) { // Login
      result = await login(formData.email, formData.password);
    } else if (tabValue === 1) { // Register
      result = await register(formData.name, formData.email, formData.password);
    } else { // Forgot Password
      result = await forgotPassword(formData.email);
    }

    if (result.success) {
      setMessage(result.message);
      if (tabValue !== 2) {
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={10} sx={{ px: 4, py: 6, mt: 8, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight="bold">
            CareMaa
          </Typography>
          
          {/* Tab Navigation */}
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)} 
            centered 
            sx={{ mt: 2, mb: 3 }}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
            <Tab label="Forgot Password" />
          </Tabs>

          {message && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {tabValue === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            
            {(tabValue === 0 || tabValue === 1) && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            )}

            {tabValue === 0 && (
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
              disabled={loading || !formData.email || (tabValue !== 2 && !formData.password)}
            >
              {loading ? <CircularProgress size={24} /> : (
                tabValue === 0 ? 'Sign In' : 
                tabValue === 1 ? 'Create Account' : 'Send Reset Link'
              )}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link href="#" variant="body2" onClick={(e) => { e.preventDefault(); setTabValue(0); }}>
                  ← Back to Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
