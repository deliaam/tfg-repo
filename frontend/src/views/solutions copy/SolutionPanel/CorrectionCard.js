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
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';

// project imports
import CorrectionDialog from './CorrectionDialog';
import fileService from 'services/file.service';
import AlertDialog from 'ui-components/AlertDialog';
import handleResignationService from 'services/handleResignation.service';
import correctionService from 'services/correction.service';
import revisionService from 'services/revision.service';

import { getIcon } from 'utils/utils';

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

const CorrectionCard = ({ correctionObj, isOwn, setDeleted, setQualification }) => {
    const [expanded, setExpanded] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openRevision, setOpenRevision] = useState(false);

    const theme = useTheme();
    const isTeacher = useSelector((state) => state.auth.user.roles).includes('ROLE_TEACHER');
    const userId = useSelector((state) => state.auth.user.id);

    const {
        state: { solutionObj }
    } = useLocation();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const deleteCorrection = async () => {
        console.log(correctionObj.correction.id);
        try {
            const response = await correctionService.deleteCorrection(correctionObj.correction.id);
            setDeleted(true);
            setQualification(response);
        } catch (error) {
            console.log(error);
        }
    };
    const revisionRequest = async () => {
        console.log(correctionObj.correction.id);
        try {
            const response = await revisionService.createRevision(correctionObj.correction.id);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDelete = () => {
        console.log('handle delete');
        deleteCorrection();
        setOpenDelete(false);
    };
    const handleRevision = () => {
        console.log('handle revision');

        revisionRequest();
        setOpenRevision(false);
    };
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}>
            <Card
                sx={{
                    border: '1px solid',
                    borderColor: isOwn ? theme.palette.secondary.light : theme.palette.primary.light,
                    ':hover': {
                        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                    },
                    backgroundColor: isOwn ? theme.palette.secondary.light : theme.palette.primary.light,
                    width: '100%',
                    margin: 2
                }}
            >
                <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={3} direction="row" alignItems="center" alignContent="center">
                        <Grid item>
                            <Grid
                                container
                                direction="column"
                                alignItems="left"
                                justifyContent="space-between"
                                spacing={1}
                                alignContent="center"
                            >
                                <Grid item>
                                    <Typography variant="h3">{isOwn ? 'Tu corrección' : correctionObj.userName}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">
                                        Entregado: {dayjs(correctionObj.correction.dateTime).format('ddd, DD MMM YYYY HH:mm:ss')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box sx={{ flexGrow: 1 }} />
                        <Grid item sx={{ marginTop: 1 }}>
                            <Grid container direction="column" alignItems="center" spacing={1}>
                                <Grid item>{getIcon(correctionObj.correction.qualification)}</Grid>
                            </Grid>
                        </Grid>
                        {isTeacher && (
                            <Grid item>
                                <IconButton
                                    onClick={() => {
                                        setOpenDelete(true);
                                    }}
                                >
                                    <DeleteIcon></DeleteIcon>
                                </IconButton>
                                <AlertDialog
                                    open={openDelete}
                                    setOpen={setOpenDelete}
                                    title="Estás seguro de que quieres eliminar la corrección?"
                                    body="La corrección será borrada definitivamente y no podrá ser recuperada, dejando de contar para el cálculo de la calificación total de la solución."
                                    disagree={true}
                                    agree={true}
                                    handle={handleDelete}
                                ></AlertDialog>
                            </Grid>
                        )}
                        {solutionObj.userId == userId && (
                            <Grid item>
                                <IconButton
                                    onClick={() => {
                                        setOpenRevision(true);
                                    }}
                                >
                                    <FlagIcon />
                                </IconButton>
                                <AlertDialog
                                    open={openRevision}
                                    setOpen={setOpenRevision}
                                    title="Estás seguro de realizar una petición de revisión de esta corrección?"
                                    body="Asegúrate de leer detenidamente los contenidos de la corrección. Si crees que la calificación asignada no está justificada, tu profesor eliminará la corrección si lo ve oportuno."
                                    disagree={true}
                                    agree={true}
                                    handle={handleRevision}
                                ></AlertDialog>
                            </Grid>
                        )}
                        <Grid item>
                            <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </Grid>
                    </Grid>
                </CardContent>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography variant="body1">{<div>{parse(correctionObj.correction.description)}</div>}</Typography>
                        <Box sx={{ p: 2 }}></Box>

                        {correctionObj.files.map((file, index) => {
                            return (
                                <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <Typography>{file[1]}</Typography>
                                    <IconButton
                                        onClick={() => {
                                            downloadFile(file[0]);
                                        }}
                                    >
                                        <DownloadIcon></DownloadIcon>
                                    </IconButton>
                                </Box>
                            );
                        })}
                    </CardContent>
                </Collapse>
            </Card>
        </Box>
    );
};
export default CorrectionCard;
