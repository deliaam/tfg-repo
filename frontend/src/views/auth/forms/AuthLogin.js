import { useState } from 'react';
import { login } from 'store/auth';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-components/AnimateButton';
import Loader from 'ui-components/Loader';
import AlertDialog from 'ui-components/AlertDialog';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = (props) => {
    const theme = useTheme();
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertBody, setAlertBody] = useState('');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <>
            {loading && <Loader />}
            {props.isLoggedIn ? (
                <Navigate to={`/home/classes/`} replace={true} />
            ) : (
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email('El correo debe ser válido')
                            .max(255)
                            .required('Introduce un correo')
                            .matches('.upv.es$', 'El correo debe pertenecer a la upv'),
                        password: Yup.string().max(255).required('Introduce la contraseña')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        setLoading(true);
                        try {
                            await props.dispatch(login(values.email, values.password));
                        } catch (err) {
                            setLoading(false);
                            console.log('error catched');
                            console.log(err);
                            const errorMessage = err.response?.data || 'Hubo un error al iniciar sesión. Por favor, intenta nuevamente.';
                            if (errorMessage.includes('Correo no verificado')) {
                                setAlertTitle('Verificación de correo requerida');
                                setAlertBody(
                                    'Tu correo no está verificado. Se ha enviado un enlace de verificación a tu correo electrónico.'
                                );
                            } else {
                                setAlertTitle('Error en el inicio de sesión');
                                setAlertBody(errorMessage);
                            }
                            setAlertOpen(true);
                            setErrors({ submit: errorMessage });
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-email-login">Correo UPV</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email-login"
                                    type="email"
                                    value={values.email}
                                    name="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Email Address / Username"
                                    inputProps={{}}
                                />
                                {touched.email && errors.email && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                sx={{ ...theme.typography.customInput }}
                            >
                                <InputLabel htmlFor="outlined-adornment-password-login">Contraseña</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password-login"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                size="large"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                    inputProps={{}}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label="Recuérdame"
                                />
                                <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                                    Has olvidado la contraseña?
                                </Typography>
                            </Stack>
                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Iniciar sesión
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </form>
                    )}
                </Formik>
            )}
            <AlertDialog open={alertOpen} setOpen={setAlertOpen} title={alertTitle} body={alertBody} agree handle={handleAlertClose} />
        </>
    );
};

function mapStateToProps(state) {
    const { isLoggedIn, user } = state.auth;
    const { message } = state.message;
    return {
        isLoggedIn,
        message,
        user
    };
}

export default connect(mapStateToProps)(FirebaseLogin);
