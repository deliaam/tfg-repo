import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import LessonService from 'services/lesson.service';
import { useContext } from 'react';
import { LessonContext } from 'contexts/lesson/LessonContext';

const LessonDialog = ({ openCreate, setOpenCreate, classId }) => {
    const [title, setTitle] = useState('');
    const { lessonsList, setLessonsList } = useContext(LessonContext);
    console.log(lessonsList);

    const newLessonsList = lessonsList;
    const handleCreateLesson = async () => {
        try {
            const response = await LessonService.create(title, classId);
            console.log(`response: ${JSON.stringify(response)}`);
            lessonsList.push(response);
            setLessonsList(lessonsList);
        } catch (error) {
            console.log(error);
            return {};
        }

        setOpenCreate(false);
        setTitle('');
    };
    return (
        <Dialog
            open={openCreate}
            onClose={() => {
                setOpenCreate(false);
            }}
            width={100}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle fontSize="1.25rem">Crear tema</DialogTitle>
            <DialogContent>
                <TextField
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                    margin="dense"
                    id="name"
                    label="Nombre del tema"
                    fullWidth
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions sx={{ marginBottom: 2, marginRight: 2 }}>
                <Button
                    onClick={() => {
                        setOpenCreate(false);
                    }}
                    color="error"
                >
                    Cancelar
                </Button>
                <Button disabled={title === ''} onClick={handleCreateLesson} variant="contained" size="small">
                    {'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LessonDialog;
