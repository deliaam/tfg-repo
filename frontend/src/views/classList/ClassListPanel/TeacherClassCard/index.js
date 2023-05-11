import { useState } from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography, CardActionArea, CardActions, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { blue } from '@mui/material/colors';
import { palette } from '@mui/system';
import AlertDialog from 'ui-components/AlertDialog';
import { Dialog, DialogActions, TextField, DialogTitle, DialogContent } from '@mui/material';
import ClassService from 'services/class.service';
import { connect } from 'react-redux';
// ==============================|| CUSTOM MAIN CARD ||============================== //

const TeacherClassCard = (props) => {
    const classObj = props.classObj;
    const handleDeleteClass = props.handleDeleteCLass;
    const sx = props.sx;
    const theme = useTheme();
    const [name, setName] = useState(classObj.name);
    const [editName, setEditName] = useState(classObj.name);

    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openCode, setOpenCode] = useState(false);

    const deleteClass = async () => {
        try {
            const response = await ClassService.deleteClass(classObj.id);
            if (response.status) {
                handleDeleteClass(classObj.id);
            } else {
                throw -1;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const editClass = async () => {
        try {
            const response = await ClassService.editClass(classObj.id, editName);
            if (response.status === 200) {
                setName(editName);
            } else {
                throw -1;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = () => {
        deleteClass();
        setOpenDelete(false);
    };
    const handleEdit = () => {
        editClass();
        setOpenEdit(false);
    };
    return (
        <Card
            sx={{
                border: '1px solid',
                borderColor: theme.palette.primary[200] + 25,
                ':hover': {
                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                },
                maxWidth: 345,
                minWidth: 280,
                margin: 2,
                ...sx
            }}
        >
            <CardActionArea
                onClick={props.onClassClick}
                sx={{
                    flexGrow: 1,
                    flexDirection: 'column',
                    alignItems: 'stretch'
                }}
            >
                {/* card header and action */}
                {name && <CardHeader sx={{ backgroundColor: theme.palette.secondary.light }} title={name} />}
                {/* content & header divider */}
                {name && <Divider />}
                <CardContent></CardContent>
                {/* content & actions divider */}
                <Divider />
            </CardActionArea>
            <CardActions sx={{ padding: 1 }}>
                <IconButton aria-label="delete" onClick={() => setOpenDelete(true)}>
                    <DeleteIcon />
                </IconButton>
                {/* Delete dialog*/}
                <AlertDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    title="Estás seguro de que quieres eliminar la clase?"
                    body="La clase será borrada definitivamente y no podrá ser recuperada"
                    disagree={true}
                    agree={true}
                    handle={handleDelete}
                ></AlertDialog>
                <IconButton aria-label="viewCode" onClick={() => setOpenCode(true)}>
                    <VisibilityIcon />
                </IconButton>
                <Dialog
                    open={openCode}
                    onClose={() => {
                        setOpenCode(false);
                    }}
                    fullWidth={true}
                    maxWidth="xs"
                >
                    <DialogTitle sx={{ m: 2, p: 2 }}>
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                setOpenCode(false);
                            }}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500]
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="h1" align="center" color={theme.palette.secondary.dark}>
                            {classObj.code}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ marginBottom: 2, marginRight: 2 }}>
                        <Button
                            onClick={() => {
                                setOpenCode(false);
                            }}
                            variant="contained"
                            size="small"
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
                <IconButton aria-label="editIcon" onClick={() => setOpenEdit(true)}>
                    <EditIcon />
                </IconButton>
                <Dialog
                    open={openEdit}
                    onClose={() => {
                        setOpenEdit(false);
                    }}
                    width={100}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <DialogTitle fontSize="1.25rem">Editar clase</DialogTitle>
                    <DialogContent>
                        <TextField
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            margin="dense"
                            id="name"
                            label="Nombre de la clase"
                            fullWidth
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions sx={{ marginBottom: 2, marginRight: 2 }}>
                        <Button
                            onClick={() => {
                                setOpenEdit(false);
                            }}
                            color="error"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} variant="contained" size="small">
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardActions>
        </Card>
    );
};

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(TeacherClassCard);
