// assets
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const classes = {
    id: 'ranking',
    title: 'Ranking',
    type: 'group',
    children: [
        {
            id: 'ranking',
            title: 'Ranking',
            type: 'item',
            url: '/home/ranking/',
            icon: LeaderboardIcon,
            breadcrumbs: false
        }
    ]
};

export default classes;
