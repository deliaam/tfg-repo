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
    Collapse
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

const revisionRequests = [
    {
        id: 1,
        student: 'Delia Andreea Marin',
        date: '7/05/24 21:55',
        task: 'Tarea 1',
        reviewed: true,
        solutionObj: {
            solution: {
                id: 23,
                description: '<p>Solución</p>',
                dateTime: '2024-01-02T18:19:19',
                qualification: 'POOR',
                filesIds: ['']
            },
            numberOfCorrections: 5,
            userName: 'Delia Andreea Marin',
            files: [['b6479dc9-4383-4bb7-a693-c28b16954223', 'Casos de uso 1 .docx']],
            corrected: true,
            userId: 1
        },
        taskObj: {
            task: {
                id: 24,
                title: 'Tarea 8',
                description: '<p>dedasdasd</p>',
                dateTime: '2024-05-10T13:30:00',
                filesIds: ['']
            },
            lesson: 'Tema 10',
            numberOfSolutions: 1,
            numberOfCorrections: 0,
            files: [['0963695d-be86-4f98-b973-6f6d9f6de6eb', '30546636.jpg']],
            active: true,
            resigned: false,
            answered: true
        },
        correctionId: 37
    },
    {
        id: 2,
        student: 'Carlos Andreea Marin',
        date: '7/05/24 21:55',
        task: 'Tarea 1',
        reviewed: true,
        solutionObj: {
            solution: {
                id: 23,
                description: '<p>Solución</p>',
                dateTime: '2024-01-02T18:19:19',
                qualification: 'POOR',
                filesIds: ['']
            },
            numberOfCorrections: 5,
            userName: 'Delia Andreea Marin',
            files: [['b6479dc9-4383-4bb7-a693-c28b16954223', 'Casos de uso 1 .docx']],
            corrected: true,
            userId: 1
        },
        taskObj: {
            task: {
                id: 24,
                title: 'Tarea 8',
                description: '<p>dedasdasd</p>',
                dateTime: '2024-05-10T13:30:00',
                filesIds: ['']
            },
            lesson: 'Tema 10',
            numberOfSolutions: 1,
            numberOfCorrections: 0,
            files: [['0963695d-be86-4f98-b973-6f6d9f6de6eb', '30546636.jpg']],
            active: true,
            resigned: false,
            answered: true
        },
        correctionId: 36
    },
    {
        id: 3,
        student: 'Pablo Andreea Marin',
        date: '7/05/24 21:55',
        task: 'Tarea 1',
        reviewed: true,
        solutionObj: {
            solution: {
                id: 23,
                description: '<p>Solución</p>',
                dateTime: '2024-01-02T18:19:19',
                qualification: 'POOR',
                filesIds: ['']
            },
            numberOfCorrections: 5,
            userName: 'Delia Andreea Marin',
            files: [['b6479dc9-4383-4bb7-a693-c28b16954223', 'Casos de uso 1 .docx']],
            corrected: true,
            userId: 1
        },
        taskObj: {
            task: {
                id: 24,
                title: 'Tarea 8',
                description: '<p>dedasdasd</p>',
                dateTime: '2024-05-10T13:30:00',
                filesIds: ['']
            },
            lesson: 'Tema 10',
            numberOfSolutions: 1,
            numberOfCorrections: 0,
            files: [['0963695d-be86-4f98-b973-6f6d9f6de6eb', '30546636.jpg']],
            active: true,
            resigned: false,
            answered: true
        },
        correctionId: 35
    }
];
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
                                    {revisions &&
                                        revisions.map((revisionObj, index) => (
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
                                                        margin: 2
                                                    }}
                                                >
                                                    <CardActionArea sx={{ p: 2 }} onClick={() => onRevisionRequestClick(revisionObj)}>
                                                        <Grid container spacing={3} direction="row" alignItems="center">
                                                            <Grid item>
                                                                <Grid
                                                                    container
                                                                    direction="column"
                                                                    alignItems="left"
                                                                    justifyContent="space-between"
                                                                    spacing={1}
                                                                >
                                                                    <Grid item>
                                                                        <Typography variant="h3">{revisionObj.userName}</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography variant="body1">
                                                                            Solicitud:
                                                                            {dayjs(revisionObj.revision.dateTime).format(
                                                                                'ddd, DD MMM YYYY HH:mm:ss'
                                                                            )}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography variant="h5">Tarea: {revisionObj.taskTitle}</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Box sx={{ flexGrow: 1 }} />
                                                            <Grid item>
                                                                <ArrowCircleRightIcon fontSize="large" />
                                                            </Grid>
                                                        </Grid>
                                                    </CardActionArea>
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
