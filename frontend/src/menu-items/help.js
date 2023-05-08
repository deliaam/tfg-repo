// assets
import InfoIcon from '@mui/icons-material/Info';

const help = {
    id: 'info',
    title: 'Información',
    type: 'group',
    children: [
        {
            id: 'info',
            title: 'Información',
            type: 'item',
            url: '/home/info/',
            icon: InfoIcon,
            breadcrumbs: false
        }
    ]
};

export default help;
