import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Header from './Header';
import Sidebar from 'layout/Sidebar';
import { drawerWidth } from 'themes/constant';
import LessonProvider from 'contexts/lesson/LessonProvider';
import QuestionProvider from 'contexts/question/QuestionProvider';
import ClassProvider from 'contexts/class/ClassProvider';
import TaskProvider from 'contexts/task/TaskProvider';

// assets
import { TabContext } from '@mui/lab';

// menu items
import classes from 'menu-items/classes';
import help from 'menu-items/help';
import requests from 'menu-items/requests';
import ranking from 'menu-items/ranking';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px'
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px'
        }
    })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const ClassLayout = () => {
    const [tabValue, setTabValue] = useState('1');
    const theme = useTheme();
    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.menu.opened);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const menuItemsTeacher = [classes, requests, ranking, help];
    const menuItemsStudent = [classes, ranking, help];

    const userRole = useSelector((state) => state.auth.user.roles[0]);
    return (
        <ClassProvider>
            <LessonProvider>
                <TaskProvider>
                    <QuestionProvider>
                        <Box sx={{ display: 'flex' }}>
                            <CssBaseline />
                            {/* header */}
                            <TabContext value={tabValue}>
                                <AppBar
                                    enableColorOnDark
                                    position="fixed"
                                    color="inherit"
                                    elevation={0}
                                    sx={{
                                        bgcolor: theme.palette.background.default,
                                        transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
                                    }}
                                >
                                    <Toolbar>
                                        <Header tabValue={tabValue} handleTabChange={handleTabChange} />
                                    </Toolbar>
                                </AppBar>

                                {/* drawer */}
                                <Sidebar menuItems={userRole === 'ROLE_STUDENT' ? menuItemsStudent : menuItemsTeacher} />

                                {/* main content */}
                                <Main theme={theme} open={leftDrawerOpened}>
                                    <Outlet />
                                </Main>
                            </TabContext>
                        </Box>
                    </QuestionProvider>
                </TaskProvider>
            </LessonProvider>
        </ClassProvider>
    );
};

export default ClassLayout;
