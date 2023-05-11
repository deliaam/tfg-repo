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

    // const { classObj } = useContext(ClassContext) || { classObj: { name: 'Clase' } };

    const { state } = useLocation();
    function getLink(pathname) {
        switch (pathname) {
            case 'classes':
                return { name: 'Clases', obj: {} };
            case 'class':
                return { name: state.classObj.name, obj: { classObj: state.classObj } };
            case 'task':
                return { name: state.taskObj.task.title, obj: { taskObj: state.taskObj, classObj: state.classObj } };
            case 'solution':
                return { name: state.solutionObj.userName, obj: { solutionObj: state.solutionObj } };
            default:
                return null;
        }
    }
    function LinkRouter({ to, state, ...rest }) {
        const navigate = useNavigate();

        const handleClick = (event) => {
            event.preventDefault();
            navigate(to, { state });
        };
        return <Link {...rest} component={RouterLink} onClick={handleClick} />;
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
                    const link = getLink(value);
                    if (link === null) return;
                    const obj = link.obj;
                    return last ? (
                        <Typography color="text.primary" key={to}>
                            {link.name}
                        </Typography>
                    ) : (
                        index != 0 && (
                            <LinkRouter underline="hover" color="inherit" to={to} key={to} state={obj}>
                                {link.name}
                            </LinkRouter>
                        )
                    );
                })}
            </Breadcrumbs>
        </MainCard>
    );
};

export default BreadcrumbsComponent;
