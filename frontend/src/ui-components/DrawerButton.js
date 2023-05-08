import { Avatar, ButtonBase } from '@mui/material';
import { IconMenu2 } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { SET_MENU } from 'store/actions';

const DrawerButton = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const leftDrawerOpened = useSelector((state) => state.menu.opened);
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
    };
    return (
        <>
            <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        '&:hover': {
                            background: theme.palette.secondary.dark,
                            color: theme.palette.secondary.light
                        }
                    }}
                    onClick={handleLeftDrawerToggle}
                    color="inherit"
                >
                    <IconMenu2 stroke={1.5} size="1.3rem" />
                </Avatar>
            </ButtonBase>
        </>
    );
};

export default DrawerButton;
