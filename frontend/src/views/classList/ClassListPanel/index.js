import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

// project imports
import { Box } from '@mui/system';
import TeacherClassCard from './TeacherClassCard';
import ClassService from 'services/class.service';
import { connect } from 'react-redux';
import StudentClassCard from './StudentClassCard';
import { Grid } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MainCard from 'ui-components/MainCard';
import BreadcrumbsComponent from 'ui-components/BreadcrumbsComponent';
import { useDispatch } from 'react-redux';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ClassListPanel = (props) => {
    const [classList, setClassList] = useState(undefined);
    const [classObj, setClass] = useState(undefined);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getClasses = async () => {
        try {
            const response = await ClassService.getAllClasses(props.user.id, props.user.roles.includes('ROLE_TEACHER'));
            console.log(response);
            setClassList(response);
        } catch (error) {
            console.log(error);
            return {};
        }
    };
    const getClassById = async (id) => {
        if (id !== undefined) {
            try {
                const response = await ClassService.getClass(id);
                setClass(response);
                return response;
            } catch (error) {
                console.log(error);
                return {};
            }
        }
    };
    useEffect(() => {
        getClasses();
    }, []);

    const handleDeleteClass = (classId) => {
        const newClassList = classList.filter((cls) => cls.id !== classId);
        setClassList(newClassList);
    };

    const onClassClick = async (classId) => {
        const response = await getClassById(classId);
        if (response !== undefined) {
            dispatch({
                type: 'SAVE_CLASS',
                payload: { classObj: response }
            });
            navigate(`/home/classes/class/`, { state: { classObj: response } });
        }
    };

    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <Grid container direction="column" spacing={3}>
            <Grid item xs>
                <BreadcrumbsComponent />
            </Grid>
            <Grid item xs>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}>
                    {classList &&
                        props.user.roles.includes('ROLE_TEACHER') &&
                        classList.map((classObj) => (
                            <TeacherClassCard
                                key={classObj.id}
                                classObj={classObj}
                                handleDeleteClass={handleDeleteClass}
                                onClassClick={() => onClassClick(classObj.id)}
                            ></TeacherClassCard>
                        ))}
                    {classList &&
                        props.user.roles.includes('ROLE_STUDENT') &&
                        classList.map((classObj) => (
                            <StudentClassCard
                                key={classObj.id}
                                classObj={classObj}
                                handleDeleteClass={handleDeleteClass}
                                onClassClick={() => onClassClick(classObj.id)}
                            ></StudentClassCard>
                        ))}
                </Box>
            </Grid>
        </Grid>
    );
};

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(ClassListPanel);
