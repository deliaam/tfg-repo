// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import { connect } from 'react-redux';
// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = (props) => {
    const navItems = props.menuItems.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(MenuList);
