import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../redux/slices/authSlice';
import API from '../api/API';
import {useNavigate} from 'react-router-dom';
import {Alert, Box, Button, Container, Divider, TextField, Typography} from '@mui/material';

import GoogleLoginButton from '../components/auth/GoogleLoginButton';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State to hold form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API.post('/api/auth/login', {
                email,
                password,
            });

            const {token, role, email: userEmail} = response.data;


            // Dispatch Redux login action
            dispatch(login({token, role, email: userEmail}));

            // Redirect based on role
            if (role === 'ADMIN') navigate('/admin/dashboard');
            else if (role === 'RESTAURANT_MANAGER') navigate('/manager/dashboard');
            else navigate('/'); // default for CUSTOMER

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>

                {/* Show error alert */}
                {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                </Box>
                <Divider sx={{width: '100%', my: 2}}>OR</Divider>
                <GoogleLoginButton/>
            </Box>
        </Container>
    );
};

export default Login;