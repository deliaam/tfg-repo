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
import taskService from 'services/task.service';

// date time picker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import { esES } from '@mui/x-date-pickers/locales';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDialog = ({ openCreate, setOpenCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('Descripción');
    const { lessonsList, setLessonsList } = useContext(LessonContext);
    dayjs.locale('es');
    const [date, setDate] = useState(dayjs('2022-05-04T15:30'));
    console.log(date);
    const [files, setFiles] = useState([]);
    const auxFiles = [...files];

    const [lesson, setLesson] = useState(0);
    const handleLessonChange = (event) => {
        setLesson(event.target.value);
    };
    const create = () => {
        console.log(files);
        taskService.create(title, description, files, date.toISOString(), lessonsList[lesson].id).then((response) => {
            console.log(response);
        });
    };

    const selectFile = (event) => {
        const filesObj = event.target.files;
        console.log(filesObj);
        for (let i = 0; i < filesObj.length; i++) {
            auxFiles.push(event.target.files[i]);
        }
        setFiles(auxFiles);
        console.log(`files : ${files}`);
    };

    const removeFile = (index) => {
        auxFiles.splice(index, 1);
        setFiles(auxFiles);
    };
    useEffect(() => {
        console.log(`files : ${files}`);
    }, [files]);
    const handleCreateTask = () => {
        create();
        setOpenCreate(false);
    };
    return (
        <Dialog
            open={openCreate}
            onClose={() => {
                setOpenCreate(false);
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
                            setOpenCreate(false);
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div" color="white">
                        Tarea
                    </Typography>
                    <Button color="inherit" onClick={handleCreateTask} size="large">
                        Crear tarea
                    </Button>
                </Toolbar>
            </AppBar>
            <DialogContent sx={{ background: 'rgb(238, 242, 246)' }}>
                <Grid container direction="row" justifyContent="center" spacing={10}>
                    <Grid item sx={{ flexGrow: 1, maxWidth: 1000 }}>
                        <MainCard>
                            <TextField
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                margin="dense"
                                id="name"
                                label={'Título'}
                                fullWidth
                                variant="outlined"
                            />
                            <Box sx={{ p: 1 }}></Box>
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
                    <Grid item sx={{ flexGrow: 1, maxWidth: 500 }}>
                        <MainCard>
                            <Typography variant="h5">Fecha de entrega</Typography>
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                            >
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker
                                        format="DD-MM-YYYY hh:mm A"
                                        value={date}
                                        onChange={(newValue) => {
                                            setDate(newValue);
                                            console.log(newValue.toISOString());
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <Box sx={{ p: 1 }}></Box>
                            <Typography variant="h5">Tema</Typography>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    value={lesson}
                                    onChange={handleLessonChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {lessonsList &&
                                        lessonsList.map((lesson, index) => (
                                            <MenuItem value={index} key={index}>
                                                {lesson.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </MainCard>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
export default TaskDialog;
