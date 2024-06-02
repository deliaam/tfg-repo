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
import responseService from 'services/response.service';

import dayjs from 'dayjs';

import { useSelector } from 'react-redux';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ResponseDialog = ({ openResponse, setOpenResponse, questionId, setResponded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('Descripción');
    dayjs.locale('es');
    const [date, setDate] = useState(dayjs('2022-05-04T15:30'));
    const [files, setFiles] = useState([]);
    const auxFiles = [...files];
    const [lesson, setLesson] = useState(0);

    const userId = useSelector((state) => state.auth.user.id);

    const create = () => {
        responseService.createResponse(userId, questionId, description, files).then((response) => {
            setResponded(true);
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
    const handleCreateResponse = () => {
        create();
        setOpenResponse(false);
    };
    return (
        <Dialog
            open={openResponse}
            onClose={() => {
                setOpenResponse(false);
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
                            setOpenResponse(false);
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div" color="white">
                        Respuesta
                    </Typography>
                    <Button color="inherit" onClick={handleCreateResponse} size="large">
                        Entregar respuesta
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
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
export default ResponseDialog;
