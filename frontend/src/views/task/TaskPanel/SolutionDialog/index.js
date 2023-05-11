import {
    Grid,
    TextField,
    Box,
    IconButton,
    Dialog,
    AppBar,
    Toolbar,
    Typography,
    Button,
    DialogContent,
    Slide,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';
import { useState, forwardRef, useEffect } from 'react';

import ReactQuill from 'react-quill';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // material-ui
import CloseIcon from '@mui/icons-material/Close';

import 'react-quill/dist/quill.snow.css';

import { useContext } from 'react';

// project imports
import MainCard from 'ui-components/MainCard';
import { LessonContext } from 'contexts/lesson/LessonContext';
import './rte-editor.css';
import FileComponent from 'ui-components/FileComponent';
import solutionService from 'services/solution.service';

// date time picker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import { esES } from '@mui/x-date-pickers/locales';
import { useSelector } from 'react-redux';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SolutionDialog = ({ openSolution, setOpenSolution, taskId, setHandled }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('Descripción');
    dayjs.locale('es');
    const [date, setDate] = useState(dayjs('2022-05-04T15:30'));
    const [files, setFiles] = useState([]);
    const auxFiles = [...files];
    const [lesson, setLesson] = useState(0);

    const userId = useSelector((state) => state.auth.user.id);

    const create = () => {
        solutionService.createSolution(userId, taskId, description, files).then((response) => {
            setHandled(true);
        });
    };

    const selectFile = (event) => {
        const filesObj = event.target.files;
        for (let i = 0; i < filesObj.length; i++) {
            auxFiles.push(event.target.files[i]);
        }
        setFiles(auxFiles);
    };

    const removeFile = (index) => {
        auxFiles.splice(index, 1);
        setFiles(auxFiles);
    };
    useEffect(() => {}, [files]);
    const handleCreateTask = () => {
        create();
        setOpenSolution(false);
    };
    return (
        <Dialog
            open={openSolution}
            onClose={() => {
                setOpenSolution(false);
            }}
            fullScreen
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            setOpenSolution(false);
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div" color="white">
                        Solución
                    </Typography>
                    <Button color="inherit" onClick={handleCreateTask} size="large">
                        Entregar solución
                    </Button>
                </Toolbar>
            </AppBar>
            <DialogContent sx={{ background: 'rgb(238, 242, 246)' }}>
                <Grid container direction="row" justifyContent="center" spacing={10}>
                    <Grid item sx={{ flexGrow: 1, maxWidth: 1000 }}>
                        <MainCard>
                            <ReactQuill theme="snow" value={description} onChange={setDescription} className="rt-editor" />
                            <Box sx={{ p: 1 }}></Box>

                            <input style={{ display: 'none' }} id="raised-button-file" type="file" multiple onChange={selectFile} />
                            <label htmlFor="raised-button-file">
                                <IconButton variant="raised" component="span" size="large">
                                    <UploadFileIcon />
                                </IconButton>
                            </label>
                            <Box sx={{ p: 1 }}></Box>
                            {files.map((fileObj, index) => {
                                return (
                                    <>
                                        <FileComponent fileObj={fileObj} removeFile={removeFile} index={index}></FileComponent>{' '}
                                        <Box sx={{ p: 1 }}></Box>
                                    </>
                                );
                            })}
                        </MainCard>

                        {/*<div>{parse(description)}</div>*/}
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
export default SolutionDialog;
