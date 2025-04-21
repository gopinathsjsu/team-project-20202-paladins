import React from 'react';
import {Box, Button, Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    textAlign: 'center',
                    py: 8,
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Oops! The page you're looking for doesn't exist.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{mt: 2}}
                >
                    Go to Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound; 