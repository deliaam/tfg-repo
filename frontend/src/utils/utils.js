import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useSelector } from 'react-redux';
export const getIcon = (qualification) => {
    switch (qualification) {
        case 'GOOD':
            return <ThumbUpAltIcon fontSize="large" color="success"></ThumbUpAltIcon>;
        case 'FAIR':
            return <ThumbDownAltIcon fontSize="large" color="warning"></ThumbDownAltIcon>;
        case 'POOR':
            return <ThumbDownAltIcon fontSize="large" color="error"></ThumbDownAltIcon>;
        default:
            return null;
    }
};
