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

const CorrectionCard = ({ correctionObj, isOwn }) => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    const handleExpandClick = () => {
        setExpanded(!expanded);
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

                        {correctionObj.files.map((file) => {
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
                    </CardContent>
                </Collapse>
            </Card>
        </Box>
    );
};
export default CorrectionCard;
