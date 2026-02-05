import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  Link, Grid, Avatar, CssBaseline, FormControlLabel, Checkbox, Tabs, Tab,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [tabValue, setTabValue] = useState(0); // 0=Login, 1=Register, 2=Forgot
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      let result;

      if (tabValue === 0) {
        result = await login(formData.email, formData.password);
      } else if (tabValue === 1) {
        result = await register(formData.name, formData.email, formData.password);
      } else {
        result = await forgotPassword(formData.email);
      }

      if (!result || !result.success) {
        throw new Error(result?.error || "Something went wrong");
      }

      setMessage(result.message);

      if (tabValue !== 2) {
        setTimeout(() => navigate('/dashboard'), 1000);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {tabValue === 1 && (
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            {(tabValue === 0 || tabValue === 1) && (
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}

            {tabValue === 0 && (
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> :
                tabValue === 0 ? "Sign In" :
                tabValue === 1 ? "Create Account" :
                "Send Reset Link"}
            </Button>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="#" onClick={(e) => { e.preventDefault(); setTabValue(0); }}>
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
