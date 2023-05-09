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

const SolutionPanel = (props) => {
    const [openCorrection, setOpenCorrection] = useState(false);
    const [corrections, setCorrections] = useState([]);
    const [myCorrection, setMyCorrection] = useState(null);
    const [handled, setHandled] = useState(false);
    const navigate = useNavigate();
    const {
        state: { solutionObj }
    } = useLocation();

    const theme = useTheme();
    const isTeacher = props.user.roles.includes('ROLE_TEACHER');
    const userId = useSelector((state) => state.auth.user.id);

    /*     const getCorrections = async () => {
        try {
            const response = await correctionService.getCorrections(solutionObj.solution.id);
            console.log(response);
            setCorrections(response);
        } catch (error) {
            console.log(error);
            return {};
        }
    };
    function findAndRemoveMyCorrection() {
        for (let i = 0; i < corrections.length; i++) {
            if (corrections[i].userId === userId) {
                console.log('remove');
                const removed = corrections.splice(i, 1)[0];
                setCorrections(corrections);
                setMyCorrection(removed);
            }
        }
    }
    useEffect(() => {
        findAndRemoveMyCorrection();
    }, [corrections]); */
    const userHasHandled = myCorrection != null;

    /*     useEffect(() => {
        getCorrections();
    }, [handled]);
 */
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
                        <Typography variant="h4">{solutionObj.userName}</Typography>
                        <Typography variant="caption">
                            Fecha de entrega: {dayjs(solutionObj.solution.dateTime).format('ddd, DD MMM YYYY HH:mm:ss')}
                        </Typography>
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
                                disabled={userHasHandled || isTeacher}
                            >
                                Corregir
                            </Button>
                            <CorrectionDialog
                                openCorrection={openCorrection}
                                setOpenCorrection={setOpenCorrection}
                                solutionId={solutionObj.solution.id}
                                setHandled={setHandled}
                            />
                        </Box>
                    </MainCard>
                </Grid>
                {/*                 <Grid item xs>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    {myCorrection && (
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
                                                                <Grid item>{/*mySolution.calification!=null && <Icon>*}{/*</Grid>
                                                            </Grid>
                                                        </Grid>
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
                                        (userHasResigned || userHasHandled || isTeacher) &&
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
                                                            <Grid item sx={{ marginTop: 1 }}>
                                                                <Grid container direction="column" alignItems="center" spacing={1}>
                                                                    <Grid item>{/*solutionObj.calification!=null && <Icon>*}</Grid>
                                                                </Grid>
                                                            </Grid>
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
                </Grid> */}
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

export default connect(mapStateToProps)(SolutionPanel);
