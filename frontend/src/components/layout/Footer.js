import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} BookTable. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
