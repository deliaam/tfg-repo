import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MainCard from 'ui-components/MainCard';
import ClassService from 'services/class.service';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Typography } from '@mui/material';
import { useContext } from 'react';
import { ClassContext } from 'contexts/class/ClassContext';

const BreadcrumbsComponent = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    console.log('context');

    const { classObj } = useContext(ClassContext) || { classObj: { name: 'Clase' } };
    function getName(pathname) {
        switch (pathname) {
            case 'classes':
                return 'Clases';
            case 'class':
                return classObj.name;
            case 'task':
                return 'Tarea';
            default:
                return null;
        }
    }
    function LinkRouter(props) {
        return <Link {...props} component={RouterLink} />;
    }
    return (
        <MainCard>
            <Breadcrumbs
                sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                {pathnames.map((value, index) => {
                    const last = index >= pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const name = getName(value);
                    if (name === null) return;
                    return last ? (
                        <Typography color="text.primary" key={to}>
                            {name}
                        </Typography>
                    ) : (
                        index != 0 && (
                            <LinkRouter underline="hover" color="inherit" to={to} key={to}>
                                {name}
                            </LinkRouter>
                        )
                    );
                })}
            </Breadcrumbs>
        </MainCard>
    );
};

export default BreadcrumbsComponent;
