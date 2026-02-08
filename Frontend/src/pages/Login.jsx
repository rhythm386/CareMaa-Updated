import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Alert,
  Link, Grid, Avatar, CssBaseline, FormControlLabel, Checkbox, Tabs, Tab,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [tabValue, setTabValue] = useState(0);
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
        throw new Error(result?.error || 'Something went wrong');
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

  const paperSx = {
    px: 4,
    py: 4,
    mt: 6,
    borderRadius: '1.25rem',
    background: 'var(--card)',
    border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
    boxShadow: 'none',
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        component="main"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 180px)',
          py: 4,
        }}
      >
        <Box sx={{ width: '100%', ...paperSx }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                m: 1,
                bgcolor: 'var(--muted)',
                color: 'var(--foreground)',
              }}
            >
              <LockOutlinedIcon />
            </Avatar>

            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontFamily: "'Satisfy', cursive",
                color: 'var(--foreground)',
                fontWeight: 500,
              }}
            >
              Care Maa
            </Typography>

            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              centered
              sx={{
                mt: 2,
                mb: 3,
                '& .MuiTab-root': { fontFamily: "'JetBrains Mono', monospace", textTransform: 'none' },
                '& .Mui-selected': { color: 'var(--foreground)' },
                '& .MuiTabs-indicator': { backgroundColor: 'var(--foreground)' },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Register" />
              <Tab label="Forgot Password" />
            </Tabs>

            {message && (
              <Alert
                severity="success"
                sx={{
                  width: '100%',
                  mb: 2,
                  bgcolor: 'color-mix(in srgb, var(--system-green) 20%, var(--card))',
                  color: 'var(--foreground)',
                  border: '1px solid color-mix(in srgb, var(--system-green) 40%, transparent)',
                }}
              >
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {tabValue === 1 && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'var(--input-background)',
                      borderRadius: '0.75rem',
                    },
                  }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'var(--input-background)',
                    borderRadius: '0.75rem',
                  },
                }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'var(--input-background)',
                      borderRadius: '0.75rem',
                    },
                  }}
                />
              )}

              {tabValue === 0 && (
                <FormControlLabel
                  control={<Checkbox sx={{ color: 'var(--foreground)' }} />}
                  label="Remember me"
                  sx={{ color: 'var(--muted-foreground)' }}
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.5,
                  bgcolor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderRadius: '1rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  '&:hover': { bgcolor: 'var(--foreground)', opacity: 0.9 },
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'var(--primary-foreground)' }} />
                ) : tabValue === 0 ? (
                  'Sign In'
                ) : tabValue === 1 ? (
                  'Create Account'
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                  <Link
                    href="#"
                    onClick={(e) => { e.preventDefault(); setTabValue(0); }}
                    sx={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}
                  >
                    ← Back to Sign In
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
