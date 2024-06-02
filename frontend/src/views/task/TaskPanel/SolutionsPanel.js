import { Box, Breadcrumbs, ButtonBase, Divider, Grid, IconButton } from '@mui/material';
import { useState } from 'react';
// filtering imports

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
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
    FormControlLabel
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
import solutionService from 'services/solution.service';
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
import SolutionDialog from './SolutionDialog';
import fileService from 'services/file.service';
import AlertDialog from 'ui-components/AlertDialog';
import handleResignationService from 'services/handleResignation.service';
import { getIcon } from 'utils/utils';

const SolutionsPanel = (props) => {
    const [openSolution, setOpenSolution] = useState(false);
    const [solutions, setSolutions] = useState([]);
    const [mySolution, setMySolution] = useState(null);
    const [handled, setHandled] = useState(false);
    const [openResign, setOpenResign] = useState(false);
    const navigate = useNavigate();
    const {
        state: { taskObj, classObj }
    } = useLocation();
    const [userHasResigned, setUserHasResigned] = useState(taskObj.resigned);
    console.log(taskObj);
    const theme = useTheme();
    const isTeacher = props.user.roles.includes('ROLE_TEACHER');
    const userId = useSelector((state) => state.auth.user.id);

    const getSolutions = async () => {
        try {
            const response = await solutionService.getSolutions(taskObj.task.id, userId);
            setSolutions(response);
        } catch (error) {
            return {};
        }
    };
    function findAndRemoveMySolution() {
        for (let i = 0; i < solutions.length; i++) {
            if (solutions[i].userId === userId) {
                const removed = solutions.splice(i, 1)[0];
                setSolutions(solutions);
                setMySolution(removed);
            }
        }
    }
    useEffect(() => {
        findAndRemoveMySolution();
    }, [solutions]);
    const userHasHandled = mySolution != null;

    const onSolutionClick = (solutionObj) => {
        navigate(`/home/classes/class/task/solution`, { state: { solutionObj: solutionObj, taskObj: taskObj, classObj: classObj } });
    };

    useEffect(() => {
        getSolutions();
    }, [handled]);

    async function downloadFile(id) {
        const response = await fileService.getFile(id);
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.fileName);
        document.body.appendChild(link);
        link.click();
    }

    const handleResign = async () => {
        try {
            const response = await handleResignationService.create(userId, taskObj.task.id);
            setUserHasResigned(true);
        } catch (error) {
            return {};
        }
        setOpenResign(false);
    };

    return (
        <>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <BreadcrumbsComponent />
                </Grid>
                <Grid item xs>
                    <MainCard>
                        <Typography variant="h4">{taskObj.task.title}</Typography>
                        <Typography variant="caption">
                            Fecha de entrega: {dayjs(taskObj.task.dateTime).format('ddd, DD MMM YYYY HH:mm:ss')}
                        </Typography>
                        <Box sx={{ p: 0 }}></Box>
                        <Typography variant="caption">Tema: {taskObj.lesson}</Typography>
                        <Box sx={{ p: 1 }}></Box>
                        <Typography variant="body1">{<div>{parse(taskObj.task.description)}</div>}</Typography>
                        <Box sx={{ p: 2 }}></Box>

                        {taskObj.files.map((file) => {
                            return (
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <Typography>{file[1]}</Typography>
                                    <IconButton>
                                        <DownloadIcon
                                            onClick={() => {
                                                downloadFile(file[0]);
                                            }}
                                        ></DownloadIcon>
                                    </IconButton>
                                </Box>
                            );
                        })}
                        <Box sx={{ p: 1 }}></Box>
                        <Box sx={{ display: 'flex', alignItems: 'right' }}>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                onClick={() => {
                                    setOpenResign(true);
                                }}
                                variant="contained"
                                size="small"
                                disabled={userHasHandled || userHasResigned || isTeacher}
                            >
                                Ver soluciones
                            </Button>
                            <AlertDialog
                                open={openResign}
                                setOpen={setOpenResign}
                                title="Estás seguro de que quieres ver las soluciones?"
                                body="Si aceptas estarás renunciando a la posibilidad de entregar una solución a esta tarea."
                                disagree={true}
                                agree={true}
                                handle={handleResign}
                            ></AlertDialog>
                            <Box sx={{ p: 1 }}></Box>
                            <Button
                                onClick={() => {
                                    setOpenSolution(true);
                                }}
                                variant="contained"
                                size="small"
                                disabled={userHasHandled || userHasResigned || isTeacher || !taskObj.active}
                            >
                                Entregar solución
                            </Button>
                            <SolutionDialog
                                openSolution={openSolution}
                                setOpenSolution={setOpenSolution}
                                taskId={taskObj.task.id}
                                setHandled={setHandled}
                            />
                        </Box>
                    </MainCard>
                </Grid>
                <Grid item xs>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    {mySolution && (
                                        <Box key={-1} sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}>
                                            <Card
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: theme.palette.secondary.light,
                                                    ':hover': {
                                                        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                                                    },
                                                    backgroundColor: theme.palette.secondary.light,
                                                    width: '100%',
                                                    margin: 2
                                                }}
                                            >
                                                <CardActionArea
                                                    sx={{ p: 2 }}
                                                    onClick={() => {
                                                        onSolutionClick(mySolution);
                                                    }}
                                                >
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
                                                                    <Typography variant="h3">Tu solución</Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography variant="body1">
                                                                        Entregado:{' '}
                                                                        {dayjs(mySolution.solution.dateTime).format(
                                                                            'ddd, DD MMM YYYY HH:mm:ss'
                                                                        )}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Box sx={{ flexGrow: 1 }} />
                                                        <Grid item sx={{ marginTop: 1 }}>
                                                            <Grid container direction="column" alignItems="center" spacing={1}>
                                                                <Grid item>{/*mySolution.calification!=null && <Icon>*/}</Grid>
                                                            </Grid>
                                                        </Grid>
                                                        {mySolution.solution.qualification && (
                                                            <Grid item sx={{ marginTop: 1.3 }}>
                                                                <Grid container direction="column" alignItems="center" spacing={1}>
                                                                    <Grid item>{getIcon(mySolution.solution.qualification)}</Grid>
                                                                    <Grid item>
                                                                        <Typography variant="body1">Calificación</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}

                                                        <Grid item sx={{ marginTop: 1 }}>
                                                            <Grid container direction="column" alignItems="center" spacing={1}>
                                                                <Grid item>
                                                                    <Typography variant="h1">{mySolution.numberOfCorrections}</Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography variant="body1">Correcciones</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item>
                                                            <ArrowCircleRightIcon fontSize="large" />
                                                        </Grid>
                                                    </Grid>
                                                </CardActionArea>
                                            </Card>
                                        </Box>
                                    )}
                                    {solutions &&
                                        (userHasResigned || userHasHandled || isTeacher || !taskObj.active) &&
                                        solutions.map((solutionObj, index) => (
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
                                                    <CardActionArea
                                                        sx={{ p: 2 }}
                                                        onClick={() => {
                                                            onSolutionClick(solutionObj);
                                                        }}
                                                    >
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
                                                                        <Typography variant="h3">{solutionObj.userName}</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography variant="body1">
                                                                            Entregado:{' '}
                                                                            {dayjs(solutionObj.solution.dateTime).format(
                                                                                'ddd, DD MMM YYYY HH:mm:ss'
                                                                            )}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Box sx={{ flexGrow: 1 }} />
                                                            {solutionObj.solution.qualification && (
                                                                <Grid item sx={{ marginTop: 1.1 }}>
                                                                    <Grid container direction="column" alignItems="center" spacing={1}>
                                                                        <Grid item>{getIcon(solutionObj.solution.qualification)}</Grid>
                                                                        <Grid item>
                                                                            <Typography variant="body1">Calificación</Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            )}

                                                            <Grid item sx={{ marginTop: 1 }}>
                                                                <Grid container direction="column" alignItems="center" spacing={1}>
                                                                    <Grid item>
                                                                        <Typography variant="h1">
                                                                            {solutionObj.numberOfCorrections}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography variant="body1">Correcciones</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
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
    return {
        user
    };
}

export default connect(mapStateToProps)(SolutionsPanel);
