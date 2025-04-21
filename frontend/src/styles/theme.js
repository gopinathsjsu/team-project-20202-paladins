import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#009688',      // Deeper teal
            light: '#4DB6AC',
            dark: '#00796B',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#FF8A65',      // Richer coral
            light: '#FFAB91',
            dark: '#E64A19',
            contrastText: '#000000',
        },
        background: {
            default: '#F5F5F5',   // Slightly warmer gray
            paper: '#FFFFFF',
        },
        text: {
            primary: '#37474F',   // Slightly darker gray
            secondary: '#546E7A',
        },
        success: {
            main: '#66BB6A',      // Slightly richer green
            light: '#81C784',
            dark: '#43A047',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 400,      // Lighter weight for headings
        },
        h2: {
            fontWeight: 400,
        },
        h3: {
            fontWeight: 400,
        },
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: 'none',  // Remove shadow for softer look
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',  // Softer shadow
                },
            },
        },
    },
});

export default theme; 