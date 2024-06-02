// assets
import NotificationsIcon from '@mui/icons-material/Notifications';

const requests = {
    id: 'requests',
    title: 'Peticiones',
    type: 'group',
    children: [
        {
            id: 'requests',
            title: 'Peticiones de revisión',
            type: 'item',
            url: '/home/classes/class/requests',
            icon: NotificationsIcon,
            breadcrumbs: false
        }
    ]
};
export default requests;
