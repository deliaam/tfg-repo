import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from 'store/auth';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
    useMediaQuery,
    Radio,
    RadioGroup,
    FormLabel
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-components/AnimateButton';
import { strengthColor, strengthIndicator } from './password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = (props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    // User data
    const [role, setRole] = useState('student');

    const [registered, setRegistered] = useState(false);
    // Handle user data
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    //
    const googleHandler = async () => {
        console.error('Register');
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    teacherKey: '',
                    name: '',
                    lastName: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email('El correo debe ser válido')
                        .max(255)
                        .required('Introducir una dirección de correo')
                        .matches('.upv.es$', 'El correo debe ser un correo de la UPV'),
                    password: Yup.string().max(255).required('Introducir una contraseña'),
                    name: Yup.string().max(255).required('Introducir un nombre'),
                    lastName: Yup.string().max(255).required('Introducir un apellido'),
                    ...(role === 'teacher' && { teacherKey: Yup.string().max(255).required('Introducir una clave') })
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        await props
                            .dispatch(register(values.name, values.lastName, values.email, values.password, [role], values.teacherKey))
                            .then(() => {
                                setRegistered(true);
                            });
                    } catch (err) {
                        console.log(err);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Rol</FormLabel>
                            <RadioGroup row aria-label="role" name="role" value={role} onChange={handleRoleChange}>
                                <FormControlLabel value="student" control={<Radio />} label="Estudiante" />
                                <FormControlLabel value="teacher" control={<Radio />} label="Profesor" />
                            </RadioGroup>
                        </FormControl>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.name && errors.name)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-name-register">Nombre</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-name-register"
                                        type="text"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.lastName && errors.lastName)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-lastName-register">Apellidos</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-lastName-register"
                                        type="text"
                                        value={values.lastName}
                                        name="lastName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.lastName}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Correo UPV</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {role === 'teacher' && (
                            <FormControl
                                fullWidth
                                error={Boolean(touched.teacherKey && errors.teacherKey)}
                                sx={{ ...theme.typography.customInput }}
                            >
                                <InputLabel htmlFor="outlined-adornment-teacherKey-register">Clave profesor</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-teacherKey-register"
                                    type="text"
                                    value={values.teacherKey}
                                    name="teacherKey"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                {touched.teacherKey && errors.teacherKey && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.teacherKey}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Contraseña</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
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
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}
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
                                    onClick={() => {
                                        console.log(errors);
                                        handleSubmit();
                                    }}
                                >
                                    Crear
                                </Button>
                            </AnimateButton>
                        </Box>
                        {registered && <Navigate to="/login" replace={true} />}
                    </form>
                )}
            </Formik>
        </>
    );
};

function mapStateToProps(state) {
    const { message } = state.message;
    return {
        message
    };
}

export default connect(mapStateToProps)(FirebaseRegister);
