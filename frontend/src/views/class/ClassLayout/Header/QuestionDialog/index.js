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
import { useSelector } from 'react-redux';

import ReactQuill from 'react-quill';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // material-ui
import CloseIcon from '@mui/icons-material/Close';

import 'react-quill/dist/quill.snow.css';

import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// project imports
import MainCard from 'ui-components/MainCard';
import { LessonContext } from 'contexts/lesson/LessonContext';
import { TaskContext } from 'contexts/task/TaskContext';
import './rte-editor.css';
import FileComponent from 'ui-components/FileComponent';
import questionService from 'services/question.service';

// date time picker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import { esES } from '@mui/x-date-pickers/locales';
import { QuestionContext } from 'contexts/question/QuestionContext';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const QuestionDialog = ({ openCreate, setOpenCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('Descripción');
    const { lessonsList, setLessonsList } = useContext(LessonContext);
    const { tasksList, setTasksList } = useContext(TaskContext);
    const { questionsList, setQuestionsList } = useContext(QuestionContext);
    console.log(lessonsList);
    console.log(tasksList);
    const [files, setFiles] = useState([]);
    const auxFiles = [...files];
    const userId = useSelector((state) => state.auth.user.id);
    const {
        state: { classObj }
    } = useLocation();
    const [lesson, setLesson] = useState(-1);
    const [task, setTask] = useState(-1);
    const handleLessonChange = (event) => {
        setLesson(event.target.value);
        setTask(-1);
    };
    const handleTaskChange = (event) => {
        setTask(event.target.value);
        setLesson(-1);
    };
    const create = async () => {
        await questionService.create(
            title,
            description,
            files,
            lesson > -1 ? lessonsList[lesson].id : null,
            task > -1 ? tasksList[task].task.id : null,
            userId
        );
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
    const handleCreateQuestion = async () => {
        await create();
        try {
            const response = await questionService.getQuestions(classObj.id, null);
            setQuestionsList(response);
        } catch (error) {
            console.log(error);
            setQuestionsList([]);
        }
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
                        Pregunta
                    </Typography>
                    <Button color="inherit" disabled={task == -1 && lesson == -1} onClick={handleCreateQuestion} size="large">
                        Crear pregunta
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
                    </Grid>
                    <Grid item sx={{ flexGrow: 1, maxWidth: 500 }}>
                        <MainCard>
                            <Typography variant="h5">Elige el tema o la tarea relacionada</Typography>
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
                            <Box sx={{ p: 1 }}></Box>
                            <Typography variant="h5">Tarea</Typography>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    value={task}
                                    onChange={handleTaskChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {tasksList &&
                                        tasksList.map((task, index) => (
                                            <MenuItem value={index} key={index}>
                                                {task.task.title}
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
export default QuestionDialog;
