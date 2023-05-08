import { Box, Breadcrumbs, Divider, Grid } from '@mui/material';
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
import taskService from 'services/task.service';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import { esES } from '@mui/x-date-pickers';
import { connect, useSelector } from 'react-redux';
import BreadcrumbsComponent from 'ui-components/BreadcrumbsComponent';
import { ClassContext } from 'contexts/class/ClassContext';
import { useNavigate } from 'react-router-dom';

const TasksPanel = (props) => {
    const [order, setOrder] = useState('recents');
    const [lesson, setLesson] = useState(-1);
    const [state, setState] = useState({
        pending: true,
        handled: true,
        closed: true
    });
    const [tasks, setTasks] = useState(undefined);

    const { pending, handled, closed } = state;
    const { classObj } = useContext(ClassContext) || { classObj: undefined };

    const { lessonsList, setLessonsList } = useContext(LessonContext);
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.user.id);
    const theme = useTheme();
    const isTeacher = props.user.roles.includes('ROLE_TEACHER');
    dayjs.locale('es');

    const getTasks = async () => {
        try {
            const response = await taskService.getTasks(classObj.id, userId);
            console.log(response);
            setTasks(response);
        } catch (error) {
            console.log(error);
            return {};
        }
    };
    const handleStateChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked
        });
    };
    const handleOrderChange = (event) => {
        setOrder(event.target.value);
    };
    const handleLessonChange = (event) => {
        setLesson(event.target.value);
    };
    const onTaskClick = (taskObj) => {
        navigate(`/home/classes/class/task`, { state: { taskObj: taskObj } });
    };

    useEffect(() => {
        getTasks();
    }, []);
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
                                    {tasks &&
                                        tasks.map((taskObj, index) => (
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
                                                            onTaskClick(taskObj);
                                                        }}
                                                    >
                                                        <Grid container spacing={3} direction="row" alignItems="center">
                                                            <Grid item>
                                                                {!isTeacher && taskObj.answered && taskObj.active && (
                                                                    <CheckCircleIcon fontSize="large" color="success" />
                                                                )}
                                                                {!isTeacher && taskObj.active && !taskObj.answered && (
                                                                    <AccessTimeFilledIcon fontSize="large" color="warning" />
                                                                )}
                                                                {isTeacher && taskObj.active && (
                                                                    <AccessTimeFilledIcon fontSize="large" color="warning" />
                                                                )}
                                                                {!taskObj.active && <CancelIcon fontSize="large" color="error" />}
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
                                                                        <Typography variant="body1">{taskObj.lesson}</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography variant="h3">{taskObj.task.title}</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography variant="body1">
                                                                            {dayjs(taskObj.task.dateTime).format(
                                                                                'ddd, DD MMM YYYY HH:mm:ss'
                                                                            )}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Box sx={{ flexGrow: 1 }} />
                                                            <Grid item sx={{ marginTop: 1 }}>
                                                                <Grid container direction="column" alignItems="center" spacing={1}>
                                                                    <Grid item>
                                                                        <Typography variant="h1">{taskObj.numberOfSolutions}</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography variant="body1">Soluciones</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            {!isTeacher && (
                                                                <Grid item sx={{ marginTop: 1 }}>
                                                                    <Grid container direction="column" alignItems="center" spacing={1}>
                                                                        <Grid item>
                                                                            <Typography variant="h1">
                                                                                {taskObj.numberOfCorrections}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <Typography variant="body1">Mis Correcciones</Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            )}
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
                        <Grid item xs={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h3">Filtros</Typography>
                                    <Accordion sx={{ marginTop: 2 }} defaultExpanded={true}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography variant="h4">Fecha</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                <Select
                                                    value={order}
                                                    onChange={handleOrderChange}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                    <MenuItem value="recents">Más recientes</MenuItem>
                                                    <MenuItem value="older">Más antiguas</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion defaultExpanded={true}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            <Typography variant="h4">Temas</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                <Select
                                                    value={lesson}
                                                    onChange={handleLessonChange}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                    <MenuItem value={-1}>Todos</MenuItem>

                                                    {lessonsList &&
                                                        lessonsList.map((lesson, index) => (
                                                            <MenuItem value={index} key={index}>
                                                                {lesson.name}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion defaultExpanded={true}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            <Typography variant="h4">Estado</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={pending} onChange={handleStateChange} name="pending" />}
                                                        label="Pendientes"
                                                    />
                                                    <FormControlLabel
                                                        control={<Checkbox checked={handled} onChange={handleStateChange} name="handled" />}
                                                        label="Entregadas"
                                                    />
                                                    <FormControlLabel
                                                        control={<Checkbox checked={closed} onChange={handleStateChange} name="closed" />}
                                                        label="Cerradas"
                                                    />
                                                </FormGroup>
                                            </FormControl>
                                        </AccordionDetails>
                                    </Accordion>
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

export default connect(mapStateToProps)(TasksPanel);
