import { Box, Breadcrumbs, ButtonBase, Divider, Grid, IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
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

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    })
}));

const SolutionPanel = (props) => {
    const [openCorrection, setOpenCorrection] = useState(false);
    const [corrections, setCorrections] = useState([]);
    const [myCorrection, setMyCorrection] = useState(null);
    const [handled, setHandled] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const navigate = useNavigate();
    const {
        state: { solutionObj, correctionId }
    } = useLocation();
    console.log(solutionObj);
    const [qualification, setQualification] = useState(solutionObj.solution.qualification);
    console.log(correctionId);
    const theme = useTheme();
    const userId = useSelector((state) => state.auth.user.id);
    const isTeacher = useSelector((state) => state.auth.user.roles).includes('ROLE_TEACHER');
    const getCorrections = async () => {
        if (solutionObj.userId == userId || solutionObj.corrected || handled || isTeacher || deleted) {
            try {
                const response = await correctionService.getCorrections(solutionObj.solution.id);
                setCorrections(response);
            } catch (error) {
                console.log(error);
                return {};
            }
        }
    };

    function findAndRemoveMyCorrection() {
        for (let i = 0; i < corrections.length; i++) {
            if (corrections[i].userId === userId) {
                const removed = corrections.splice(i, 1)[0];
                setCorrections(corrections);
                setMyCorrection(removed);
            }
        }
    }

    const elementToScroll = useRef(null);

    useEffect(() => {
        if (elementToScroll.current) {
            elementToScroll.current.scrollIntoView({ behavior: 'smooth' });
        }
    });
    useEffect(() => {
        findAndRemoveMyCorrection();
    }, [corrections]);

    useEffect(() => {
        getCorrections();
        setDeleted(false);
    }, [handled, deleted]);

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
    console.log(corrections);
    return (
        <>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <BreadcrumbsComponent />
                </Grid>
                <Grid item xs>
                    <MainCard>
                        <Grid container direction="row">
                            <Grid item>
                                <Typography variant="h4">{solutionObj.userName}</Typography>
                                <Typography variant="caption">
                                    Entregado: {dayjs(solutionObj.solution.dateTime).format('ddd, DD MMM YYYY HH:mm:ss')}
                                </Typography>
                            </Grid>
                            <Box sx={{ flexGrow: 1 }} />
                            {(solutionObj.userId == userId || solutionObj.corrected || handled || isTeacher) && (
                                <Grid item>{getIcon(qualification)}</Grid>
                            )}
                        </Grid>
                        <Typography variant="body1">{<div>{parse(solutionObj.solution.description)}</div>}</Typography>
                        <Box sx={{ p: 2 }}></Box>

                        {solutionObj.files &&
                            solutionObj.files.map((file) => {
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
                            <Box sx={{ p: 1 }}></Box>
                            <Button
                                onClick={() => {
                                    setOpenCorrection(true);
                                }}
                                variant="contained"
                                size="small"
                                disabled={solutionObj.corrected || solutionObj.userId == userId || handled}
                            >
                                Corregir
                            </Button>
                            <CorrectionDialog
                                openCorrection={openCorrection}
                                setOpenCorrection={setOpenCorrection}
                                solutionId={solutionObj.solution.id}
                                setHandled={setHandled}
                                setNewQualification={setQualification}
                            />
                        </Box>
                    </MainCard>
                </Grid>
                <Grid item xs>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    {myCorrection && (
                                        <CorrectionCard
                                            correctionObj={myCorrection}
                                            isOwn={true}
                                            setDeleted={setDeleted}
                                            setQualification={setQualification}
                                        />
                                    )}

                                    {corrections &&
                                        corrections.map((correctionObj, index) => (
                                            <div ref={correctionObj.correction.id == correctionId ? elementToScroll : undefined}>
                                                <CorrectionCard
                                                    key={index}
                                                    correctionObj={correctionObj}
                                                    isOwn={false}
                                                    setDeleted={setDeleted}
                                                    setQualification={setQualification}
                                                    setHandled={setHandled}
                                                    handled={handled}
                                                    scrolled={correctionObj.correction.id == correctionId}
                                                />
                                            </div>
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
    console.log(user);
    return {
        user
    };
}

export default connect(mapStateToProps)(SolutionPanel);
