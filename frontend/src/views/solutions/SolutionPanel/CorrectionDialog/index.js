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
import correctionService from 'services/correction.service';

import { useSelector } from 'react-redux';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CorrectionDialog = ({ openCorrection, setOpenCorrection, solutionId, setHandled }) => {
    const [description, setDescription] = useState('Descripción');
    const [files, setFiles] = useState([]);
    const [qualification, setQualification] = useState();
    const auxFiles = [...files];
    console.log(qualification);
    const userId = useSelector((state) => state.auth.user.id);
    const qualifications = [
        { value: 'GOOD', label: 'Bien' },
        { value: 'FAIR', label: 'Regular' },
        { value: 'POOR', label: 'Mal' }
    ];

    const create = () => {
        console.log(files);
        correctionService.createCorrection(userId, solutionId, description, qualification, files).then((response) => {
            setHandled(true);
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
    const handleCreateCorrection = () => {
        create();
        setOpenCorrection(false);
    };
    const handleQualificationChange = (event) => {
        setQualification(event.target.value);
    };
    return (
        <Dialog
            open={openCorrection}
            onClose={() => {
                setOpenCorrection(false);
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
                            setOpenCorrection(false);
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div" color="white">
                        Corrección
                    </Typography>
                    <Button color="inherit" onClick={handleCreateCorrection} size="large">
                        Entregar corrección
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
                    <Grid item sx={{ flexGrow: 1, maxWidth: 500 }}>
                        <MainCard>
                            <Typography variant="h5">Calificación</Typography>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    value={qualification}
                                    onChange={handleQualificationChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {qualifications.map((qualification, index) => (
                                        <MenuItem value={qualification.value} key={index}>
                                            {qualification.label}
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
export default CorrectionDialog;
