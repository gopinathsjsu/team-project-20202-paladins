import React, {useState} from 'react';
import {Alert, Box, Button, Container, Divider, TextField, Typography,} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import API from '../api/API';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';


const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await API.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>

        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
        {success && <Alert severity="success" sx={{mt: 2}}>{success}</Alert>}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
            Sign Up
          </Button>
        </Box>

        <Divider sx={{width: '100%', my: 2}}>OR</Divider>
        <GoogleLoginButton/>
      </Box>
    </Container>
  );
};

export default Register;
