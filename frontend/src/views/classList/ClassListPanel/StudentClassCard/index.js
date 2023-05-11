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

const StudentClassCard = (props) => {
    const theme = useTheme();
    const [name] = useState(props.classObj.name);
    const sx = props.sx;
    const [openDelete, setOpenDelete] = useState(false);

    const deleteClass = async () => {
        try {
            const response = await ClassService.unjoinClass(props.classObj.id, props.user.id);
            if (response.status === 200) {
                props.handleDeleteClass(props.classObj.id);
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

export default connect(mapStateToProps)(StudentClassCard);
