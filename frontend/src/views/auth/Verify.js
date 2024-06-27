import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from './wrapper/AuthWrapper1';
import AuthCardWrapper from './wrapper/AuthCardWrapper';
import authService from 'services/auth.service'; // Make sure this path is correct

const Verify = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [verificationTitle, setVerificationTitle] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            authService
                .verify(token)
                .then((response) => {
                    setVerificationMessage('Tu cuenta se ha verificado con éxito. Ya puedes iniciar sesión.');
                    setVerificationTitle('Verificación completada');
                })
                .catch((error) => {
                    setVerificationMessage('El token de verificación no es válido o ha expirado.');
                    setVerificationTitle('Error');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setVerificationMessage('No se proporcionó ningún token de verificación.');
            setLoading(false);
        }
    }, [location]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    if (loading) {
        return (
            <AuthWrapper1>
                <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                            <Typography variant="h4">Verificando...</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </AuthWrapper1>
        );
    }

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item xs={12}>
                                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                                            <Typography
                                                color={theme.palette.secondary.main}
                                                gutterBottom
                                                variant={matchDownSM ? 'h3' : 'h2'}
                                            >
                                                {verificationTitle}
                                            </Typography>
                                            <Typography variant="body1" textAlign={matchDownSM ? 'center' : 'inherit'}>
                                                {verificationMessage}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                        <Button variant="contained" color="primary" onClick={handleLoginClick}>
                                            Iniciar sesión
                                        </Button>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Verify;
