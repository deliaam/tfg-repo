import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-components/MainCard';
import Transitions from 'ui-components/extended/Transitions';
import { logout } from 'store/auth';
import UserService from 'services/user.service';
import { borderRadius } from 'themes/constant';

// assets
import { IconLogout, IconSettings } from '@tabler/icons';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// ==============================|| PROFILE MENU ||============================== //

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

const ProfileSection = (props) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);

    const [user, setUser] = useState();
    const anchorRef = useRef(null);
    const isTeacher = props.user.roles.includes('ROLE_TEACHER');
    const getUser = async () => {
        try {
            const response = await UserService.getStudent(props.user.id, isTeacher);
            console.log(response);
            setUser(response);
        } catch (error) {
            console.log(error);
            return {};
        }
    };
    useEffect(() => {
        getUser();
    }, []);

    const handleLogout = async () => {
        try {
            props.dispatch(logout());
            navigate('/login');

            console.log('dispatched');
        } catch (err) {
            console.log(err);
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            {user && (
                <Chip
                    sx={{
                        height: '48px',
                        alignItems: 'center',
                        borderRadius: '27px',
                        transition: 'all .2s ease-in-out',
                        borderColor: theme.palette.primary.light,
                        backgroundColor: theme.palette.primary.light,
                        '&[aria-controls="menu-list-grow"], &:hover': {
                            borderColor: theme.palette.primary.main,
                            background: `${theme.palette.primary.main}!important`,
                            color: theme.palette.primary.light,
                            '& svg': {
                                stroke: theme.palette.primary.light
                            }
                        },
                        '& .MuiChip-label': {
                            lineHeight: 0
                        }
                    }}
                    icon={
                        <Avatar
                            sx={{
                                margin: '8px 0 8px 8px !important',
                                bgcolor: stringToColor(user.name)
                            }}
                            style={{ color: 'white' }}
                            ref={anchorRef}
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            children={`${user.name.split(' ')[0][0]}${user.lastName.split(' ')[0][0]}`}
                        />
                    }
                    label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                    variant="outlined"
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="primary"
                />
            )}
            {user && (
                <Popper
                    placement="bottom-end"
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    popperOptions={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 14]
                                }
                            }
                        ]
                    }}
                >
                    {({ TransitionProps }) => (
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Box sx={{ p: 2 }}>
                                            <Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="h4">
                                                        {user.name} {user.lastName}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="subtitle2">{user.username}</Typography>
                                            </Stack>

                                            <Divider />
                                        </Box>
                                        <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                            <Box sx={{ p: 2 }}>
                                                {!isTeacher && (
                                                    <Card
                                                        sx={{
                                                            bgcolor: theme.palette.warning.main,
                                                            my: 2
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Grid container spacing={3} direction="row" alignItems="center">
                                                                <Grid item>
                                                                    <EmojiEventsIcon fontSize="large" />
                                                                </Grid>
                                                                <Grid item>
                                                                    <Grid
                                                                        container
                                                                        direction="column"
                                                                        alignItems="left"
                                                                        justifyContent="space-between"
                                                                        spacing={1}
                                                                    >
                                                                        <Grid item>
                                                                            <Typography variant="h3">Puntuación</Typography>
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <Typography variant="body1">
                                                                                Tienes {user.score} puntos
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                                <Divider />
                                                <List
                                                    component="nav"
                                                    sx={{
                                                        width: '100%',
                                                        maxWidth: 350,
                                                        minWidth: 300,
                                                        backgroundColor: theme.palette.background.paper,
                                                        borderRadius: '10px',
                                                        [theme.breakpoints.down('md')]: {
                                                            minWidth: '100%'
                                                        },
                                                        '& .MuiListItemButton-root': {
                                                            mt: 0.5
                                                        }
                                                    }}
                                                >
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 4}
                                                        onClick={handleLogout}
                                                    >
                                                        <ListItemIcon>
                                                            <IconLogout stroke={1.5} size="1.3rem" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={<Typography variant="body2">Cerrar sesión</Typography>} />
                                                    </ListItemButton>
                                                </List>
                                            </Box>
                                        </PerfectScrollbar>
                                    </MainCard>
                                </ClickAwayListener>
                            </Paper>
                        </Transitions>
                    )}
                </Popper>
            )}
        </>
    );
};

function mapStateToProps(state) {
    const { message } = state.message;
    const { user } = state.auth;
    return {
        message,
        user
    };
}

export default connect(mapStateToProps)(ProfileSection);
