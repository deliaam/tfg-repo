import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { red } from '@mui/material/colors';

export default function AlertDialog({ open, setOpen, title, body, agree = true, disagree = false, handle }) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <div style={{ marginTop: 10, marginRight: 10 }}>
                    {title && (
                        <DialogTitle id="alert-dialog-title" sx={{ fontSize: '1.25rem' }}>
                            {title}
                        </DialogTitle>
                    )}
                    {body && (
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">{body}</DialogContentText>
                        </DialogContent>
                    )}
                    <DialogActions sx={{ marginBottom: 2 }}>
                        {disagree && (
                            <Button onClick={handleClose} color="error">
                                Cancelar
                            </Button>
                        )}
                        {agree && (
                            <Button onClick={handle} variant="contained" size="small">
                                Aceptar
                            </Button>
                        )}
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}
