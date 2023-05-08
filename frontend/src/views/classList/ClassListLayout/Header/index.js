import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';

// project imports
import ProfileSection from 'layout/ProfileSection';
import DrawerButton from 'ui-components/DrawerButton';
// assets
import { IconPlus } from '@tabler/icons';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { connect } from 'react-redux';
import classService from 'services/class.service';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = (props) => {
    const theme = useTheme();

    const [openCreate, setOpenCreate] = useState(false);
    const [className, setClassName] = useState('');
    const [classCode, setClassCode] = useState('');

    const handleCreateClass = () => {
        classService.createClass(className, props.user.id).then(() => console.log('class added'));
        setOpenCreate(false);
        setClassName('');
    };
    const handleJoinClass = () => {
        classService.joinClass(classCode, props.user.id).then(() => console.log('class added'));
        setOpenCreate(false);
        setClassName('');
    };

    const isTeacher = props.user.roles.includes('ROLE_TEACHER');
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}></Box>

                <DrawerButton />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />
            {/* create & profile */}
            <IconButton
                size="large"
                sx={{
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&:hover': {
                        background: theme.palette.secondary.dark,
                        color: theme.palette.secondary.light
                    },
                    marginRight: 1
                }}
                aria-label="createclass"
                onClick={() => setOpenCreate(true)}
            >
                <IconPlus />
            </IconButton>
            <Dialog
                open={openCreate}
                onClose={() => {
                    setOpenCreate(false);
                }}
                width={100}
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle fontSize="1.25rem">{isTeacher ? 'Crear clase' : 'Unirse a clase'}</DialogTitle>
                <DialogContent>
                    <TextField
                        value={isTeacher ? className : classCode}
                        onChange={(e) => (isTeacher ? setClassName(e.target.value) : setClassCode(e.target.value))}
                        margin="dense"
                        id="name"
                        label={isTeacher ? 'Nombre de la clase' : 'Código de la clase'}
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ marginBottom: 2, marginRight: 2 }}>
                    <Button
                        onClick={() => {
                            setOpenCreate(false);
                        }}
                        color="error"
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={className === '' && classCode === ''}
                        onClick={isTeacher ? handleCreateClass : handleJoinClass}
                        variant="contained"
                        size="small"
                    >
                        {isTeacher ? 'Crear' : 'Unirse'}
                    </Button>
                </DialogActions>
            </Dialog>
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(Header);
