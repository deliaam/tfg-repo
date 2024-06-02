import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';
import parse from 'html-react-parser';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // material-ui
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
    TextField,
    Tab,
    Grid,
    Menu,
    MenuItem
} from '@mui/material';

import { TabContext, TabList, TabPanel } from '@mui/lab/';

// project imports
import ProfileSection from 'layout/ProfileSection';
import { LessonContext } from 'contexts/lesson/LessonContext';
import DrawerButton from 'ui-components/DrawerButton';
import ClassService from 'services/class.service';
import MainCard from 'ui-components/MainCard';

// assets
import { IconMenu2, IconPlus } from '@tabler/icons';
import { IconCirclePlus } from '@tabler/icons';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { connect } from 'react-redux';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router';
import { useContext } from 'react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = (props) => {
    const theme = useTheme();

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
            {/* profile */}
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleTabChange: PropTypes.func,
    tabValue: PropTypes.string
};

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(Header);
