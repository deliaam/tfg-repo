import { lazy } from 'react';
import Loadable from 'ui-components/Loadable';

//layouts
import ClassListLayout from 'views/classList/ClassListLayout';
import ClassLayout from 'views/class/ClassLayout';
import TaskLayout from 'views/task/TaskLayout';

//panel
const ClassListPanel = Loadable(lazy(() => import('views/classList/ClassListPanel')));
const ClassPanel = Loadable(lazy(() => import('views/class/ClassPanel')));
const TaskPanel = Loadable(lazy(() => import('views/task/SolutionsPanel')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/home',
    children: [
        {
            path: 'classes',
            element: <ClassListLayout />,
            children: [
                {
                    path: '',
                    element: <ClassListPanel />
                }
            ]
        },
        {
            path: 'classes/class',
            element: <ClassLayout />,
            children: [
                {
                    path: '',
                    element: <ClassPanel />
                }
            ]
        },
        {
            path: 'classes/class/task',
            element: <TaskLayout />,
            children: [
                {
                    path: '',
                    element: <TaskPanel />
                }
            ]
        }
    ]
};

export default MainRoutes;
