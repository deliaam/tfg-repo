import { Box, Breadcrumbs, ButtonBase, Divider, Grid, IconButton } from '@mui/material';
import { useState } from 'react';
// filtering imports

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme, styled } from '@mui/material/styles';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    CardActionArea,
    CardActions,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    MenuItem,
    FormControl,
    Select,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Collapse,
    Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useParams } from 'react-router';
import lessonService from 'services/lesson.service';
import { useEffect } from 'react';
import { useContext } from 'react';
import { LessonContext } from 'contexts/lesson/LessonContext';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import { esES } from '@mui/x-date-pickers';
import { connect, useSelector } from 'react-redux';
import BreadcrumbsComponent from 'ui-components/BreadcrumbsComponent';
import { ClassContext } from 'contexts/class/ClassContext';
import { useNavigate, useLocation } from 'react-router-dom';
import MainCard from 'ui-components/MainCard';
import DownloadIcon from '@mui/icons-material/Download';
import parse from 'html-react-parser';

// project imports
import CorrectionDialog from './CorrectionDialog';
import fileService from 'services/file.service';
import AlertDialog from 'ui-components/AlertDialog';
import handleResignationService from 'services/handleResignation.service';
import correctionService from 'services/correction.service';
import { getIcon } from 'utils/utils';
import CorrectionCard from './CorrectionCard';
import solutionService from 'services/solution.service';
import revisionService from 'services/revision.service';

const students = [
    {
        id: 1,
        name: 'Delia Andreea',
        lastName: 'Marin',
        score: 75
    },
    {
        id: 2,
        name: 'Javier',
        lastName: 'Benitez',
        score: 55
    },
    {
        id: 3,
        name: 'Oscar',
        lastName: 'Gonzalo',
        score: 40
    },
    {
        id: 4,
        name: 'Miguel',
        lastName: 'Hernández',
        score: 20
    },
    {
        id: 5,
        name: 'Carla',
        lastName: 'Fernández',
        score: 0
    },
    {
        id: 6,
        name: 'Marcos',
        lastName: 'Sánchez Giménez',
        score: 0
    }
];

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

const RevisionPanel = (props) => {
    const theme = useTheme();
    console.log(props.classObj);
    const navigate = useNavigate();
    const [revisions, setRevisions] = useState([]);
    const getRevisions = async () => {
        try {
            const response = await revisionService.getRevisions(props.classObj.id);
            setRevisions(response);
        } catch (error) {
            console.log(error);
            return {};
        }
    };
    useEffect(() => {
        getRevisions();
    }, []);
    const onRevisionRequestClick = (revisionObj) => {
        navigate(`/home/classes/class/task/solution`, {
            state: {
                solutionObj: revisionObj.solution,
                taskObj: revisionObj.task,
                classObj: props.classObj,
                correctionId: revisionObj.correctionId
            }
        });
    };

    return (
        <>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <BreadcrumbsComponent />
                </Grid>
                <Grid item xs>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="center" marginBottom={2}>
                                        <EmojiEventsIcon
                                            sx={{ alignContent: 'center', alignSelf: 'center' }}
                                            fontSize="large"
                                            style={{ color: 'yellow' }}
                                        ></EmojiEventsIcon>
                                    </Box>
                                    {students &&
                                        students.map((studentObj, index) => (
                                            <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}>
                                                <Card
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: theme.palette.primary.light,
                                                        ':hover': {
                                                            boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                                                        },
                                                        backgroundColor: theme.palette.primary.light,
                                                        width: '100%',
                                                        marginBottom: 0.5,
                                                        marginLeft: 2,
                                                        marginRight: 2
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Grid container spacing={3} direction="row" alignItems="center">
                                                            <Grid item>
                                                                <Grid item>
                                                                    <Typography variant="h1">{index + 1}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item>
                                                                <Avatar
                                                                    sx={{
                                                                        margin: '8px 0 8px 8px !important',
                                                                        bgcolor: stringToColor(studentObj.name + ' ' + studentObj.lastName)
                                                                    }}
                                                                    style={{ color: 'white' }}
                                                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                                                    aria-haspopup="true"
                                                                    children={`${studentObj.name.split(' ')[0][0]}${
                                                                        studentObj.lastName.split(' ')[0][0]
                                                                    }`}
                                                                />
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="h3">
                                                                    {studentObj.name + ' ' + studentObj.lastName}
                                                                </Typography>
                                                            </Grid>
                                                            <Box sx={{ flexGrow: 1 }} />
                                                            <Grid item sx={{ marginTop: 1 }}>
                                                                <Grid item>
                                                                    <Typography variant="h1">{studentObj.score}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Box>
                                        ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

function mapStateToProps(state) {
    const { user } = state.auth;
    const { classObj } = state.classObj;
    return {
        user,
        classObj
    };
}

export default connect(mapStateToProps)(RevisionPanel);
