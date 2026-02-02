import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Alert, Box, Avatar
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);

  // Verify token on mount
  useEffect(() => {
    axios.get(`http://localhost:5000/api/validate-reset/${token}`)
      .then(() => setValidToken(true))
      .catch(() => {
        setMessage('Invalid or expired reset link');
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/reset-password/${token}`, { password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Reset failed');
    }
    setLoading(false);
  };

  if (!validToken) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 8, textAlign: 'center' }}>
          <Alert severity="error">
            <Typography variant="h6">{message || 'Invalid reset link'}</Typography>
            <Button href="/login" sx={{ mt: 2 }}>Go to Login</Button>
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ px: 4, py: 6, mt: 8, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockResetIcon />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">Reset Password</Typography>
          
          <form onSubmit={handleSubmit} style={{ width: '100%', mt: 3 }}>
            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
            
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || password.length < 6}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
