const { default: MainCard } = require('ui-components/MainCard');
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const FileComponent = ({ fileObj, removeFile, index }) => {
    const theme = useTheme();
    return (
        <MainCard size sx={{ background: theme.palette.secondary.light, border: theme.palette.secondary.light }}>
            <Grid container direction="row" spacing={2}>
                <Grid item alignSelf="center">
                    <DescriptionIcon></DescriptionIcon>
                </Grid>
                <Grid item alignSelf="center">
                    <Typography variant="body2">{fileObj.name}</Typography>
                </Grid>
                <Box sx={{ flexGrow: 1 }} />
                <Grid item>
                    <IconButton
                        onClick={() => {
                            removeFile(index);
                        }}
                    >
                        <DeleteIcon></DeleteIcon>
                    </IconButton>
                </Grid>
            </Grid>
        </MainCard>
    );
};
export default FileComponent;
