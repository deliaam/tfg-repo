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
import responseService from 'services/response.service';
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
import ResponseDialog from './ResponseDialog';
import fileService from 'services/file.service';
import AlertDialog from 'ui-components/AlertDialog';
import handleResignationService from 'services/handleResignation.service';
import { getIcon } from 'utils/utils';
import ResponseCard from './ResponseCard';

const ResponsesPanel = (props) => {
    const [openResponse, setOpenResponse] = useState(false);
    const [responses, setResponses] = useState([]);
    const [correctResponse, setCorrectResponse] = useState(null);
    const [myResponse, setMyResponse] = useState(null);
    const [correct, setCorrect] = useState(false);
    const [responded, setResponded] = useState(false);
    const navigate = useNavigate();
    const {
        state: { questionObj }
    } = useLocation();
    const theme = useTheme();
    const isTeacher = props.user.roles.includes('ROLE_TEACHER');
    const userId = useSelector((state) => state.auth.user.id);

    const getResponses = async () => {
        try {
            console.log('get responses');
            const response = await responseService.getResponses(questionObj.question.id, userId);
            setResponses(response);
        } catch (error) {
            return {};
        }
    };

    function findAndRemoveCorrectResponse() {
        if (questionObj.question.isResponded) {
            for (let i = 0; i < responses.length; i++) {
                if (responses[i].correct) {
                    const removed = responses.splice(i, 1)[0];
                    setResponses(responses);
                    setCorrectResponse(removed);
                }
            }
        }
    }
    function findAndRemoveMyResponse() {
        for (let i = 0; i < responses.length; i++) {
            if (responses[i].userId == userId) {
                const removed = responses.splice(i, 1)[0];
                setResponses(responses);
                setMyResponse(removed);
            }
        }
    }

    useEffect(() => {
        findAndRemoveMyResponse();
        findAndRemoveCorrectResponse();
    }, [responses]);
    const userHasResponded = myResponse != null;

    useEffect(() => {
        getResponses();
    }, [responded]);

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

    return (
        <>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <BreadcrumbsComponent />
                </Grid>
                <Grid item xs>
                    <MainCard>
                        <Typography variant="h4">{questionObj.question.title}</Typography>
                        <Typography variant="caption">
                            Fecha de publicación: {dayjs(questionObj.question.dateTime).format('ddd, DD MMM YYYY HH:mm:ss')}
                        </Typography>
                        <Box sx={{ p: 0 }}></Box>
                        {questionObj.lesson && <Typography variant="caption">Tema: {questionObj.lesson}</Typography>}
                        {questionObj.task && <Typography variant="caption">Tema: {questionObj.task}</Typography>}
                        <Box sx={{ p: 1 }}></Box>
                        <Typography variant="body1">{<div>{parse(questionObj.question.description)}</div>}</Typography>
                        <Box sx={{ p: 2 }}></Box>

                        {questionObj.files.map((file) => {
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
                                    setOpenResponse(true);
                                }}
                                variant="contained"
                                size="small"
                                disabled={questionObj.userId == userId || questionObj.question.isResponded || userHasResponded}
                            >
                                Responder
                            </Button>
                            <ResponseDialog
                                openResponse={openResponse}
                                setOpenResponse={setOpenResponse}
                                questionId={questionObj.question.id}
                                setResponded={setResponded}
                            />
                        </Box>
                    </MainCard>
                </Grid>
                <Grid item xs>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    {correctResponse && (
                                        <ResponseCard
                                            responseObj={correctResponse}
                                            isOwn={false}
                                            isCorrect={true}
                                            setCorrect={setCorrect}
                                            correct={correct}
                                            questionObj={questionObj}
                                        />
                                    )}

                                    {myResponse && (
                                        <ResponseCard
                                            responseObj={myResponse}
                                            isOwn={true}
                                            isCorrect={myResponse.correct}
                                            setCorrect={setCorrect}
                                            isResponded={correct}
                                            questionObj={questionObj}
                                        />
                                    )}

                                    {responses &&
                                        responses.map((responseObj, index) => (
                                            <ResponseCard
                                                key={index}
                                                responseObj={responseObj}
                                                isOwn={false}
                                                isCorrect={false}
                                                setCorrect={setCorrect}
                                                isResponded={correct}
                                                questionObj={questionObj}
                                            />
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

export default connect(mapStateToProps)(ResponsesPanel);
